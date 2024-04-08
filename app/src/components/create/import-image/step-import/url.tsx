import { type FC, useState } from 'react'
import { getImageFromUrl } from '~/utils/image.utils'
import { type ImageActions } from './step-import'

export const ImportUrl: FC<{ actions: ImageActions; loading: boolean }> = ({
    actions: { setImage, setError },
    loading,
}) => {
    const [url, setUrl] = useState('')

    return (
        <div className="mb-4 flex justify-center">
            <input
                type="text"
                onChange={(e) => setUrl(e.currentTarget.value)}
                placeholder="Paste URL of image"
                className="input-accent input w-full"
                disabled={loading}
            />
            <button
                className="btn-accent btn ml-2"
                disabled={loading}
                onClick={() => {
                    getImageFromUrl(url)
                        .then((image) => {
                            if (image) {
                                setImage(image)
                            } else {
                                setError("Couldn't get image from URL")
                            }
                        })
                        .catch(() => setError("Couldn't get image from URL"))
                }}
            >
                Use
            </button>
        </div>
    )
}
