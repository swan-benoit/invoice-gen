import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IClientFacturation } from '../client-facturation.model';
import { ClientFacturationService } from '../service/client-facturation.service';

@Component({
  templateUrl: './client-facturation-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ClientFacturationDeleteDialogComponent {
  client?: IClientFacturation;

  protected clientService = inject(ClientFacturationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clientService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
