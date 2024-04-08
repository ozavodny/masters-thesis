import { type FC } from 'react'

export const MemeView: FC<{ src: string; canCopy: boolean }> = ({
    src,
    canCopy,
}) => {
    const imageUrl = src.startsWith('/') ? `${window.location.host}${src}` : src

    return (
        <div>
            <img className="mb-4" alt="exported meme" src={src}></img>
            {canCopy && (
                <div className="flex">
                    <input
                        disabled
                        className="input-bordered input flex-1"
                        type="text"
                        value={imageUrl}
                    />
                    <button
                        className="btn-primary btn ml-4"
                        onClick={() => void navigator.clipboard.writeText(imageUrl)}
                    >
                        Copy
                    </button>
                </div>
            )}
        </div>
    )
}
