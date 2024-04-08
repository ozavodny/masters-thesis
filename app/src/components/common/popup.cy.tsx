import { MockedStoreProvider } from '~/test-utils/mocked-store-provider'
import { Popup } from './popup'
import { type PopupType } from '~/state/app.state'

const mountPopup = (popup: PopupType) => {
    const storeMock = {
        removePopup: cy.stub().as('removePopup'),
    }

    cy.mount(
        <MockedStoreProvider mockedState={storeMock}>
            <Popup popup={popup} />
        </MockedStoreProvider>
    )
}

describe('Popup Component Tests', () => {
    const popupData = {
        id: 1,
        message: 'Test Message',
        type: 'info',
    } as const

    it('renders the popup correctly', () => {
        mountPopup(popupData)
        cy.get('[data-cy=popup]').should('exist')
    })

    it('displays the correct popup message', () => {
        mountPopup(popupData)
        cy.contains(popupData.message).should('exist')
    })

    it('closes the popup on icon click', () => {
        mountPopup(popupData)
        cy.get('[data-cy=popup]').find('a').click()
        cy.get('@removePopup').should('be.calledOnceWith', popupData.id)
    })
})
