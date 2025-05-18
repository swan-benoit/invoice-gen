import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ILigneFactureFacturation } from '../ligne-facture-facturation.model';
import { LigneFactureFacturationService } from '../service/ligne-facture-facturation.service';

@Component({
  templateUrl: './ligne-facture-facturation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class LigneFactureFacturationDeleteDialogComponent {
  ligneFacture?: ILigneFactureFacturation;

  protected ligneFactureService = inject(LigneFactureFacturationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ligneFactureService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
