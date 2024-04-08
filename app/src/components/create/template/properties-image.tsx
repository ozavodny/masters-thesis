import { type FC } from 'react'
import { FaTrash } from 'react-icons/fa'
import {useAppStateInContext } from '~/state/app.state'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

export const PropertiesImage: FC<{
    id: string
    previousObj?: {id: string, type: 'text' | 'image'},
    nextObj?: {id: string, type: 'text' | 'image'},
}> = ({ id, previousObj, nextObj }) => {
    const [image, deleteImage, switchZIndexes] = useAppStateInContext((state) => [
        state.images[id]!,
        state.deleteImage,
        state.switchZIndexes
    ])

    const imgUrl = image.imageUrl || URL.createObjectURL(image.imageFile!)

    const moveZIndex = (direction: 'up' | 'down') => {
        if(direction === 'up') {
            if(previousObj) {
                switchZIndexes({type: 'image', id}, previousObj)
            }
        } else {
            if(nextObj) {
                switchZIndexes({type: 'image', id}, nextObj)
            }
        }
    }

    return (
        <div className="my-2 flex items-center rounded-lg bg-base-200 p-2">
            <div className="mx-2 flex flex-col">
                <button className={`mb-1  ${!previousObj ? 'text-base-300' : 'text-base-content'}`} disabled={!previousObj} onClick={() => moveZIndex('up')}>
                    <FaArrowUp></FaArrowUp>
                </button>
                <button className={`mt-1 ${!nextObj ? 'text-base-300' : 'text-base-content'}`}  disabled={!nextObj} onClick={() => moveZIndex('down')}>
                    <FaArrowDown></FaArrowDown>
                </button>
            </div>
            <div className="h-20 w-full">
                <img
                    alt="added meme image"
                    src={imgUrl}
                    className="h-full w-full object-contain"
                ></img>
            </div>
            <div className="ml-2 flex">
                <div className="tooltip tooltip-accent" data-tip="Remove">
                    <button
                        className="btn btn-circle"
                        onClick={() => deleteImage(id)}
                    >
                        <FaTrash size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
