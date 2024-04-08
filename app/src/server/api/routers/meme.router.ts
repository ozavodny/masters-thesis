import { z } from 'zod'
import {
    createTRPCRouter,
    protectedProcedure,
} from '~/server/api/trpc'
import { TRPCError } from '@trpc/server'

export const memeRouter = createTRPCRouter({
    createMeme: protectedProcedure
        .input(z.object({ fileName: z.string() }))
        .query(async ({ ctx, input: { fileName } }) => {
            const image = await ctx.prisma.image.create({
                data: {
                    fileName,
                },
            })

            const meme = await ctx.prisma.meme.create({
                data: {
                    imageId: image.id,
                    userId: ctx.session.user.id,
                },
            })
            return {
                ...meme,
                imagePath: fileName,
            }
        }),
    deleteMeme: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input: { id } }) => {
            const meme = await ctx.prisma.meme.findFirst({
                where: {
                    id,
                },
            })
            if (!meme || meme.userId != ctx.session.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Cannot update template.',
                })
            }

            await ctx.prisma.meme.delete({
                where: {
                    id,
                },
            })
            await ctx.prisma.image.delete({
                where: {
                    id: meme.imageId,
                },
            })
        }),
    getInfiniteMemes: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100),
                cursor: z.string().nullish(),
            })
        )
        .query(async ({ ctx, input: { limit, cursor } }) => {
            const items = await ctx.prisma.meme.findMany({
                select: {
                    id: true,
                    image: {
                        select: {
                            fileName: true,
                        },
                    },
                },
                where: {
                    userId: ctx.session.user.id,
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
        }),
})
