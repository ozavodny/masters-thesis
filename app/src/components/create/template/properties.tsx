import {useAppStateInContext } from '~/state/app.state'
import { PropertiesText } from './properties-text'
import { useSession } from 'next-auth/react'
import { Alert } from '~/components/common/alert'
import { type FC } from 'react'
import { PropertiesImage } from './properties-image'
import { sortTemplateObjects } from '~/utils/render.utils'

export const Properties: FC<{ exportMeme: () => void }> = ({ exportMeme }) => {
    const [texts, images, setSaveDialogOpen] = useAppStateInContext((state) => [
        state.texts,
        state.images,
        (open: boolean) => state.setDialog('save', open),
    ])
    const session = useSession()

    return (
        <div className="ml-4 flex flex-col">
            {sortTemplateObjects(texts, images).map((obj, rank, arr) => {
                const previousObj = rank === 0 ? undefined : arr[rank - 1]
                const previousObjToPass = previousObj ? {id: previousObj.id, type: previousObj.type} : undefined
                const nextObj =
                    rank === arr.length - 1 ? undefined : arr[rank + 1]
                const nextObjToPass = nextObj ? {id: nextObj.id, type: nextObj.type} : undefined
                if (obj.type === 'text') {
                    return (
                        <PropertiesText
                            id={obj.id}
                            key={obj.id}
                            previousObj={previousObjToPass}
                            nextObj={nextObjToPass}
                        />
                    )
                } else
                    return (
                        <PropertiesImage
                            id={obj.id}
                            key={obj.id}
                            previousObj={previousObjToPass}
                            nextObj={nextObjToPass}
                        />
                    )
            })}
            <div className="mb-4 mt-4 flex gap-4">
                {session?.data?.user && (
                    <button
                        onClick={() => setSaveDialogOpen(true)}
                        className="btn flex-1"
                        data-cy="save-template"
                    >
                        Save Template
                    </button>
                )}
                <button onClick={exportMeme} className="btn flex-1">
                    Export Meme
                </button>
            </div>
            {!session?.data?.user && (
                <div className="mx-auto mb-4 mt-4">
                    <Alert type="warning">Log in to save templates.</Alert>
                </div>
            )}
        </div>
    )
}
