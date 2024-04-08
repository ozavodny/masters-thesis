import { type FC, type MutableRefObject, useRef } from 'react'
import { FaFont, FaImage } from 'react-icons/fa'
import { Layer, Stage, Image } from 'react-konva'
import { useContainerSize } from '~/hooks/container-size.hook'
import {useAppStateInContext } from '~/state/app.state'
import { imageFitWidth } from '~/utils/image.utils'
import { CanvasText } from './canvas-text'
import { useHtmlImage } from '~/hooks/html-image.hook'
import type Konva from 'konva'
import { CanvasImage } from './canvas-image'
import { sortTemplateObjects } from '~/utils/render.utils'

export const Canvas: FC<{ stageRef: MutableRefObject<Konva.Stage | null> }> = ({
    stageRef,
}) => {
    const [image, template, texts, addText, images, openAddImage] = useAppStateInContext(
        (state) => [
            state.background,
            state.template,
            state.texts,
            state.addText,
            state.images,
            state.openImport,
        ]
    )

    const img = useHtmlImage(image)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const containerSize = useContainerSize(containerRef)

    const imageSize = imageFitWidth(
        img?.size || { width: 0, height: 0 },
        containerSize.width
    )

    const addImage = () => {
        openAddImage()
    }

    return (
        <div className="flex flex-col rounded-xl bg-base-200 p-4">
            <div className="mb-2 text-center text-xl">{template.name}</div>
            <div className="mb-2 flex">
                <button
                    className="tooltip tooltip-accent flex h-8 w-8 rounded bg-neutral text-neutral-content"
                    data-tip="Add Text"
                    data-cy="canvas-add-text"
                    onClick={addText}
                >
                    <FaFont className="m-auto"></FaFont>
                </button>
                <button
                    className="tooltip tooltip-accent ml-3 flex h-8 w-8 rounded bg-neutral text-neutral-content"
                    data-tip="Add Image"
                    onClick={addImage}
                >
                    <FaImage className="m-auto"></FaImage>
                </button>
            </div>
            <div ref={containerRef} className="m-auto w-full">
                <Stage {...imageSize} ref={stageRef}>
                    <Layer>
                        {img && (
                            <Image
                                alt="meme background"
                                image={img.el}
                                x={0}
                                y={0}
                                {...imageSize}
                            ></Image>
                        )}
                        {sortTemplateObjects(texts, images).map((obj) => {
                            if (obj.type === 'text') {
                                return (
                                    <CanvasText
                                        id={obj.id}
                                        key={obj.id}
                                        stageSize={imageSize}
                                    />
                                )
                            } else
                                return (
                                    <CanvasImage
                                        id={obj.id}
                                        key={obj.id}
                                        stageSize={imageSize}
                                    />
                                )
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
    )
}
