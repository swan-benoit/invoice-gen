import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('Facture e2e test', () => {
  const facturePageUrl = '/facture-facturation';
  const facturePageUrlPattern = new RegExp('/facture-facturation(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const factureSample = { numero: 'concurrence au prix de grrr', dateFacture: '2025-05-18T13:05:31.998Z', statut: 'ANNULEE' };

  let facture;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/factures+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/factures').as('postEntityRequest');
    cy.intercept('DELETE', '/api/factures/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (facture) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/factures/${facture.id}`,
      }).then(() => {
        facture = undefined;
      });
    }
  });

  it('Factures menu should load Factures page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('facture-facturation');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Facture').should('exist');
    cy.url().should('match', facturePageUrlPattern);
  });

  describe('Facture page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(facturePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Facture page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/facture-facturation/new$'));
        cy.getEntityCreateUpdateHeading('Facture');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', facturePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/factures',
          body: factureSample,
        }).then(({ body }) => {
          facture = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/factures+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/factures?page=0&size=20>; rel="last",<http://localhost/api/factures?page=0&size=20>; rel="first"',
              },
              body: [facture],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(facturePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Facture page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('facture');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', facturePageUrlPattern);
      });

      it('edit button click should load edit Facture page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Facture');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', facturePageUrlPattern);
      });

      it('edit button click should load edit Facture page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Facture');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', facturePageUrlPattern);
      });

      it('last delete button click should delete instance of Facture', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('facture').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', facturePageUrlPattern);

        facture = undefined;
      });
    });
  });

  describe('new Facture page', () => {
    beforeEach(() => {
      cy.visit(`${facturePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Facture');
    });

    it('should create an instance of Facture', () => {
      cy.get(`[data-cy="numero"]`).type('dring lâche');
      cy.get(`[data-cy="numero"]`).should('have.value', 'dring lâche');

      cy.get(`[data-cy="dateFacture"]`).type('2025-05-17T23:24');
      cy.get(`[data-cy="dateFacture"]`).blur();
      cy.get(`[data-cy="dateFacture"]`).should('have.value', '2025-05-17T23:24');

      cy.get(`[data-cy="dateEcheance"]`).type('2025-05-18T18:49');
      cy.get(`[data-cy="dateEcheance"]`).blur();
      cy.get(`[data-cy="dateEcheance"]`).should('have.value', '2025-05-18T18:49');

      cy.get(`[data-cy="statut"]`).select('BROUILLON');

      cy.get(`[data-cy="notes"]`).type('à partir de');
      cy.get(`[data-cy="notes"]`).should('have.value', 'à partir de');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        facture = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', facturePageUrlPattern);
    });
  });
});
