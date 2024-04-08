import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

export const userRouter = createTRPCRouter({
    updateUserName: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: name }) => {
            await ctx.prisma.user.update({
                where: { id: ctx.session.user.id },
                data: { name },
            })

            return true
        }),
    updateProfileImage: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: image }) => {
            await ctx.prisma.user.update({
                where: { id: ctx.session.user.id },
                data: { image },
            })

            return true
        }),
})
