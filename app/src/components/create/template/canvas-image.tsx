import { Image, Transformer } from "react-konva"
import { type FC, useEffect, useRef } from "react";
import { type Size } from "react-advanced-cropper";
import {useAppStateInContext } from "~/state/app.state";
import { useHtmlImage } from "~/hooks/html-image.hook";
import { FRACTION_MULTIPLIER } from "~/const/canvas.const";
import type Konva from "konva";

// We need to use stage size for the text to stay constant size no matter the screen size
export const CanvasImage: FC<{ id: string, stageSize: Size }> = ({ id, stageSize }) => {
  const imageRef = useRef<Konva.Image>(null);
  const transformRef = useRef<Konva.Transformer>(null);
  const [image, updateImage, exportMemeOpen] = useAppStateInContext((state) => [state.images[id]!, state.updateImage, state.dialogs.exportMeme]);

  const img = useHtmlImage(image?.imageFile || image?.imageUrl || null)
  
  useEffect(() => {
    if (imageRef.current !== null) {
      // we need to attach transformer manually
      transformRef?.current?.nodes([imageRef.current]);
      transformRef?.current?.getLayer()?.batchDraw();
    }
  }, [image, imageRef, transformRef]);

  if (!image || !img) return <></>;

  return (
    <>
      <Image
        alt="imported image"
        draggable
        x={Math.round(image.x * stageSize.width / FRACTION_MULTIPLIER)}
        y={Math.round(image.y * stageSize.height / FRACTION_MULTIPLIER)}
        width={Math.round(image.width * stageSize.width / FRACTION_MULTIPLIER)}
        height={Math.round(image.height * stageSize.height / FRACTION_MULTIPLIER)}
        rotation={image.rotation}
        image={img.el}
        ref={imageRef}
        onDragEnd={(event) =>
          updateImage(id, {
            ...image,
            x: event.target.x() * FRACTION_MULTIPLIER / stageSize.width,
            y: event.target.y() * FRACTION_MULTIPLIER / stageSize.height,
          })
        }
        onTransformEnd={() => {
          const node = imageRef.current;
          if (node === null) {
            return;
          }
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);

          updateImage(id, {
            ...image,
            x: node.x() * FRACTION_MULTIPLIER / stageSize.width,
            y: node.y() * FRACTION_MULTIPLIER / stageSize.height,
            rotation: node.rotation(),
            // set minimal value
            width: node.width() * scaleX * FRACTION_MULTIPLIER / stageSize.width,
            height: node.height() * scaleY * FRACTION_MULTIPLIER / stageSize.height,
          });
        }}
      />
      {!exportMemeOpen && <Transformer ref={transformRef}></Transformer>}
    </>
  );
};
