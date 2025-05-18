import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../facture-facturation.test-samples';

import { FactureFacturationFormService } from './facture-facturation-form.service';

describe('FactureFacturation Form Service', () => {
  let service: FactureFacturationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactureFacturationFormService);
  });

  describe('Service methods', () => {
    describe('createFactureFacturationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFactureFacturationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numero: expect.any(Object),
            dateFacture: expect.any(Object),
            dateEcheance: expect.any(Object),
            statut: expect.any(Object),
            notes: expect.any(Object),
            client: expect.any(Object),
          }),
        );
      });

      it('passing IFactureFacturation should create a new form with FormGroup', () => {
        const formGroup = service.createFactureFacturationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            numero: expect.any(Object),
            dateFacture: expect.any(Object),
            dateEcheance: expect.any(Object),
            statut: expect.any(Object),
            notes: expect.any(Object),
            client: expect.any(Object),
          }),
        );
      });
    });

    describe('getFactureFacturation', () => {
      it('should return NewFactureFacturation for default FactureFacturation initial value', () => {
        const formGroup = service.createFactureFacturationFormGroup(sampleWithNewData);

        const facture = service.getFactureFacturation(formGroup) as any;

        expect(facture).toMatchObject(sampleWithNewData);
      });

      it('should return NewFactureFacturation for empty FactureFacturation initial value', () => {
        const formGroup = service.createFactureFacturationFormGroup();

        const facture = service.getFactureFacturation(formGroup) as any;

        expect(facture).toMatchObject({});
      });

      it('should return IFactureFacturation', () => {
        const formGroup = service.createFactureFacturationFormGroup(sampleWithRequiredData);

        const facture = service.getFactureFacturation(formGroup) as any;

        expect(facture).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFactureFacturation should not enable id FormControl', () => {
        const formGroup = service.createFactureFacturationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFactureFacturation should disable id FormControl', () => {
        const formGroup = service.createFactureFacturationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
