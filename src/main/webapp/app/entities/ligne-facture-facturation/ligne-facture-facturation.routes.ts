import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import LigneFactureFacturationResolve from './route/ligne-facture-facturation-routing-resolve.service';

const ligneFactureRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ligne-facture-facturation.component').then(m => m.LigneFactureFacturationComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/ligne-facture-facturation-detail.component').then(m => m.LigneFactureFacturationDetailComponent),
    resolve: {
      ligneFacture: LigneFactureFacturationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/ligne-facture-facturation-update.component').then(m => m.LigneFactureFacturationUpdateComponent),
    resolve: {
      ligneFacture: LigneFactureFacturationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/ligne-facture-facturation-update.component').then(m => m.LigneFactureFacturationUpdateComponent),
    resolve: {
      ligneFacture: LigneFactureFacturationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default ligneFactureRoute;
