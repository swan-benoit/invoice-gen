import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IClientFacturation, NewClientFacturation } from '../client-facturation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClientFacturation for edit and NewClientFacturationFormGroupInput for create.
 */
type ClientFacturationFormGroupInput = IClientFacturation | PartialWithRequiredKeyOf<NewClientFacturation>;

type ClientFacturationFormDefaults = Pick<NewClientFacturation, 'id'>;

type ClientFacturationFormGroupContent = {
  id: FormControl<IClientFacturation['id'] | NewClientFacturation['id']>;
  nom: FormControl<IClientFacturation['nom']>;
  email: FormControl<IClientFacturation['email']>;
  telephone: FormControl<IClientFacturation['telephone']>;
  siret: FormControl<IClientFacturation['siret']>;
  adresseLigne1: FormControl<IClientFacturation['adresseLigne1']>;
  adresseLigne2: FormControl<IClientFacturation['adresseLigne2']>;
  codePostal: FormControl<IClientFacturation['codePostal']>;
  ville: FormControl<IClientFacturation['ville']>;
};

export type ClientFacturationFormGroup = FormGroup<ClientFacturationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClientFacturationFormService {
  createClientFacturationFormGroup(client: ClientFacturationFormGroupInput = { id: null }): ClientFacturationFormGroup {
    const clientRawValue = {
      ...this.getFormDefaults(),
      ...client,
    };
    return new FormGroup<ClientFacturationFormGroupContent>({
      id: new FormControl(
        { value: clientRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(clientRawValue.nom, {
        validators: [Validators.required],
      }),
      email: new FormControl(clientRawValue.email),
      telephone: new FormControl(clientRawValue.telephone),
      siret: new FormControl(clientRawValue.siret),
      adresseLigne1: new FormControl(clientRawValue.adresseLigne1),
      adresseLigne2: new FormControl(clientRawValue.adresseLigne2),
      codePostal: new FormControl(clientRawValue.codePostal),
      ville: new FormControl(clientRawValue.ville),
    });
  }

  getClientFacturation(form: ClientFacturationFormGroup): IClientFacturation | NewClientFacturation {
    return form.getRawValue() as IClientFacturation | NewClientFacturation;
  }

  resetForm(form: ClientFacturationFormGroup, client: ClientFacturationFormGroupInput): void {
    const clientRawValue = { ...this.getFormDefaults(), ...client };
    form.reset(
      {
        ...clientRawValue,
        id: { value: clientRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ClientFacturationFormDefaults {
    return {
      id: null,
    };
  }
}
