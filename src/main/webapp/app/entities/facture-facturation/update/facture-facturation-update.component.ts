import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IClientFacturation } from 'app/entities/client-facturation/client-facturation.model';
import { ClientFacturationService } from 'app/entities/client-facturation/service/client-facturation.service';
import { FactureStatut } from 'app/entities/enumerations/facture-statut.model';
import { FactureFacturationService } from '../service/facture-facturation.service';
import { IFactureFacturation } from '../facture-facturation.model';
import { FactureFacturationFormGroup, FactureFacturationFormService } from './facture-facturation-form.service';

@Component({
  selector: 'jhi-facture-facturation-update',
  templateUrl: './facture-facturation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FactureFacturationUpdateComponent implements OnInit {
  isSaving = false;
  facture: IFactureFacturation | null = null;
  factureStatutValues = Object.keys(FactureStatut);

  clientsSharedCollection: IClientFacturation[] = [];

  protected factureService = inject(FactureFacturationService);
  protected factureFormService = inject(FactureFacturationFormService);
  protected clientService = inject(ClientFacturationService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: FactureFacturationFormGroup = this.factureFormService.createFactureFacturationFormGroup();

  compareClientFacturation = (o1: IClientFacturation | null, o2: IClientFacturation | null): boolean =>
    this.clientService.compareClientFacturation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ facture }) => {
      this.facture = facture;
      if (facture) {
        this.updateForm(facture);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const facture = this.factureFormService.getFactureFacturation(this.editForm);
    if (facture.id !== null) {
      this.subscribeToSaveResponse(this.factureService.update(facture));
    } else {
      this.subscribeToSaveResponse(this.factureService.create(facture));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFactureFacturation>>): void {
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

  protected updateForm(facture: IFactureFacturation): void {
    this.facture = facture;
    this.factureFormService.resetForm(this.editForm, facture);

    this.clientsSharedCollection = this.clientService.addClientFacturationToCollectionIfMissing<IClientFacturation>(
      this.clientsSharedCollection,
      facture.client,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClientFacturation[]>) => res.body ?? []))
      .pipe(
        map((clients: IClientFacturation[]) =>
          this.clientService.addClientFacturationToCollectionIfMissing<IClientFacturation>(clients, this.facture?.client),
        ),
      )
      .subscribe((clients: IClientFacturation[]) => (this.clientsSharedCollection = clients));
  }
}
