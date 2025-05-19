import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { IClientFacturation } from 'app/entities/client-facturation/client-facturation.model';
import { ClientFacturationService } from 'app/entities/client-facturation/service/client-facturation.service';
import { FactureStatut } from 'app/entities/enumerations/facture-statut.model';
import { FactureFacturationService } from 'app/entities/facture-facturation/service/facture-facturation.service';
import { IFactureFacturation } from 'app/entities/facture-facturation/facture-facturation.model';
import { LigneFactureFacturationService } from 'app/entities/ligne-facture-facturation/service/ligne-facture-facturation.service';
import { ILigneFactureFacturation } from 'app/entities/ligne-facture-facturation/ligne-facture-facturation.model';

@Component({
  selector: 'jhi-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule, ReactiveFormsModule],
})
export class CreateInvoiceComponent implements OnInit {
  isSaving = false;
  factureStatutValues = Object.keys(FactureStatut);
  clientsSharedCollection: IClientFacturation[] = [];
  invoiceForm!: FormGroup;
  totalHT = 0;
  totalTTC = 0;

  private fb = inject(FormBuilder);
  private factureService = inject(FactureFacturationService);
  private ligneFactureService = inject(LigneFactureFacturationService);
  private clientService = inject(ClientFacturationService);
  private router = inject(Router);

  ngOnInit(): void {
    this.createForm();
    this.loadClients();
    this.calculateTotals();

    // Listen for changes to recalculate totals
    this.lignesFacture.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  createForm(): void {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    this.invoiceForm = this.fb.group({
      numero: ['', [Validators.required]],
      dateFacture: [today.toISOString().substring(0, 16), [Validators.required]],
      dateEcheance: [nextMonth.toISOString().substring(0, 16)],
      statut: [FactureStatut.BROUILLON, [Validators.required]],
      notes: [''],
      client: [null],
      lignesFacture: this.fb.array([this.createLigneFacture()])
    });
  }

  get lignesFacture(): FormArray {
    return this.invoiceForm.get('lignesFacture') as FormArray;
  }

  createLigneFacture(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required]],
      quantite: [1, [Validators.required, Validators.min(1)]],
      prixUnitaireHT: [0, [Validators.required, Validators.min(0)]],
      tauxTVA: [20, [Validators.min(0), Validators.max(100)]]
    });
  }

  addLigneFacture(): void {
    this.lignesFacture.push(this.createLigneFacture());
  }

  removeLigneFacture(index: number): void {
    if (this.lignesFacture.length > 1) {
      this.lignesFacture.removeAt(index);
    }
  }

  calculateTotals(): void {
    this.totalHT = 0;
    this.totalTTC = 0;

    this.lignesFacture.controls.forEach(control => {
      const ligne = control.value;
      const ligneTotal = ligne.quantite * ligne.prixUnitaireHT;
      this.totalHT += ligneTotal;
      this.totalTTC += ligneTotal * (1 + (ligne.tauxTVA || 0) / 100);
    });
  }

  loadClients(): void {
    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClientFacturation[]>) => res.body ?? []))
      .subscribe((clients: IClientFacturation[]) => {
        this.clientsSharedCollection = clients;
      });
  }

  save(): void {
    this.isSaving = true;
    const factureData = this.createFromForm();
    
    this.factureService.create(factureData).subscribe({
      next: (factureResponse: HttpResponse<IFactureFacturation>) => {
        const factureId = factureResponse.body?.id;
        if (factureId) {
          // Create all invoice lines
          const lignesPromises = this.lignesFacture.controls.map(control => {
            const ligneData = control.value;
            const ligne: ILigneFactureFacturation = {
              id: null,
              description: ligneData.description,
              quantite: ligneData.quantite,
              prixUnitaireHT: ligneData.prixUnitaireHT,
              tauxTVA: ligneData.tauxTVA,
              facture: { id: factureId }
            };
            return this.ligneFactureService.create(ligne).toPromise();
          });

          Promise.all(lignesPromises)
            .then(() => {
              this.isSaving = false;
              this.router.navigate(['/facture-facturation', factureId, 'view']);
            })
            .catch(() => {
              this.isSaving = false;
            });
        } else {
          this.isSaving = false;
          this.router.navigate(['/facture-facturation']);
        }
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  private createFromForm(): IFactureFacturation {
    return {
      ...this.invoiceForm.value,
      id: null,
      lignes: undefined
    };
  }

  previousState(): void {
    window.history.back();
  }
}