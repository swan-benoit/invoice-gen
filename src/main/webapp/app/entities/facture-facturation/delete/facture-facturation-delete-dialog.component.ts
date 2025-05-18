import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IFactureFacturation } from '../facture-facturation.model';
import { FactureFacturationService } from '../service/facture-facturation.service';

@Component({
  templateUrl: './facture-facturation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class FactureFacturationDeleteDialogComponent {
  facture?: IFactureFacturation;

  protected factureService = inject(FactureFacturationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.factureService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
