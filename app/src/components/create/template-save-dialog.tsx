import { useSession } from 'next-auth/react'
import { type FC, useState } from 'react'
import {useAppStateInContext } from '~/state/app.state'

export const TemplateSaveDialog: FC = () => {
    const session = useSession()
    const [open, setOpen, template, updateTemplate, saveTemplate] =
        useAppStateInContext((state) => [
            state.dialogs.save,
            (open: boolean) => state.setDialog('save', open),
            state.template,
            state.updateTemplate,
            state.saveTemplate,
        ])

    const [overwrite, setOverwrite] = useState(false)

    return (
        <div className={'modal' + (open ? ' modal-open' : '')}>
            <div className="modal-box">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Template Name</span>
                    </label>
                    <input
                        type="text"
                        name="template-name"
                        value={template.name}
                        data-cy="template-name"
                        onChange={(e) =>
                            updateTemplate({ name: e.target.value })
                        }
                        className="input-bordered input w-full"
                    />
                </div>
                <div className="form-control mt-4">
                    <label className="label cursor-pointer">
                        <span className="label-text">Public</span>
                        <input
                            type="checkbox"
                            onChange={() =>
                                updateTemplate({ isPublic: !template.isPublic })
                            }
                            checked={template.isPublic}
                            className="checkbox"
                        />
                    </label>
                </div>
                {template.id && template.userId && template.userId === session.data?.user.id && <div className="form-control mt-4">
                    <label className="label cursor-pointer">
                        <span className="label-text">Overwrite existing template</span>
                        <input
                            type="checkbox"
                            onChange={() =>
                                setOverwrite(!overwrite)
                            }
                            checked={overwrite}
                            className="checkbox"
                        />
                    </label>
                </div>}
                <div className="modal-action">
                    <button
                        className="btn-error btn mr-auto"
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </button>
                    <button
                        className={`${template.name ? 'btn-primary': 'btn-disabled'} btn mr-auto`}
                        data-cy="dialog-save-template"
                        onClick={() => {
                            setOpen(false)
                            saveTemplate(overwrite && !!template.userId && template.userId === session.data?.user.id)
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}
