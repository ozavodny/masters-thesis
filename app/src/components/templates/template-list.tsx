import { queryApi } from '~/utils/query-api.utils'
import { type FC, Fragment, useState } from 'react'
import { TemplateCard } from '../common/template-card'
import { TemplateSearch } from './search'
import Link from 'next/link'

const TemplateList: FC<{
    fetch: 'all' | 'fromUser'
    editable?: boolean
}> = ({ editable, fetch }) => {
    const [searchString, setSearchString] = useState('')

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
        queryApi.template.getInfiniteTemplates.useInfiniteQuery(
            {
                limit: 12,
                fetch,
                searchString,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        )

    return (
        <div className="mb-5 flex w-11/12 flex-col self-center rounded-lg bg-base-200 2xl:w-2/3">
            <TemplateSearch
                searchString={searchString}
                setSearchString={setSearchString}
            ></TemplateSearch>
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 items-center justify-center gap-4 p-4`}>
                {data &&
                    ((data.pages[0]?.items.length || 0) > 0 ? (
                        data.pages.map((group, i) => (
                            <Fragment key={i}>
                                {group.items.map((template) => (
                                    <TemplateCard
                                        size="lg"
                                        editable={editable || false}
                                        key={template.id}
                                        template={template}
                                        refetch={refetch}
                                    ></TemplateCard>
                                ))}
                            </Fragment>
                        ))
                    ) : (
                        <div className="flex flex-col items-center col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6">
                            <h2 className="mb-4 text-2xl font-bold">No templates found!</h2>
                            <Link
                                href={'/all-templates'}
                                className="btn-primary btn"
                            >
                                Show public templates
                            </Link>
                        </div>
                    ))}
                {hasNextPage && !isFetchingNextPage && (
                    <button
                        className="btn-primary btn w-full col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6"
                        onClick={() => {
                            fetchNextPage().catch(() => undefined)
                        }}
                    >
                        Load more
                    </button>
                )}
            </div>
        </div>
    )
}

export default TemplateList
