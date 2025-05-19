import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';

const invoiceRoutes: Routes = [
  {
    path: 'create',
    component: CreateInvoiceComponent,
    canActivate: [UserRouteAccessService],
    title: 'invoiceApp.facture.home.createLabel',
  },
];

export default invoiceRoutes;