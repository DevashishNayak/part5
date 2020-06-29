describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'root',
      username: 'root',
      password: 'sekret'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('sekret')
      cy.get('#login-button').click()

      cy.contains('root logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'root logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'sekret' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('cypress')
      cy.get('#author').type('root')
      cy.get('#url').type('cypress.root')
      cy.get('#submit-button').click()

      cy.contains('a new blog cypress by root')
    })

    describe('When a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'cypress',
          author: 'root',
          url: 'cypress.root'
        })
      })

      it('user can like a blog', function () {
        cy.contains('cypress').parent().as('theBlog')
        cy.get('@theBlog').contains('view').click()
        cy.get('@theBlog').contains('like').click()

        cy.get('@theBlog').should('contain', 'likes 1')
      })

      it('user who created a blog can delete it', function () {
        cy.contains('cypress').parent().as('theBlog')
        cy.get('@theBlog').contains('view').click()
        cy.get('@theBlog').contains('remove').click()

        cy.get('html').should('not.contain', 'cypress.root')
      })

      describe('When another blog exists', function () {
        beforeEach(function () {
          const anotheruser = {
            name: 'anotherroot',
            username: 'anotherroot',
            password: 'anothersekret'
          }
          cy.request('POST', 'http://localhost:3001/api/users/', anotheruser)
          cy.contains('logout').click()
          cy.login({ username: 'anotherroot', password: 'anothersekret' })
          cy.createBlog({
            title: 'anothercypress',
            author: 'anotherroot',
            url: 'anothercypress.root'
          })
        })

        it('other users cannot delete the blog', function () {
          cy.contains('cypress').parent().as('theBlog')
          cy.get('@theBlog').contains('view').click()

          cy.get('@theBlog').should('not.contain', 'remove')
        })

        it('blogs are ordered according to likes', function () {
          cy.contains('anothercypress').parent().as('theBlog')
          cy.get('@theBlog').contains('view').click()
          cy.get('@theBlog').contains('like').click()
          cy.get('@theBlog').contains('hide').click()

          cy.get('@theBlog').should('contain', 'likes 1')

          cy.get('button').then( buttons => {
            let j=1
            for(let i=0; i<buttons.length; i++) {
              if(buttons[i].innerText === 'view') {
                cy.wrap(buttons[i]).click().parent().parent().as('theBlog')
                cy.get('@theBlog').should('contain', `likes ${j}`)
                j-=1
              }
            }
          })
        })
      })
    })
  })
})