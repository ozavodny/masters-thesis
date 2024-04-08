import { type FC } from 'react'

export const TemplateSearch: FC<{
    searchString: string
    setSearchString: (search: string) => void
}> = ({ searchString, setSearchString }) => {
    return (
        <div className="form-control mt-5 mx-4">
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Search…"
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                    className="input-bordered input w-full"
                />
                <button className="btn-square btn">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}
