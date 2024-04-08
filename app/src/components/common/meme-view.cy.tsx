import React from 'react'
import { MemeView } from './meme-view'

describe('MemeView Component Tests', () => {
    it('renders the image correctly', () => {
        const src = 'test-image.jpg'
        cy.mount(<MemeView src={src} canCopy={false} />)
        cy.get('img').should('have.attr', 'src', src)
    })

    it('displays the correct image URL', () => {
        const src = 'test-image.jpg'
        cy.mount(<MemeView src={src} canCopy={true} />)
        cy.get('input').should('have.value', src)
        cy.get('input').should('be.disabled')
    })

    it('conditionally renders the copy section', () => {
        cy.mount(<MemeView src="test-image.jpg" canCopy={false} />)
        cy.get('input').should('not.exist')
        cy.get('button').should('not.exist')
    })
})
