import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'invoiceApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'client-facturation',
    data: { pageTitle: 'invoiceApp.client.home.title' },
    loadChildren: () => import('./client-facturation/client-facturation.routes'),
  },
  {
    path: 'facture-facturation',
    data: { pageTitle: 'invoiceApp.facture.home.title' },
    loadChildren: () => import('./facture-facturation/facture-facturation.routes'),
  },
  {
    path: 'ligne-facture-facturation',
    data: { pageTitle: 'invoiceApp.ligneFacture.home.title' },
    loadChildren: () => import('./ligne-facture-facturation/ligne-facture-facturation.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
