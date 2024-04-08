import { queryApi } from '~/utils/query-api.utils'
import { type FC, Fragment, useState } from 'react'
import { ViewModal } from './view-modal'
import Link from 'next/link'
import { MemeCard } from './meme-card'

const MemeList: FC = () => {
    const [state, setState] = useState({ open: false, src: '' })

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
        queryApi.meme.getInfiniteMemes.useInfiniteQuery(
            {
                limit: 12,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        )

    return (
        <>
            <div
                className={`grid w-11/12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 items-center justify-center gap-4 self-center rounded-lg bg-base-200 p-4 2xl:w-3/4`}
            >
                {data &&
                    ((data.pages[0]?.items.length || 0) > 0 ? (
                        data.pages.map((group, i) => (
                            <Fragment key={i}>
                                {group.items.map((meme) => (
                                    <MemeCard
                                        key={meme.id}
                                        meme={meme}
                                        refetch={refetch}
                                        onView={() =>
                                            setState({
                                                open: true,
                                                src: meme.image.fileName,
                                            })
                                        }
                                    ></MemeCard>
                                ))}
                            </Fragment>
                        ))
                    ) : (
                        <div className="flex flex-col items-center col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6">
                            <h2 className="mb-4 text-2xl font-bold">No memes found!</h2>
                            <Link href={'/'} className="btn-primary btn">
                                Create some memes!
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
            <ViewModal
                src={state.src}
                open={state.open}
                setOpen={(open) => setState((state) => ({ ...state, open }))}
            ></ViewModal>
        </>
    )
}

export default MemeList
