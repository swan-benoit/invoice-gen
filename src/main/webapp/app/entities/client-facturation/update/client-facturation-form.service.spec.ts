import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../client-facturation.test-samples';

import { ClientFacturationFormService } from './client-facturation-form.service';

describe('ClientFacturation Form Service', () => {
  let service: ClientFacturationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientFacturationFormService);
  });

  describe('Service methods', () => {
    describe('createClientFacturationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClientFacturationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            email: expect.any(Object),
            telephone: expect.any(Object),
            siret: expect.any(Object),
            adresseLigne1: expect.any(Object),
            adresseLigne2: expect.any(Object),
            codePostal: expect.any(Object),
            ville: expect.any(Object),
          }),
        );
      });

      it('passing IClientFacturation should create a new form with FormGroup', () => {
        const formGroup = service.createClientFacturationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            email: expect.any(Object),
            telephone: expect.any(Object),
            siret: expect.any(Object),
            adresseLigne1: expect.any(Object),
            adresseLigne2: expect.any(Object),
            codePostal: expect.any(Object),
            ville: expect.any(Object),
          }),
        );
      });
    });

    describe('getClientFacturation', () => {
      it('should return NewClientFacturation for default ClientFacturation initial value', () => {
        const formGroup = service.createClientFacturationFormGroup(sampleWithNewData);

        const client = service.getClientFacturation(formGroup) as any;

        expect(client).toMatchObject(sampleWithNewData);
      });

      it('should return NewClientFacturation for empty ClientFacturation initial value', () => {
        const formGroup = service.createClientFacturationFormGroup();

        const client = service.getClientFacturation(formGroup) as any;

        expect(client).toMatchObject({});
      });

      it('should return IClientFacturation', () => {
        const formGroup = service.createClientFacturationFormGroup(sampleWithRequiredData);

        const client = service.getClientFacturation(formGroup) as any;

        expect(client).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClientFacturation should not enable id FormControl', () => {
        const formGroup = service.createClientFacturationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClientFacturation should disable id FormControl', () => {
        const formGroup = service.createClientFacturationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
