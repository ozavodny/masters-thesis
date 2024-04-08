import { type ChangeEventHandler, type DragEventHandler, type FC, useRef, useState } from "react"
import { fileIsImage } from "~/utils/image.utils"
import { type ImageActions } from "../create/import-image/step-import/step-import"

export const DragDropFile: FC<{ actions: ImageActions, loading: boolean }> = ({ actions: {setImage, setError}, loading }) => {
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleDrag: DragEventHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if(fileIsImage(file)) {
                setImage(file)
            } else {
                setError('Uploaded file is not an image.')
            }
        }
    }
    
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        console.log('inputChanged', e.target.files)
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if(fileIsImage(file)) {
                setImage(file)
            } else {
                setError('Uploaded file is not an image.')
            }
        }
      };

    return (
        <>
            <form
                className={`relative rounded-xl border-2 border-dashed ${loading ? 'border-neutral' : (dragActive ? 'border-primary' : 'border-accent')}`}
                onDragEnter={handleDrag}
                onSubmit={(e) => e.preventDefault()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple={false}
                    onChange={handleChange}
                />
                <label
                    className={dragActive ? 'text-primary' : ''}
                    htmlFor="input-file-upload"
                >
                    <div className="flex h-40 flex-col items-center justify-center">
                        <p className="m-2">Drag and drop your file here or</p>
                        <button
                            className="btn btn-neutral m-2 w-64"
                            disabled={loading}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Upload a file
                        </button>
                    </div>
                </label>
                {dragActive && (
                    <div
                        className="absolute left-0 top-0 h-full w-full"
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    ></div>
                )}
            </form>
        </>
    )
}