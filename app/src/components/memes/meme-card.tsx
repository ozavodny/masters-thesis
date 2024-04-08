import { type FC } from 'react'
import { FaTrash } from 'react-icons/fa'
import { api } from '~/utils/query-api.utils'

export const MemeCard: FC<{
    meme: Awaited<
        ReturnType<(typeof api.meme.getInfiniteMemes)['query']>
    >['items'][0]
    onView: () => void
    refetch: () => Promise<unknown>
}> = ({ meme, refetch, onView }) => {
    return (
        <div className="card-compact card w-52 bg-base-100 shadow-xl transition-all hover:scale-105 hover:cursor-pointer hover:shadow-2xl m-auto" onClick={onView}>
            <figure>
                <img
                    alt={'meme image'}
                    className="max-h-44 object-fill"
                    src={meme.image.fileName}
                />
            </figure>
            <div className="card-body">
                <div className="card-actions">
                    <button
                        className="btn-error btn btn-outline flex-1"
                        onClick={(e) => {
                            e.stopPropagation()
                            api.meme.deleteMeme
                                .mutate({
                                    id: meme.id,
                                })
                                .then(refetch)
                                .catch(() => undefined)
                        }}
                    >
                        <FaTrash></FaTrash>
                    </button>
                </div>
            </div>
        </div>
    )
}
