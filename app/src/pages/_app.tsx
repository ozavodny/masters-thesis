import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

import { queryApi } from '~/utils/query-api.utils'

import '~/styles/globals.css'
import { Layout } from '~/components/layout/layout'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { AppStoreProvider } from '~/state/app.state'

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
})

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <ThemeProvider theme={theme}>
                <AppStoreProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </AppStoreProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}

export default queryApi.withTRPC(MyApp)
