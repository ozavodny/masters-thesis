import { type GetServerSidePropsContext } from 'next'
import {
    getServerSession,
    type NextAuthOptions,
    type DefaultSession,
} from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import DiscordProvider from 'next-auth/providers/discord'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { env } from '~/env.mjs'
import { prisma } from '~/server/db'
import { type Provider } from 'next-auth/providers'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string
            // ...other properties
            // role: UserRole;
        } & DefaultSession['user']
    }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}

const providers: Provider[] = []

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    providers.push({
        id: 'development-provider',
        name: 'Development Provider',
        type: 'oauth',
        profile: () => {
            return {
                id: 'development-user-id',
                name: 'Developer',
                email: 'developer@zavodny.net',
                image: 'image/developer-profile.jpg',
            }
        },
        clientId: 'development',
        authorization: {
            url: 'http://localhost:3000/api/auth/development-login',
        },
        token: {
            url: 'http://localhost:3000/api/auth/development-login',
        },
        clientSecret: 'development-secret',
        userinfo: {
            url: 'http://localhost:3000/api/auth/development-login',
        },
    })
}

if (env.EMAIL_FROM && env.EMAIL_SERVER) {
    providers.push(
        EmailProvider({
            from: env.EMAIL_FROM,
            server: env.EMAIL_SERVER,
        })
    )
}

if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) {
    providers.push(
        DiscordProvider({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        })
    )
}

if (env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET) {
    providers.push(
        FacebookProvider({
            clientId: env.FACEBOOK_CLIENT_ID,
            clientSecret: env.FACEBOOK_CLIENT_SECRET,
        })
    )
}

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        })
    )
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id
                // session.user.role = user.role; <-- put other properties on the session here
            }
            return session
        },
    },
    adapter: PrismaAdapter(prisma),
    providers,
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext['req']
    res: GetServerSidePropsContext['res']
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions)
}
