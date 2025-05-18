import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ClientFacturationResolve from './route/client-facturation-routing-resolve.service';

const clientRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/client-facturation.component').then(m => m.ClientFacturationComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/client-facturation-detail.component').then(m => m.ClientFacturationDetailComponent),
    resolve: {
      client: ClientFacturationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/client-facturation-update.component').then(m => m.ClientFacturationUpdateComponent),
    resolve: {
      client: ClientFacturationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/client-facturation-update.component').then(m => m.ClientFacturationUpdateComponent),
    resolve: {
      client: ClientFacturationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default clientRoute;
