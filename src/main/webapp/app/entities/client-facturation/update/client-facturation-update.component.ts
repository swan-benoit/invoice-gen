import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IClientFacturation } from '../client-facturation.model';
import { ClientFacturationService } from '../service/client-facturation.service';
import { ClientFacturationFormGroup, ClientFacturationFormService } from './client-facturation-form.service';

@Component({
  selector: 'jhi-client-facturation-update',
  templateUrl: './client-facturation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ClientFacturationUpdateComponent implements OnInit {
  isSaving = false;
  client: IClientFacturation | null = null;

  protected clientService = inject(ClientFacturationService);
  protected clientFormService = inject(ClientFacturationFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ClientFacturationFormGroup = this.clientFormService.createClientFacturationFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ client }) => {
      this.client = client;
      if (client) {
        this.updateForm(client);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const client = this.clientFormService.getClientFacturation(this.editForm);
    if (client.id !== null) {
      this.subscribeToSaveResponse(this.clientService.update(client));
    } else {
      this.subscribeToSaveResponse(this.clientService.create(client));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClientFacturation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(client: IClientFacturation): void {
    this.client = client;
    this.clientFormService.resetForm(this.editForm, client);
  }
}
