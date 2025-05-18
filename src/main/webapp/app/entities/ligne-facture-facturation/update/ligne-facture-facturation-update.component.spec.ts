import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IFactureFacturation } from 'app/entities/facture-facturation/facture-facturation.model';
import { FactureFacturationService } from 'app/entities/facture-facturation/service/facture-facturation.service';
import { LigneFactureFacturationService } from '../service/ligne-facture-facturation.service';
import { ILigneFactureFacturation } from '../ligne-facture-facturation.model';
import { LigneFactureFacturationFormService } from './ligne-facture-facturation-form.service';

import { LigneFactureFacturationUpdateComponent } from './ligne-facture-facturation-update.component';

describe('LigneFactureFacturation Management Update Component', () => {
  let comp: LigneFactureFacturationUpdateComponent;
  let fixture: ComponentFixture<LigneFactureFacturationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ligneFactureFormService: LigneFactureFacturationFormService;
  let ligneFactureService: LigneFactureFacturationService;
  let factureService: FactureFacturationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LigneFactureFacturationUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LigneFactureFacturationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LigneFactureFacturationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ligneFactureFormService = TestBed.inject(LigneFactureFacturationFormService);
    ligneFactureService = TestBed.inject(LigneFactureFacturationService);
    factureService = TestBed.inject(FactureFacturationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call FactureFacturation query and add missing value', () => {
      const ligneFacture: ILigneFactureFacturation = { id: 8522 };
      const facture: IFactureFacturation = { id: 29649 };
      ligneFacture.facture = facture;

      const factureCollection: IFactureFacturation[] = [{ id: 29649 }];
      jest.spyOn(factureService, 'query').mockReturnValue(of(new HttpResponse({ body: factureCollection })));
      const additionalFactureFacturations = [facture];
      const expectedCollection: IFactureFacturation[] = [...additionalFactureFacturations, ...factureCollection];
      jest.spyOn(factureService, 'addFactureFacturationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ligneFacture });
      comp.ngOnInit();

      expect(factureService.query).toHaveBeenCalled();
      expect(factureService.addFactureFacturationToCollectionIfMissing).toHaveBeenCalledWith(
        factureCollection,
        ...additionalFactureFacturations.map(expect.objectContaining),
      );
      expect(comp.facturesSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const ligneFacture: ILigneFactureFacturation = { id: 8522 };
      const facture: IFactureFacturation = { id: 29649 };
      ligneFacture.facture = facture;

      activatedRoute.data = of({ ligneFacture });
      comp.ngOnInit();

      expect(comp.facturesSharedCollection).toContainEqual(facture);
      expect(comp.ligneFacture).toEqual(ligneFacture);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILigneFactureFacturation>>();
      const ligneFacture = { id: 32395 };
      jest.spyOn(ligneFactureFormService, 'getLigneFactureFacturation').mockReturnValue(ligneFacture);
      jest.spyOn(ligneFactureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ligneFacture });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ligneFacture }));
      saveSubject.complete();

      // THEN
      expect(ligneFactureFormService.getLigneFactureFacturation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ligneFactureService.update).toHaveBeenCalledWith(expect.objectContaining(ligneFacture));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILigneFactureFacturation>>();
      const ligneFacture = { id: 32395 };
      jest.spyOn(ligneFactureFormService, 'getLigneFactureFacturation').mockReturnValue({ id: null });
      jest.spyOn(ligneFactureService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ligneFacture: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ligneFacture }));
      saveSubject.complete();

      // THEN
      expect(ligneFactureFormService.getLigneFactureFacturation).toHaveBeenCalled();
      expect(ligneFactureService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILigneFactureFacturation>>();
      const ligneFacture = { id: 32395 };
      jest.spyOn(ligneFactureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ligneFacture });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ligneFactureService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareFactureFacturation', () => {
      it('should forward to factureService', () => {
        const entity = { id: 29649 };
        const entity2 = { id: 30124 };
        jest.spyOn(factureService, 'compareFactureFacturation');
        comp.compareFactureFacturation(entity, entity2);
        expect(factureService.compareFactureFacturation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
