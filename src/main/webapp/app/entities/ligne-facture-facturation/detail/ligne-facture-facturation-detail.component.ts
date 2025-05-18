import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ILigneFactureFacturation } from '../ligne-facture-facturation.model';

@Component({
  selector: 'jhi-ligne-facture-facturation-detail',
  templateUrl: './ligne-facture-facturation-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class LigneFactureFacturationDetailComponent {
  ligneFacture = input<ILigneFactureFacturation | null>(null);

  previousState(): void {
    window.history.back();
  }
}
