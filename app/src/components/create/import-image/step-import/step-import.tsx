import { useState, useRef, type ClipboardEventHandler } from 'react'
import { AiImport } from './ai-import'
import { Alert } from '~/components/common/alert'
import { DragDropFile } from '../../../common/drag-drop'
import { ImportUrl } from './url'
import { useContainerSize } from '~/hooks/container-size.hook'
import { fileIsImage, htmlImageFromFileOrUrl, imageFitWidth } from '~/utils/image.utils'
import { type Size } from '~/types/common.types'
import {useAppStateInContext } from '~/state/app.state'

export interface ImageActions {
    setImage: (image: File) => void
    setError: (error: string) => void
    setLoading: () => void
}

export const StepImport = () => {
    const [state, setState] = useState<{
        image: File | null
        dimensions: Size | null
        error: string | null
        loading: boolean
    }>({ image: null, error: null, loading: false, dimensions: null })
    const [nextStep, closeImport] = useAppStateInContext((state) => [state.importNextStep, () => state.setDialog('addImage', false)])

    const setImage = (image: File) => {
        setState({ image: null, error: null, loading: true, dimensions: null })
        htmlImageFromFileOrUrl(image)
            .then((img) => {
                setState({
                    image,
                    error: null,
                    loading: false,
                    dimensions: img.size,
                })
            })
            .catch(() => undefined)
    }

    const setError = (error: string) => {
        setState({ image: null, error, loading: false, dimensions: null })
    }

    const setLoading = () => {
        setState({ image: null, error: null, loading: true, dimensions: null })
    }

    const imageActions: ImageActions = {
        setImage,
        setError,
        setLoading,
    }

    const containerRef = useRef<HTMLDivElement | null>(null)
    const containerSize = useContainerSize(containerRef)

    const renderDimensions = imageFitWidth(
        state.dimensions || { width: 0, height: 0 },
        containerSize.width
    )

    const cancelLocal = () => {
        setState({ image: null, error: null, loading: false, dimensions: null })
        closeImport()
    }
    
    const handlePaste: ClipboardEventHandler<HTMLDivElement> = (e) => {
        if (e.clipboardData.files && e.clipboardData.files[0]) {
            const file = e.clipboardData.files[0]
            if(fileIsImage(file)) {

                setImage(file)
            } else {
                setError('Pasted clipboard file is not an image.')
            }
        }
    }

    return (
        <div onPaste={handlePaste}>
            <AiImport loading={state.loading} actions={imageActions}></AiImport>
            <div className="divider divider-neutral">OR</div>
            <DragDropFile
                loading={state.loading}
                actions={imageActions}
            ></DragDropFile>
            <div className="divider divider-neutral">OR</div>
            <ImportUrl
                loading={state.loading}
                actions={imageActions}
            ></ImportUrl>
            <div className="flex flex-col">
                <div className="w-full" ref={containerRef}>
                    {state.image ? (
                        <>
                            <div className="divider divider-accent"></div>
                            <img
                                alt="imported-image"
                                src={URL.createObjectURL(state.image)}
                                {...renderDimensions}
                            ></img>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
                {state.error ? (
                    <Alert type="error">{state.error}</Alert>
                ) : (
                    <></>
                )}
                {state.loading ? (
                    <span className="loading loading-spinner loading-lg mx-auto"></span>
                ) : (
                    <></>
                )}
                <div className="mt-5 flex w-full justify-between">
                    <button className="btn-neutral btn" onClick={cancelLocal}>
                        Cancel
                    </button>
                    <button
                        disabled={state.image === null}
                        className="btn-primary btn"
                        onClick={() => state.image && nextStep(state.image)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}
