import type Konva from "konva";
import { type FC, useEffect, useRef } from "react";
import { type Size } from "react-advanced-cropper";
import { Transformer, Text } from "react-konva";
import { FRACTION_MULTIPLIER, TEXT_MULTIPLIER } from "~/const/canvas.const";
import {useAppStateInContext } from "~/state/app.state";

// We need to use stage size for the text to stay constant size no matter the screen size
export const CanvasText: FC<{ id: string, stageSize: Size }> = ({ id, stageSize }) => {
  const textRef = useRef<Konva.Text>(null);
  const transformRef = useRef<Konva.Transformer>(null);
  const [text, updateText, exportMemeOpen] = useAppStateInContext((state) => [state.texts[id], state.updateText, state.dialogs.exportMeme]);
  useEffect(() => {
    if (textRef.current !== null) {
      // we need to attach transformer manually
      transformRef?.current?.nodes([textRef.current]);
      transformRef?.current?.getLayer()?.batchDraw();
    }
  }, [text, textRef, transformRef]);

  if (!text) return <></>;

  return (
    <>
      <Text
        draggable
        fill={text.color}
        stroke={text.strokeColor}
        fillAfterStrokeEnabled={true}
        x={Math.round(text.x * stageSize.width / FRACTION_MULTIPLIER)}
        y={Math.round(text.y * stageSize.height / FRACTION_MULTIPLIER)}
        width={Math.round(text.width * stageSize.width / FRACTION_MULTIPLIER)}
        height={Math.round(text.height * stageSize.height / FRACTION_MULTIPLIER)}
        rotation={text.rotation}
        onDragEnd={(event) =>
          updateText(id, {
            ...text,
            x: event.target.x() * FRACTION_MULTIPLIER / stageSize.width,
            y: event.target.y() * FRACTION_MULTIPLIER / stageSize.height,
          })
        }
        strokeWidth={4}
        fontFamily="Impact"
        fontSize={Math.round(text.fontSize * stageSize.width / TEXT_MULTIPLIER)}
        onTransformEnd={() => {
          const node = textRef.current;
          if (node === null) {
            return;
          }
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);

          updateText(id, {
            ...text,
            x: node.x() * FRACTION_MULTIPLIER / stageSize.width,
            y: node.y() * FRACTION_MULTIPLIER / stageSize.height,
            rotation: node.rotation(),
            // set minimal value
            width: node.width() * scaleX * FRACTION_MULTIPLIER / stageSize.width,
            height: node.height() * scaleY * FRACTION_MULTIPLIER / stageSize.height,
          });
        }}
        text={text.text}
        ref={textRef}
        align="center"
        verticalAlign="middle"
      />
      {!exportMemeOpen && <Transformer ref={transformRef}></Transformer>}
    </>
  );
};
