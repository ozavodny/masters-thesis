import { type FC, type ReactNode } from 'react'
import { createStore } from 'zustand'
import { type AppState, AppStoreContext } from '~/state/app.state'

export const MockedStoreProvider: FC<{
    children: ReactNode
    mockedState: Partial<AppState>
}> = ({ children, mockedState }) => {
    const store = createStore()(() => mockedState)

    return (
        // @ts-expect-error - The store doesn't need to contain the entire AppState
        <AppStoreContext.Provider value={store}>
            {children}
        </AppStoreContext.Provider>
    )
}
