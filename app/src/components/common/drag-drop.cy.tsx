import React from 'react'
import { DragDropFile } from './drag-drop'

describe('<DragDrop>', () => {
    const getActions = () => ({
        setImage: cy.stub().as('setImage'),
        setError: cy.stub().as('setError'),
        setLoading: cy.stub(),
    })

    it('renders component', () => {
        cy.mount(
            <DragDropFile actions={getActions()} loading={false}></DragDropFile>
        )

        cy.get('button').should('be.visible').should('be.enabled')
    })

    it('renders component while loading', () => {
        cy.mount(
            <DragDropFile actions={getActions()} loading={true}></DragDropFile>
        )

        cy.get('button').should('be.visible').should('be.disabled')
    })

    it('file upload with valid image', () => {
        const actions = getActions()
        cy.mount(<DragDropFile actions={actions} loading={false}></DragDropFile>)
        cy.get('input[type=file]').selectFile('cypress/fixtures/new-profile-picture.jpg', { force: true })
        cy.get('@setImage').should('be.calledOnce')
    })

    it('file upload with invalid', () => {
        const actions = getActions()
        cy.mount(<DragDropFile actions={actions} loading={false}></DragDropFile>)
        cy.get('input[type=file]').selectFile('cypress/fixtures/plain-text-file.txt', { force: true })
        cy.get('@setError').should('be.calledOnce')
    })
})
