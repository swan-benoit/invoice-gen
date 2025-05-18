import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IFactureFacturation } from 'app/entities/facture-facturation/facture-facturation.model';
import { FactureFacturationService } from 'app/entities/facture-facturation/service/facture-facturation.service';
import { ILigneFactureFacturation } from '../ligne-facture-facturation.model';
import { LigneFactureFacturationService } from '../service/ligne-facture-facturation.service';
import { LigneFactureFacturationFormGroup, LigneFactureFacturationFormService } from './ligne-facture-facturation-form.service';

@Component({
  selector: 'jhi-ligne-facture-facturation-update',
  templateUrl: './ligne-facture-facturation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LigneFactureFacturationUpdateComponent implements OnInit {
  isSaving = false;
  ligneFacture: ILigneFactureFacturation | null = null;

  facturesSharedCollection: IFactureFacturation[] = [];

  protected ligneFactureService = inject(LigneFactureFacturationService);
  protected ligneFactureFormService = inject(LigneFactureFacturationFormService);
  protected factureService = inject(FactureFacturationService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: LigneFactureFacturationFormGroup = this.ligneFactureFormService.createLigneFactureFacturationFormGroup();

  compareFactureFacturation = (o1: IFactureFacturation | null, o2: IFactureFacturation | null): boolean =>
    this.factureService.compareFactureFacturation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ligneFacture }) => {
      this.ligneFacture = ligneFacture;
      if (ligneFacture) {
        this.updateForm(ligneFacture);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ligneFacture = this.ligneFactureFormService.getLigneFactureFacturation(this.editForm);
    if (ligneFacture.id !== null) {
      this.subscribeToSaveResponse(this.ligneFactureService.update(ligneFacture));
    } else {
      this.subscribeToSaveResponse(this.ligneFactureService.create(ligneFacture));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILigneFactureFacturation>>): void {
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

  protected updateForm(ligneFacture: ILigneFactureFacturation): void {
    this.ligneFacture = ligneFacture;
    this.ligneFactureFormService.resetForm(this.editForm, ligneFacture);

    this.facturesSharedCollection = this.factureService.addFactureFacturationToCollectionIfMissing<IFactureFacturation>(
      this.facturesSharedCollection,
      ligneFacture.facture,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.factureService
      .query()
      .pipe(map((res: HttpResponse<IFactureFacturation[]>) => res.body ?? []))
      .pipe(
        map((factures: IFactureFacturation[]) =>
          this.factureService.addFactureFacturationToCollectionIfMissing<IFactureFacturation>(factures, this.ligneFacture?.facture),
        ),
      )
      .subscribe((factures: IFactureFacturation[]) => (this.facturesSharedCollection = factures));
  }
}
