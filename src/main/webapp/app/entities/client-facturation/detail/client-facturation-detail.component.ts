import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IClientFacturation } from '../client-facturation.model';

@Component({
  selector: 'jhi-client-facturation-detail',
  templateUrl: './client-facturation-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class ClientFacturationDetailComponent {
  client = input<IClientFacturation | null>(null);

  previousState(): void {
    window.history.back();
  }
}
