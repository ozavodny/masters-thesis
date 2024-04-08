import { useRouter } from 'next/router'
import { type FC } from 'react'
import { FaTrash } from 'react-icons/fa'
import {useAppStateInContext } from '~/state/app.state'
import { api } from '~/utils/query-api.utils'

export const TemplateCard: FC<{
    editable: boolean
    selected?: boolean
    size: 'lg' | 'sm'
    template: Awaited<
        ReturnType<(typeof api.template.getInfiniteTemplates)['query']>
    >['items'][0]
    refetch?: () => Promise<unknown>
}> = ({ editable, template, size, selected, refetch = () => undefined }) => {
    const { push } = useRouter()
    const setTemplate = useAppStateInContext((state) => state.useTemplate)

    const chooseTemplate = () => {
        push('/')
            .then(() => setTemplate(template.id))
            .catch(() => undefined)
    }
    
    return (
        <div
            data-cy="template-card"
            className={`card-compact card bg-base-100 transition-all hover:scale-105 hover:cursor-pointer overflow-hidden m-auto ${
                size === 'sm' ? 'h-44 w-full' : 'w-52'
            } ${selected ? 'shadow-accent shadow-highlight' : 'shadow-lg shadow-base-300 hover:shadow-2xl'}`}
            onClick={chooseTemplate}
        >
            <figure className="h-full w-full">
                <img
                    className={`${
                        size === 'lg'
                            ? 'max-h-44 object-fill p-2'
                            : 'h-full w-full object-fill'
                    }`}
                    src={template.image.fileName}
                    alt={template.name}
                />
            </figure>
            {size === 'lg' && (
                <div className="card-body">
                    <h2 className={`card-title text-base`}>{template.name}</h2>
                    {editable && (
                        <div className="card-actions">
                            <button
                                data-cy="delete-template"
                                className="btn-outline btn-error btn flex-1"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    api.template.deleteTemplate
                                        .mutate({ id: template.id })
                                        .then(refetch)
                                        .catch(() => undefined)
                                }}
                            >
                                <FaTrash></FaTrash>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
