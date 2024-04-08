import React, { type ReactNode } from 'react'
import { TemplateCard } from './template-card'
import * as nextRouter from 'next/router'
import { MockedStoreProvider } from '~/test-utils/mocked-store-provider'

describe('TemplateCard Component Tests', () => {
    const mockTemplate = {
        id: '1',
        name: 'Test Template',
        image: {
            id: 'test-image-id',
            fileName: 'test-image.jpg',
            templateImageId: null,
        },
    }

    beforeEach(() => {
        cy.stub(nextRouter, 'useRouter').returns({
            push: cy.stub().as('routerPush').returns(Promise.resolve()),
        })
    })

    const mountMocked = (children: ReactNode) => {
        const storeMock = {
            useTemplate: cy.stub().as('useTemplate'),
        }

        cy.mount(
            <MockedStoreProvider mockedState={storeMock}>
                {children}
            </MockedStoreProvider>
        )
    }

    it('renders correctly', () => {
        mountMocked(
            <TemplateCard
                editable={false}
                selected={false}
                size="lg"
                template={mockTemplate}
            />
        )
        cy.get('[data-cy=template-card]').should(
            'not.have.class',
            'shadow-accent shadow-highlight'
        )
        cy.get('[data-cy=delete-template]').should('not.exist')
    })

    it('renders correctly with editable true', () => {
        mountMocked(
            <TemplateCard
                editable={true}
                selected={false}
                size="lg"
                template={mockTemplate}
            />
        )
        cy.get('[data-cy=template-card]').should(
            'not.have.class',
            'shadow-accent shadow-highlight'
        )
        cy.get('[data-cy=delete-template]').should('exist')
    })

    it('renders correctly with selected true', () => {
        mountMocked(
            <TemplateCard
                editable={false}
                selected={true}
                size="lg"
                template={mockTemplate}
            />
        )
        cy.get('[data-cy=template-card]').should(
            'have.class',
            'shadow-accent shadow-highlight'
        )
        cy.get('[data-cy=delete-template]').should('not.exist')
    })

    it('interacts correctly', () => {
        // Mock api calls
        cy.intercept('/api/trpc/template.deleteTemplate*', {
            statusCode: 200,
            body: [{"result":{"data":{"json":null,"meta":{"values":["undefined"]}}}}]
        }).as('deleteTemplate')

        // Mock refetch
        const refetch = cy.stub().as('refetch')

        mountMocked(
            <TemplateCard
                editable={true}
                selected={false}
                size="lg"
                template={mockTemplate}
                refetch={refetch}
            />
        )

        // Test click functionality (navigating and setting template)
        cy.get('.card').click()
        cy.get('@routerPush').should('have.been.calledWith', '/')
        cy.get('@useTemplate').should('have.been.calledWith', mockTemplate.id)

        // Test delete functionality
        cy.get('button').click()
        cy.wait('@deleteTemplate')
        cy.get('@deleteTemplate.all').should('have.length', 1)

        cy.get('@refetch').should('have.been.calledOnce')
    })
})
