import { type FC, useState } from 'react'
import { type ImageActions } from './step-import'
import { type GenerateAiImageResponse } from '~/pages/api/generate-ai-image'

export const AiImport: FC<{ actions: ImageActions; loading: boolean }> = ({
    actions: { setImage, setError, setLoading },
    loading,
}) => {
    const [prompt, setPrompt] = useState('')

    const reloadImage = () => {
        setLoading()
        fetch(
            'api/generate-ai-image?' +
                new URLSearchParams({ prompt }).toString()
        )
            .then(async (response) => {
                const imageResponse =
                    (await response.json()) as GenerateAiImageResponse
                if (imageResponse.error) {
                    throw imageResponse.error
                } else {
                    const fileResponse = await fetch(
                        `data:image/png;base64,${imageResponse.base64}`
                    )
                    const imageFile = await fileResponse.blob()
                    setImage(
                        new File([imageFile], 'generated_image.png', {
                            type: 'image/png',
                        })
                    )
                }
            })
            .catch((error) =>
                setError(
                    typeof error === 'string' ? error : JSON.stringify(error)
                )
            )
    }
    return (
        <>
            <div className="mt-6 flex">
                <input
                    disabled={loading}
                    className="input input-accent w-full"
                    type="text"
                    placeholder="Generate image with AI"
                    onChange={(e) => setPrompt(e.target.value)}
                    value={prompt}
                ></input>

                <button
                    disabled={loading}
                    className="btn btn-accent ml-3"
                    onClick={reloadImage}
                >
                    Generate
                </button>
            </div>
        </>
    )
}
