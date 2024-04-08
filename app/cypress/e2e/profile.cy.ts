describe('Profile test', () => {
    it('change user properties', () => {
        cy.visit('/')
        cy.get('[data-cy="login"]').click()
        cy.intercept('GET', 'api/auth/session').as('getSession')
        cy.contains('Sign in with Development Provider').parent().click()
        cy.wait(10000)
        cy.visit('/')

        cy.get('[data-cy="profile-picture"]').click()
        cy.contains('Profile').click()
        cy.get('[data-cy="username-input"]').clear().type('New Name')
        cy.get('[ data-cy="save-username"]').click()
        cy.get('[data-cy="username"]').should('contain', 'New Name')
        
        cy.get('[data-cy="profile-picture"]').click()
        cy.contains('Profile').click()
        cy.get('[data-cy="edit-profile-picture"]').click()
        cy.fixture('new-profile-picture.jpg', null).as('new-profile-picture')
        cy.get('input[type=file]').selectFile('@new-profile-picture', {
            force: true,
        })
        cy.get('[data-cy="profile-picture-preview"]').should('exist')
        cy.get('[data-cy="save-profile-picture"]').click()
        cy.get('dialog').should('be.hidden')
    })
})
