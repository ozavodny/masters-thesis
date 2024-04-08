import {useAppStateInContext } from '~/state/app.state'
import { useRef } from 'react'
import { TemplateSaveDialog } from './template-save-dialog'
import { Canvas } from './template/canvas'
import { Properties } from './template/properties'
import type Konva from 'konva'
import { ExportMemeDialog } from './export-meme-dialog'
import { useSession } from 'next-auth/react'

export const TemplateCreate = () => {
    const session = useSession()
    const [exportMeme, setExportedMeme, setExportMemeDialog] = useAppStateInContext(
        (state) => [
            state.exportMeme,
            state.setExportedMeme,
            (open: boolean) => state.setDialog('exportMeme', open),
        ]
    )
    const stageRef = useRef<Konva.Stage | null>(null)

    const exportMemeFn = () => {
        setExportedMeme(null)
        setExportMemeDialog(true)

        if (!stageRef.current) return

        stageRef.current?.toBlob({
            callback: (file) => {
                exportMeme(file, !!session.data?.user)
            },
        }).catch(() => undefined)

    }

    return (
        <>
            <div
                className="grid w-11/12 2xl:w-2/3 flex-1 grid-cols-1 lg:grid-cols-2 self-center mt-6 mb-6"
                style={{ gridTemplateRows: 'min-content 1fr min-content' }}
            >
                <Canvas stageRef={stageRef}></Canvas>
                <Properties exportMeme={exportMemeFn}></Properties>
            </div>
            <TemplateSaveDialog></TemplateSaveDialog>
            <ExportMemeDialog></ExportMemeDialog>
        </>
    )
}
