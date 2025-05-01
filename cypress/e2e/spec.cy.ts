//describe('Cypress Page', () => {
 // it('Get Started and click GitHub button', () => {
    // Arrange
    //cy.visit('http://localhost:3000/dashboard');

    // Act: Hacer clic en "Get Started"
    //cy.get('[id="myGet"]').click();

    // Verificar que la redirección ocurrió (ajusta la URL esperada)
    //cy.url().should('include', '/auth/login');

    // Act: Hacer clic en el botón de GitHub (ajusta el selector)
    //cy.get('[id="myGitHub"]').click();
//  });
//});


describe('Autenticación básica con Cypress', () => {
  it('Autenticarse y acceder al dashboard', () => {
    // Paso 1: Autenticar con cy.request
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/dashboard',
      auth: {
        username: 'josem.ramirez@gmail.com',
        password: 'Kuke3nan_github?'
      }
    }).then(() => {
      // Paso 2: Visitar la página
      cy.visit('http://localhost:3000/dashboard');
      // Verifica que estás en la página correcta
      cy.url().should('include', '/dashboard');
    });
  });
});
