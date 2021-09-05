describe('Note app', () => {
    const user = {
        username: "fmia",
        name: "francisco",
        password: "entrar1234"
    }

    beforeEach(() =>{
        cy.visit('http://localhost:3000')
        cy.request('POST','http://localhost:3001/api/testing/reset')
        cy.request('POST', 'http://127.0.0.1:3001/api/users', user)
    })
    it('frontpage can be opened', () => {
        cy.contains('Notas');
    })

    it('login form can be opened', () => {
        cy.contains('show login').click()
    })

    it('user can login', () => {
        cy.contains('login').click()
        cy.get('#username').type('fmia')
        cy.get('#password').type('entrar1234')
        cy.get('#loginFormButton').click()
        cy.contains('Create a new Note')
    })

   /* it('login fails with wrong password', () =>{
        cy.contains('login').click()
        cy.get('#username').type('fmia')
        cy.get('#password').type('en234')
        cy.get('#loginFormButton').click()
        cy.get('.error').should('contain', 'Wrong credentials')
    })*/

    describe('when logged in', () => {
        beforeEach(() => {
            cy.login(user)
        })
        it('a new note can be created', () =>{
            cy.contains('New note').click()
            cy.get('input').type('a note created by cypress')
            cy.contains('Create note').click()
            cy.contains('a note created by cypress')
        })
        
        describe('And a note exists', () => {
            beforeEach(() => {
                cy.createNote({
                    content: 'A note create in cypress',
                    important: false
                })

                cy.createNote({
                    content: 'A note create in cypress 2',
                    important: false
                })
            })

            it('can be made important', () => {
                cy.contains('A note create in cypress 2').as('theNote')

                cy.get('@theNote')
                .contains('make important')
                .click()

                cy.get('@theNote')
                .contains('make important')
            })
        })

        
    })
})