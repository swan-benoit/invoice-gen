import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IFactureFacturation } from '../facture-facturation.model';

@Component({
  selector: 'jhi-facture-facturation-detail',
  templateUrl: './facture-facturation-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class FactureFacturationDetailComponent {
  facture = input<IFactureFacturation | null>(null);

  previousState(): void {
    window.history.back();
  }
}
