import { createContext, type FC, type PropsWithChildren, useState } from 'react'
import { Navbar } from '~/components/layout/navbar'
import { Footer } from '~/components/layout/footer'
import {useAppStateInContext } from '~/state/app.state'
import { Popup } from '../common/popup'

type Theme = 'dark' | 'light'
export const ThemeContext = createContext<{
    theme: Theme
    setTheme: (theme: Theme) => void
}>({
    theme: 'light',
    setTheme: () => {
        /*nothing here*/
    },
})

export const Layout: FC<PropsWithChildren> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('dark')
    const popups = useAppStateInContext((state) => state.popups)

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <div
                data-theme={theme}
                className="relative flex min-h-screen flex-col"
            >
                <Navbar />
                <main className="flex flex-1 flex-col">{children}</main>
                <Footer />
                <div className="fixed right-6 bottom-6 z-50">
                    {popups
                        .map((popup) => (
                            <Popup key={popup.id} popup={popup}></Popup>
                        ))}
                </div>
            </div>
        </ThemeContext.Provider>
    )
}
