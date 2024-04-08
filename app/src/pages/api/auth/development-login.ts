import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (process.env.NODE_ENV !== 'development') {
        res.status(404).end()
        return
    }

    if (req.method === 'GET') {
        if (req.query.redirect_uri) {
            const redirectUri = new URL(req.query.redirect_uri as string)
            redirectUri.searchParams.append('state', req.query.state as string)
            redirectUri.searchParams.append('code', 'development-code')

            res.redirect(redirectUri.toString())
        } else {
            const user = {
                id: 'development-user-id',
                name: 'Developer',
                emailVerified: true,
                email: 'developer@zavodny.net',
                image: 'image/developer-profile.jpg',
            }
            res.status(200).json(user)
        }
    }
    if (req.method === 'POST') {
        const token = {
            access_token: 'development-access-token',
            token_type: 'Bearer',
            expires_in: 3600,
        }

        res.status(200).json(token)
    } else {
        res.setHeader('Allow', 'GET')
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
