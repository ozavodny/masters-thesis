import {useAppStateInContext } from '~/state/app.state'
import { queryApi } from '~/utils/query-api.utils'
import { TemplateCreate } from './template-create'
import { TemplateCard } from '../common/template-card'
import Link from 'next/link'
import { ImportImageDialog } from './import-image/import-image'

const CreateTemplate = () => {
    const [background, openImageImport, stateTemplateId] = useAppStateInContext((state) => [
        state.background,
        state.openImport,
        state.template.id,
    ])

    const templateList = queryApi.template.getInfiniteTemplates.useQuery({
        limit: background ? 6 : 13,
        fetch: 'all',
    })

    return (
        <>
            <div
                className={`grid w-11/12 grid-cols-7 items-center gap-4 self-center rounded-lg bg-base-200 p-4 2xl:w-2/3`}
            >
                <button
                    data-cy="import-custom"
                    onClick={() => openImageImport(true)}
                    className="h-44 rounded-xl border-2 border-dashed border-accent bg-base-300 p-4 text-base-content"
                >
                    Import custom background
                </button>
                {templateList.data &&
                    templateList.data.items.map((template) => (
                        <TemplateCard
                            key={template.id}
                            editable={false}
                            template={template}
                            size="sm"
                            selected={
                                !!background && template.id === stateTemplateId
                            }
                        ></TemplateCard>
                    ))}
                <Link className="col-span-7 btn btn-primary" href="/all-templates">More templates</Link>
            </div>
            {background && <TemplateCreate></TemplateCreate>}
            <ImportImageDialog></ImportImageDialog>
        </>
    )
}

export default CreateTemplate
