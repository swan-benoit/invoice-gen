import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import FactureFacturationResolve from './route/facture-facturation-routing-resolve.service';

const factureRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/facture-facturation.component').then(m => m.FactureFacturationComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/facture-facturation-detail.component').then(m => m.FactureFacturationDetailComponent),
    resolve: {
      facture: FactureFacturationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/facture-facturation-update.component').then(m => m.FactureFacturationUpdateComponent),
    resolve: {
      facture: FactureFacturationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/facture-facturation-update.component').then(m => m.FactureFacturationUpdateComponent),
    resolve: {
      facture: FactureFacturationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default factureRoute;
