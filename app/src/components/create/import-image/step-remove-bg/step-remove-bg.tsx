import { useRef, useState } from 'react'
import {useAppStateInContext } from '~/state/app.state'
import { imageFitWidth } from '~/utils/image.utils'
import { useContainerSize } from '~/hooks/container-size.hook'
import { useHtmlImage } from '~/hooks/html-image.hook'

export const StepRemoveBg = () => {
    const [image, closeImport, nextStep] = useAppStateInContext((state) => [
        state.importedImage,
        () => state.setDialog('addImage', false),
        state.importNextStep,
    ])
    const [state, setState] = useState<{
        removedImage: File | null
        loading: boolean
    }>({ removedImage: null, loading: false })

    const htmlImage = useHtmlImage(image)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const containerSize = useContainerSize(containerRef)

    const imageDimensionsToFit = imageFitWidth(
        htmlImage?.size || { width: 0, height: 0 },
        containerSize.width
    )

    const renderDimensions = {
        width: imageDimensionsToFit.width * 0.48,
        height: imageDimensionsToFit.height * 0.48,
    }

    const useOriginalImage = () => {
        nextStep(image!)
    }
    const useRmBgImage = () => {
        if (state.removedImage) nextStep(state.removedImage)
    }

    if (!image) return <>No Image</>

    const removeBackground = () => {
        setState((state) => ({ ...state, loading: true }))
        const data = new FormData()
        data.append('file', image)
        fetch('/api/remove-background', {
            method: 'POST',
            body: data,
        })
            .then(async (res) => {
                const blob = await res.blob()
                setState({
                    removedImage: new File([blob], 'removed-bg.png', { type: 'image/png' }),
                    loading: false,
                })
            })
            .catch((err) => {
                setState((state) => ({ ...state, loading: false }))
                console.log(err)
            })
    }

    return (
        <>
            <button
                className="btn btn-accent my-3 w-full"
                onClick={removeBackground}
                disabled={!!state.removedImage || state.loading}
            >
                Remove Background
            </button>
            <div className="flex w-full" ref={containerRef}>
                <div className="mx-auto flex flex-col">
                    <img
                        alt="imported-image"
                        src={URL.createObjectURL(image)}
                        {...renderDimensions}
                    ></img>
                    {state.removedImage && (
                        <button
                            className="btn btn-primary mx-auto mt-3"
                            data-cy="import-confirm"
                            onClick={useOriginalImage}
                        >
                            Use original image
                        </button>
                    )}
                </div>
                {state.loading || state.removedImage ? (
                    <div className="mx-auto flex flex-col">
                        {state.loading && (
                            <div
                                className="flex bg-neutral"
                                style={renderDimensions}
                            >
                                <span className="loading loading-spinner loading-lg m-auto"></span>
                            </div>
                        )}
                        {state.removedImage && (
                            <>
                                <img
                                    alt="image with removed background"
                                    src={URL.createObjectURL(state.removedImage)}
                                    {...renderDimensions}
                                ></img>
                                <button
                                    className="btn btn-primary mx-auto mt-3"
                                    data-cy="import-confirm"
                                    onClick={useRmBgImage}
                                >
                                    Use image without background
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div className="mt-3 flex justify-between">
                <button className="btn btn-neutral" onClick={closeImport}>
                    Cancel
                </button>
                {!state.removedImage && (
                    <button
                        className="btn btn-primary"
                        data-cy="import-confirm"
                        onClick={useOriginalImage}
                        disabled={state.loading}
                    >
                        Confirm
                    </button>
                )}
            </div>
        </>
    )
}
