import { useSession } from 'next-auth/react'
import {useAppStateInContext } from '~/state/app.state'
import { Alert } from '../common/alert'
import { MemeView } from '../common/meme-view'

export const ExportMemeDialog = () => {
    const session = useSession()
    const [open, setOpen, exportedMeme] = useAppStateInContext((state) => [
        state.dialogs.exportMeme,
        (open: boolean) => state.setDialog('exportMeme', open),
        state.exportedMeme,
    ])

    const authenticated = !!session.data?.user

    return (
        <div className={'modal' + (open ? ' modal-open' : '')}>
            <div className="modal-box">
                {exportedMeme ? (
                    <MemeView src={exportedMeme} canCopy={!!exportedMeme && authenticated}></MemeView>
                ) : (
                    <span className="text-center mb-4">Loading...</span>
                )}
                {!authenticated && (
                    <Alert type="warning">Login to get a sharable url.</Alert>
                )}
                <div className="modal-action flex">
                    <button
                        className="btn-error btn mr-auto"
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
