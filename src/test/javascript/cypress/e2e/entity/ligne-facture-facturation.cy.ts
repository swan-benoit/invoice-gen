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

describe('LigneFacture e2e test', () => {
  const ligneFacturePageUrl = '/ligne-facture-facturation';
  const ligneFacturePageUrlPattern = new RegExp('/ligne-facture-facturation(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const ligneFactureSample = { description: 'porte-parole guère', quantite: 14949, prixUnitaireHT: 29799.78 };

  let ligneFacture;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ligne-factures+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ligne-factures').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ligne-factures/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (ligneFacture) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ligne-factures/${ligneFacture.id}`,
      }).then(() => {
        ligneFacture = undefined;
      });
    }
  });

  it('LigneFactures menu should load LigneFactures page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ligne-facture-facturation');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('LigneFacture').should('exist');
    cy.url().should('match', ligneFacturePageUrlPattern);
  });

  describe('LigneFacture page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(ligneFacturePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create LigneFacture page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ligne-facture-facturation/new$'));
        cy.getEntityCreateUpdateHeading('LigneFacture');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ligneFacturePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ligne-factures',
          body: ligneFactureSample,
        }).then(({ body }) => {
          ligneFacture = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ligne-factures+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [ligneFacture],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(ligneFacturePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details LigneFacture page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('ligneFacture');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ligneFacturePageUrlPattern);
      });

      it('edit button click should load edit LigneFacture page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LigneFacture');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ligneFacturePageUrlPattern);
      });

      it('edit button click should load edit LigneFacture page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LigneFacture');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ligneFacturePageUrlPattern);
      });

      it('last delete button click should delete instance of LigneFacture', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('ligneFacture').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', ligneFacturePageUrlPattern);

        ligneFacture = undefined;
      });
    });
  });

  describe('new LigneFacture page', () => {
    beforeEach(() => {
      cy.visit(`${ligneFacturePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('LigneFacture');
    });

    it('should create an instance of LigneFacture', () => {
      cy.get(`[data-cy="description"]`).type('étaler');
      cy.get(`[data-cy="description"]`).should('have.value', 'étaler');

      cy.get(`[data-cy="quantite"]`).type('16458');
      cy.get(`[data-cy="quantite"]`).should('have.value', '16458');

      cy.get(`[data-cy="prixUnitaireHT"]`).type('10089.38');
      cy.get(`[data-cy="prixUnitaireHT"]`).should('have.value', '10089.38');

      cy.get(`[data-cy="tauxTVA"]`).type('11.33');
      cy.get(`[data-cy="tauxTVA"]`).should('have.value', '11.33');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        ligneFacture = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', ligneFacturePageUrlPattern);
    });
  });
});
