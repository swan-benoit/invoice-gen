import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IFactureFacturation, NewFactureFacturation } from '../facture-facturation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFactureFacturation for edit and NewFactureFacturationFormGroupInput for create.
 */
type FactureFacturationFormGroupInput = IFactureFacturation | PartialWithRequiredKeyOf<NewFactureFacturation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IFactureFacturation | NewFactureFacturation> = Omit<T, 'dateFacture' | 'dateEcheance'> & {
  dateFacture?: string | null;
  dateEcheance?: string | null;
};

type FactureFacturationFormRawValue = FormValueOf<IFactureFacturation>;

type NewFactureFacturationFormRawValue = FormValueOf<NewFactureFacturation>;

type FactureFacturationFormDefaults = Pick<NewFactureFacturation, 'id' | 'dateFacture' | 'dateEcheance'>;

type FactureFacturationFormGroupContent = {
  id: FormControl<FactureFacturationFormRawValue['id'] | NewFactureFacturation['id']>;
  numero: FormControl<FactureFacturationFormRawValue['numero']>;
  dateFacture: FormControl<FactureFacturationFormRawValue['dateFacture']>;
  dateEcheance: FormControl<FactureFacturationFormRawValue['dateEcheance']>;
  statut: FormControl<FactureFacturationFormRawValue['statut']>;
  notes: FormControl<FactureFacturationFormRawValue['notes']>;
  client: FormControl<FactureFacturationFormRawValue['client']>;
};

export type FactureFacturationFormGroup = FormGroup<FactureFacturationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FactureFacturationFormService {
  createFactureFacturationFormGroup(facture: FactureFacturationFormGroupInput = { id: null }): FactureFacturationFormGroup {
    const factureRawValue = this.convertFactureFacturationToFactureFacturationRawValue({
      ...this.getFormDefaults(),
      ...facture,
    });
    return new FormGroup<FactureFacturationFormGroupContent>({
      id: new FormControl(
        { value: factureRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      numero: new FormControl(factureRawValue.numero, {
        validators: [Validators.required],
      }),
      dateFacture: new FormControl(factureRawValue.dateFacture, {
        validators: [Validators.required],
      }),
      dateEcheance: new FormControl(factureRawValue.dateEcheance),
      statut: new FormControl(factureRawValue.statut, {
        validators: [Validators.required],
      }),
      notes: new FormControl(factureRawValue.notes),
      client: new FormControl(factureRawValue.client),
    });
  }

  getFactureFacturation(form: FactureFacturationFormGroup): IFactureFacturation | NewFactureFacturation {
    return this.convertFactureFacturationRawValueToFactureFacturation(
      form.getRawValue() as FactureFacturationFormRawValue | NewFactureFacturationFormRawValue,
    );
  }

  resetForm(form: FactureFacturationFormGroup, facture: FactureFacturationFormGroupInput): void {
    const factureRawValue = this.convertFactureFacturationToFactureFacturationRawValue({ ...this.getFormDefaults(), ...facture });
    form.reset(
      {
        ...factureRawValue,
        id: { value: factureRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): FactureFacturationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateFacture: currentTime,
      dateEcheance: currentTime,
    };
  }

  private convertFactureFacturationRawValueToFactureFacturation(
    rawFactureFacturation: FactureFacturationFormRawValue | NewFactureFacturationFormRawValue,
  ): IFactureFacturation | NewFactureFacturation {
    return {
      ...rawFactureFacturation,
      dateFacture: dayjs(rawFactureFacturation.dateFacture, DATE_TIME_FORMAT),
      dateEcheance: dayjs(rawFactureFacturation.dateEcheance, DATE_TIME_FORMAT),
    };
  }

  private convertFactureFacturationToFactureFacturationRawValue(
    facture: IFactureFacturation | (Partial<NewFactureFacturation> & FactureFacturationFormDefaults),
  ): FactureFacturationFormRawValue | PartialWithRequiredKeyOf<NewFactureFacturationFormRawValue> {
    return {
      ...facture,
      dateFacture: facture.dateFacture ? facture.dateFacture.format(DATE_TIME_FORMAT) : undefined,
      dateEcheance: facture.dateEcheance ? facture.dateEcheance.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
