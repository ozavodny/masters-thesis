import React from 'react'
import { Alert } from './alert'

describe('<Alert />', () => {
  // all the variations of alert are tested using cypress component testing
  it('renders info alert', () => {
    cy.mount(<Alert type="info">This is an info alert</Alert>)
    cy.get('[data-cy="alert"]').should('have.class', 'alert-info').should('have.text', 'This is an info alert')
  })

  it('renders success alert', () => {
    cy.mount(<Alert type="success">This is a success alert</Alert>)
    cy.get('[data-cy="alert"]').should('have.class', 'alert-success').should('have.text', 'This is a success alert')
  })

  it('renders warning alert', () => {
    cy.mount(<Alert type="warning">This is a warning alert</Alert>)
    cy.get('[data-cy="alert"]').should('have.class', 'alert-warning').should('have.text', 'This is a warning alert')
  })

  it('renders error alert', () => {
    cy.mount(<Alert type="error">This is an error alert</Alert>)
    cy.get('[data-cy="alert"]').should('have.class', 'alert-error').should('have.text', 'This is an error alert')
  })
})