import { type ChangeEventHandler, type FC } from 'react'
import { type ColorChangeHandler, SketchPicker } from 'react-color'
import { FaCog, FaTrash } from 'react-icons/fa'
import {useAppStateInContext } from '~/state/app.state'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

export const PropertiesText: FC<{
    id: string,
    previousObj?: {id: string, type: 'text' | 'image'},
    nextObj?: {id: string, type: 'text' | 'image'},
}> = ({ id, previousObj, nextObj }) => {
    const [text, updateText, deleteText, switchZIndexes] = useAppStateInContext((state) => [
        state.texts[id],
        state.updateText,
        state.deleteText,
        state.switchZIndexes
    ])

    if (!text) return <></>

    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (text) updateText(id, { ...text, text: event.target.value })
    }

    const handleColorChange: ColorChangeHandler = (color) => {
        if (text) updateText(id, { ...text, color: color.hex })
    }

    const handleStrokeColorChange: ColorChangeHandler = (color) => {
        if (text) updateText(id, { ...text, strokeColor: color.hex })
    }

    const handleFontSizeRange: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (text)
            updateText(id, {
                ...text,
                fontSize: parseInt(e.target.value) || 50,
            })
    }

    const moveZIndex = (direction: 'up' | 'down') => {
        if(direction === 'up') {
            if(previousObj) {
                switchZIndexes({type: 'text', id}, previousObj)
            }
        } else {
            if(nextObj) {
                switchZIndexes({type: 'text', id}, nextObj)
            }
        }
    }

    return (
        <div className="my-2 flex items-center rounded-lg bg-base-200">
            <div className="flex flex-col mx-2">
                <button className={`mb-1  ${!previousObj ? 'text-base-300' : 'text-base-content'}`} disabled={!previousObj} onClick={() => moveZIndex('up')}>
                    <FaArrowUp></FaArrowUp>
                </button>
                <button className={`mt-1 ${!nextObj ? 'text-base-300' : 'text-base-content'}`}  disabled={!nextObj} onClick={() => moveZIndex('down')}>
                    <FaArrowDown></FaArrowDown>
                </button>
            </div>
            <input
                className="input input-bordered w-full my-2"
                type="text"
                data-cy="properties-text-value"
                value={text.text}
                onChange={onChange}
            />
            <div className="ml-2 flex items-center">
                <div className="dropdown dropdown-end">
                    <div
                        className="tooltip tooltip-accent"
                        data-tip="Fill color"
                    >
                        <button className="btn btn-circle p-1">
                            <div
                                className="h-6 w-6 rounded-full"
                                style={{ backgroundColor: text.color }}
                            ></div>
                        </button>
                    </div>
                    <div
                        tabIndex={1}
                        className="card dropdown-content z-10 compact w-64 rounded-box bg-base-100 shadow"
                    >
                        <div className="card-body">
                            <h2 className="card-title">Text Color</h2>
                            <SketchPicker
                                onChange={handleColorChange}
                                color={text.color}
                            />
                        </div>
                    </div>
                </div>
                <div className="dropdown dropdown-end">
                    <div
                        className="tooltip tooltip-accent"
                        data-tip="Outline color"
                    >
                        <button className="btn btn-circle p-1">
                            <div
                                className="h-6 w-6 rounded-full"
                                style={{ backgroundColor: text.strokeColor }}
                            ></div>
                        </button>
                    </div>
                    <div
                        tabIndex={1}
                        className="card dropdown-content z-10 compact w-64 rounded-box bg-base-100 shadow"
                    >
                        <div className="card-body">
                            <h2 className="card-title">Text Outline Color</h2>
                            <SketchPicker
                                onChange={handleStrokeColorChange}
                                color={text.color}
                            />
                        </div>
                    </div>
                </div>
                <div className="dropdown dropdown-end">
                    <div
                        className="tooltip tooltip-accent"
                        data-tip="More options"
                    >
                        <button className="btn btn-circle" tabIndex={0}>
                            <FaCog size={20} />
                        </button>
                    </div>
                    <div
                        tabIndex={1}
                        className="card dropdown-content z-10 compact w-64 rounded-box bg-base-100 shadow"
                    >
                        <div className="card-body">
                            <h2 className="card-title">Text Options</h2>
                            <div className="form-control">
                                <label>Font Size</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    onChange={handleFontSizeRange}
                                    value={text.fontSize}
                                    className="range range-accent"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tooltip tooltip-accent mr-2" data-tip="Remove">
                    <button
                        className="btn btn-circle"
                        onClick={() => deleteText(id)}
                    >
                        <FaTrash size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
