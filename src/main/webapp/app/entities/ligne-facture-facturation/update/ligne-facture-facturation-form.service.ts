import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ILigneFactureFacturation, NewLigneFactureFacturation } from '../ligne-facture-facturation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILigneFactureFacturation for edit and NewLigneFactureFacturationFormGroupInput for create.
 */
type LigneFactureFacturationFormGroupInput = ILigneFactureFacturation | PartialWithRequiredKeyOf<NewLigneFactureFacturation>;

type LigneFactureFacturationFormDefaults = Pick<NewLigneFactureFacturation, 'id'>;

type LigneFactureFacturationFormGroupContent = {
  id: FormControl<ILigneFactureFacturation['id'] | NewLigneFactureFacturation['id']>;
  description: FormControl<ILigneFactureFacturation['description']>;
  quantite: FormControl<ILigneFactureFacturation['quantite']>;
  prixUnitaireHT: FormControl<ILigneFactureFacturation['prixUnitaireHT']>;
  tauxTVA: FormControl<ILigneFactureFacturation['tauxTVA']>;
  facture: FormControl<ILigneFactureFacturation['facture']>;
};

export type LigneFactureFacturationFormGroup = FormGroup<LigneFactureFacturationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LigneFactureFacturationFormService {
  createLigneFactureFacturationFormGroup(
    ligneFacture: LigneFactureFacturationFormGroupInput = { id: null },
  ): LigneFactureFacturationFormGroup {
    const ligneFactureRawValue = {
      ...this.getFormDefaults(),
      ...ligneFacture,
    };
    return new FormGroup<LigneFactureFacturationFormGroupContent>({
      id: new FormControl(
        { value: ligneFactureRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      description: new FormControl(ligneFactureRawValue.description, {
        validators: [Validators.required],
      }),
      quantite: new FormControl(ligneFactureRawValue.quantite, {
        validators: [Validators.required, Validators.min(1)],
      }),
      prixUnitaireHT: new FormControl(ligneFactureRawValue.prixUnitaireHT, {
        validators: [Validators.required, Validators.min(0)],
      }),
      tauxTVA: new FormControl(ligneFactureRawValue.tauxTVA, {
        validators: [Validators.min(0), Validators.max(100)],
      }),
      facture: new FormControl(ligneFactureRawValue.facture),
    });
  }

  getLigneFactureFacturation(form: LigneFactureFacturationFormGroup): ILigneFactureFacturation | NewLigneFactureFacturation {
    return form.getRawValue() as ILigneFactureFacturation | NewLigneFactureFacturation;
  }

  resetForm(form: LigneFactureFacturationFormGroup, ligneFacture: LigneFactureFacturationFormGroupInput): void {
    const ligneFactureRawValue = { ...this.getFormDefaults(), ...ligneFacture };
    form.reset(
      {
        ...ligneFactureRawValue,
        id: { value: ligneFactureRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LigneFactureFacturationFormDefaults {
    return {
      id: null,
    };
  }
}
