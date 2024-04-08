import { z } from 'zod'
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from '~/server/api/trpc'
import { TRPCError } from '@trpc/server'
import {
    TemplateSchema,
    TemplateTextSchema,
    TemplateImageSchema,
} from 'prisma/generated/zod'

export const templateRouter = createTRPCRouter({
    createTemplate: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                isPublic: z.boolean(),
                fileName: z.string(),
                texts: z.array(
                    TemplateTextSchema.omit({ id: true, templateId: true })
                ),
                images: z.array(
                    TemplateImageSchema.omit({
                        id: true,
                        templateId: true,
                        imageId: true,
                    }).and(z.object({ imageFileName: z.string() }))
                ),
            })
        )
        .query(
            async ({
                ctx,
                input: { fileName, texts, name, isPublic, images },
            }) => {
                if (!ctx.session.user) {
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                    })
                }

                const image = await ctx.prisma.image.create({
                    data: {
                        fileName,
                    },
                })
                const template = await ctx.prisma.template.create({
                    data: {
                        name,
                        isPublic,
                        imageId: image.id,
                        userId: ctx.session.user.id,
                    },
                })

                const textPromises = texts.map((text) =>
                    ctx.prisma.templateText.create({
                        data: {
                            templateId: template.id,
                            ...text,
                        },
                    })
                )
                const imagePromises = images.map(async (image) => {
                    const imagePrisma = await ctx.prisma.image.create({
                        data: {
                            fileName: image.imageFileName,
                        },
                    })
                    const newImage = { ...image, imageFileName: undefined }
                    return ctx.prisma.templateImage.create({
                        data: {
                            templateId: template.id,
                            ...newImage,
                            imageId: imagePrisma.id,
                        },
                        include: {
                            image: true
                        }
                    })
                })

                return {
                    ...template,
                    texts: await Promise.all(textPromises),
                    images: await Promise.all(imagePromises),
                }
            }
        ),
    updateTemplate: protectedProcedure
        .input(
            z.object({
                template: TemplateSchema.omit({ imageId: true, userId: true }),
                texts: z.array(
                    TemplateTextSchema.omit({ id: true, templateId: true })
                ),
                images: z.array(
                    TemplateImageSchema.omit({
                        id: true,
                        templateId: true,
                        imageId: true,
                    }).and(z.object({ imageFileName: z.string() }))
                ),
            })
        )
        .query(async ({ ctx, input: { texts, images, template } }) => {
            // try to find previous template
            const oldTemplate = await ctx.prisma.template.findFirst({
                where: {
                    id: template.id,
                },
                include: {
                    image: true,
                },
            })
            if (!oldTemplate || oldTemplate.userId != ctx.session.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Cannot update template.',
                })
            }

            await ctx.prisma.templateText.deleteMany({
                where: {
                    template: {
                        id: oldTemplate.id,
                    },
                },
            })
            await ctx.prisma.templateImage.deleteMany({
                where: {
                    template: {
                        id: oldTemplate.id,
                    },
                },
            })

            const newTemplate = await ctx.prisma.template.update({
                where: {
                    id: template.id,
                },
                data: {
                    ...template,
                },
            })

            const textPromises = texts.map((text) =>
                ctx.prisma.templateText.create({
                    data: {
                        templateId: template.id,
                        ...text,
                    },
                })
            )

            const imagePromises = images.map(async (image) => {
                const imagePrisma = await ctx.prisma.image.create({
                    data: {
                        fileName: image.imageFileName,
                    },
                })
                const newImage = { ...image, imageFileName: undefined }
                return ctx.prisma.templateImage.create({
                    data: {
                        templateId: template.id,
                        ...newImage,
                        imageId: imagePrisma.id,
                    },
                    include: {
                        image: true,
                    },
                })
            })

            return {
                ...newTemplate,
                texts: await Promise.all(textPromises),
                images: await Promise.all(imagePromises),
            }
        }),
    deleteTemplate: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input: { id } }) => {
            const template = await ctx.prisma.template.findFirst({
                where: {
                    id,
                },
            })
            if (!template || template.userId != ctx.session.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Cannot delete template.',
                })
            }

            await ctx.prisma.template.delete({
                where: {
                    id,
                },
            })
        }),
    getTemplate: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const template = await ctx.prisma.template.findUnique({
                where: {
                    id: input,
                },
                include: {
                    image: true,
                    texts: true,
                    images: {
                        include: {
                            image: true,
                        },
                    },
                },
            })

            if (
                !template ||
                (!template.isPublic && template.userId != ctx.session?.user.id)
            ) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Cannot get template.',
                })
            }

            return {
                ...template,
            }
        }),
    getInfiniteTemplates: publicProcedure
        .input(
            z.object({
                fetch: z.enum(['fromUser', 'public', 'all']),
                limit: z.number().min(1).max(100),
                cursor: z.string().nullish(),
                searchString: z.string().optional(),
            })
        )
        .query(
            async ({ ctx, input: { fetch, limit, cursor, searchString } }) => {
                const items = await ctx.prisma.template.findMany({
                    select: {
                        id: true,
                        image: true,
                        name: true,
                    },
                    where: {
                        AND: [
                            {
                                OR: [
                                    ...((fetch === 'fromUser' ||
                                        fetch === 'all') &&
                                    ctx.session?.user.id
                                        ? [
                                              {
                                                  userId: ctx.session.user.id,
                                              },
                                          ]
                                        : []),
                                    ...(fetch === 'public' || fetch === 'all'
                                        ? [
                                              {
                                                  isPublic: true,
                                              },
                                          ]
                                        : []),
                                ],
                            },
                            ...(searchString
                                ? searchString.split(' ').map((word) => ({
                                      name: {
                                          contains: word,
                                      },
                                  }))
                                : []),
                        ],
                    },
                    cursor: cursor ? { id: cursor } : undefined,
                    orderBy: {
                        id: 'asc',
                    },
                    take: limit + 1,
                })
                let nextCursor: typeof cursor | undefined = undefined

                if (items.length > limit) {
                    const nextItem = items.pop()
                    nextCursor = nextItem!.id
                }

                return {
                    items,
                    nextCursor,
                }
            }
        ),
})
