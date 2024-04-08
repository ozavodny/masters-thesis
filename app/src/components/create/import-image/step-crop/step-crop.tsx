import { useRef } from 'react'
import {
    Cropper,
    type CropperRef,
    type DefaultSize,
} from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'
import {useAppStateInContext } from '~/state/app.state'

export const StepCrop = () => {
    const [image, nextStep, closeImport] = useAppStateInContext((state) => [
        state.importedImage,
        state.importNextStep,
        () => state.setDialog('addImage', false),
    ])
    const cropperRef = useRef<CropperRef>(null)
    
    if (!image) return <>No Image</>

    const defaultSize: DefaultSize = ({ imageSize, visibleArea }) => {
        return {
            width: (visibleArea || imageSize).width,
            height: (visibleArea || imageSize).height,
        }
    }

    const confirmCrop = () => {
        new Promise<Blob>((res, rej) => {
            const canvas = cropperRef.current?.getCanvas()
            if (!canvas) {
                rej()
                return
            }

            cropperRef.current?.getCanvas()?.toBlob((blob) => {
                if (blob) res(blob)
                else rej()
            })
        })
            .then((blob) => {
                nextStep(new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' }))
            })
            .catch(() => undefined)
    }

    return (
        <>
            <div className="flex h-96 flex-1 flex-col items-center justify-center">
                <Cropper
                    ref={cropperRef}
                    src={URL.createObjectURL(image)}
                    defaultSize={defaultSize}
                ></Cropper>
            </div>
            <div className="flex justify-between">
                <button className="btn-neutral btn" onClick={closeImport}>
                    Cancel
                </button>
                <button
                    className="btn-primary btn"
                    data-cy="import-confirm"
                    onClick={confirmCrop}
                >
                    Confirm
                </button>
            </div>
        </>
    )
}
