import { signIn, signOut, useSession } from 'next-auth/react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useContext } from 'react'
import { ThemeContext } from '~/components/layout/layout'
import Link from 'next/link'

export const Navbar = () => {
    const { data: sessionData } = useSession()
    const { theme, setTheme } = useContext(ThemeContext)

    return (
        <div className="navbar bg-base-100">
            <div className="flex-none">
                <Link href={`/`} className="btn-ghost btn text-xl normal-case">
                    MemeBro
                </Link>
            </div>
            <div className="m-auto flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link href={`/`}>Create</Link>
                    </li>
                    <li>
                        <Link href={`/all-templates`}>All Templates</Link>
                    </li>
                    {sessionData?.user && (
                        <>
                            <li>
                                <Link href={`/my-templates`}>My Templates</Link>
                            </li>
                            <li>
                                <Link href={`/my-memes`}>My Memes</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
            <div className="flex-none gap-2">
                {theme == 'dark' ? (
                    <button
                        className="btn-ghost btn mr-2 rounded-full text-yellow-300"
                        onClick={() => setTheme('light')}
                    >
                        <FaSun size={20} />
                    </button>
                ) : (
                    <button
                        className="btn-ghost btn mr-2 rounded-full"
                        onClick={() => setTheme('dark')}
                    >
                        <FaMoon size={20} />
                    </button>
                )}
                {sessionData ? (
                    <div className="dropdown-end dropdown z-10">
                        <label
                            tabIndex={0}
                            className="btn-ghost btn-circle avatar btn"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    data-cy="profile-picture"
                                    alt="profile-picture"
                                    src={
                                        sessionData?.user?.image ||
                                        '/profile.webp'
                                    }
                                />
                            </div>
                        </label>
                        <ul
                            tabIndex={0}
                            data-cy="profile-dropdown"
                            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-neutral p-2 text-neutral-content shadow"
                        >
                            <li>
                                <a data-cy="profile" href={`/profile`}>Profile</a>
                            </li>
                            <li>
                                <a data-cy="logout" onClick={() => void signOut()}>Logout</a>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <button
                        className="btn-primary btn"
                        data-cy="login"
                        onClick={() => void signIn()}
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    )
}
