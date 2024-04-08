import { type FC } from 'react'
import { MemeView } from '../common/meme-view'

export const ViewModal: FC<{
    open: boolean
    setOpen: (open: boolean) => void
    src: string
}> = ({ open, setOpen, src }) => {
    return (
        <div className={'modal' + (open ? ' modal-open' : '')}>
            <div className="modal-box">
                <MemeView src={src} canCopy={true}></MemeView>
                <div className="modal-action">
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
