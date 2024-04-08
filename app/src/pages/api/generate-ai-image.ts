import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from '~/env.mjs'

export type GenerateAiImageResponse = {
    base64: string
    error?: never
} | {
    base64?: never
    error: string
}

interface StabilityApiResponse {
    artifacts: { base64: string }[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GenerateAiImageResponse>
) {
    if(!req.query.prompt) {
        res.status(400).send({ error: 'Missing prompt' })
        return
    }

    const apiHost = 'https://api.stability.ai'
    const engineId = 'stable-diffusion-v1-6'

    const apiKey = env.STABILITY_AI_API_KEY

    const response = await fetch(`${apiHost}/v1/generation/${engineId}/text-to-image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            text_prompts: [
                {
                    text: req.query.prompt,
                },
            ],
            height: 512,
            width: 512,
            samples: 1,
            steps: 15,
        }),
    })

    const responseJson = await response.json() as StabilityApiResponse

    if (responseJson?.artifacts?.length > 0) {
        const base64 = responseJson.artifacts[0]?.base64 as string
        res.status(200).send({ base64 })
    } else {
        console.log(responseJson)
        res.status(500).send({ error: 'API didn\'t return an image' })
    }
}
