import { type FC } from 'react'
import { useAppStateInContext, type PopupType } from '~/state/app.state'
import { Alert } from './alert'
import { FaTimes } from 'react-icons/fa'

export const Popup: FC<{ popup: PopupType }> = ({ popup }) => {
    const removePopup = useAppStateInContext((state) => state.removePopup)
    return (
        <div className={`mt-6 w-96`} data-cy="popup">
            <Alert type={popup.type}>
                <span className="m-auto">{popup.message}</span>
                <a
                    className="cursor-pointer"
                    onClick={() => removePopup(popup.id)}
                >
                    <FaTimes></FaTimes>
                </a>
            </Alert>
        </div>
    )
}
