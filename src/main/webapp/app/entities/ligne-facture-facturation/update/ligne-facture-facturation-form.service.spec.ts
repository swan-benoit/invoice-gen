import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../ligne-facture-facturation.test-samples';

import { LigneFactureFacturationFormService } from './ligne-facture-facturation-form.service';

describe('LigneFactureFacturation Form Service', () => {
  let service: LigneFactureFacturationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LigneFactureFacturationFormService);
  });

  describe('Service methods', () => {
    describe('createLigneFactureFacturationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLigneFactureFacturationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            quantite: expect.any(Object),
            prixUnitaireHT: expect.any(Object),
            tauxTVA: expect.any(Object),
            facture: expect.any(Object),
          }),
        );
      });

      it('passing ILigneFactureFacturation should create a new form with FormGroup', () => {
        const formGroup = service.createLigneFactureFacturationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            quantite: expect.any(Object),
            prixUnitaireHT: expect.any(Object),
            tauxTVA: expect.any(Object),
            facture: expect.any(Object),
          }),
        );
      });
    });

    describe('getLigneFactureFacturation', () => {
      it('should return NewLigneFactureFacturation for default LigneFactureFacturation initial value', () => {
        const formGroup = service.createLigneFactureFacturationFormGroup(sampleWithNewData);

        const ligneFacture = service.getLigneFactureFacturation(formGroup) as any;

        expect(ligneFacture).toMatchObject(sampleWithNewData);
      });

      it('should return NewLigneFactureFacturation for empty LigneFactureFacturation initial value', () => {
        const formGroup = service.createLigneFactureFacturationFormGroup();

        const ligneFacture = service.getLigneFactureFacturation(formGroup) as any;

        expect(ligneFacture).toMatchObject({});
      });

      it('should return ILigneFactureFacturation', () => {
        const formGroup = service.createLigneFactureFacturationFormGroup(sampleWithRequiredData);

        const ligneFacture = service.getLigneFactureFacturation(formGroup) as any;

        expect(ligneFacture).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILigneFactureFacturation should not enable id FormControl', () => {
        const formGroup = service.createLigneFactureFacturationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLigneFactureFacturation should disable id FormControl', () => {
        const formGroup = service.createLigneFactureFacturationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
