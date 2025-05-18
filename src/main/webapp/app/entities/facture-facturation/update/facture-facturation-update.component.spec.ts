import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IClientFacturation } from 'app/entities/client-facturation/client-facturation.model';
import { ClientFacturationService } from 'app/entities/client-facturation/service/client-facturation.service';
import { FactureFacturationService } from '../service/facture-facturation.service';
import { IFactureFacturation } from '../facture-facturation.model';
import { FactureFacturationFormService } from './facture-facturation-form.service';

import { FactureFacturationUpdateComponent } from './facture-facturation-update.component';

describe('FactureFacturation Management Update Component', () => {
  let comp: FactureFacturationUpdateComponent;
  let fixture: ComponentFixture<FactureFacturationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let factureFormService: FactureFacturationFormService;
  let factureService: FactureFacturationService;
  let clientService: ClientFacturationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FactureFacturationUpdateComponent],
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
      .overrideTemplate(FactureFacturationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FactureFacturationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    factureFormService = TestBed.inject(FactureFacturationFormService);
    factureService = TestBed.inject(FactureFacturationService);
    clientService = TestBed.inject(ClientFacturationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call ClientFacturation query and add missing value', () => {
      const facture: IFactureFacturation = { id: 30124 };
      const client: IClientFacturation = { id: 26282 };
      facture.client = client;

      const clientCollection: IClientFacturation[] = [{ id: 26282 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClientFacturations = [client];
      const expectedCollection: IClientFacturation[] = [...additionalClientFacturations, ...clientCollection];
      jest.spyOn(clientService, 'addClientFacturationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ facture });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientFacturationToCollectionIfMissing).toHaveBeenCalledWith(
        clientCollection,
        ...additionalClientFacturations.map(expect.objectContaining),
      );
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const facture: IFactureFacturation = { id: 30124 };
      const client: IClientFacturation = { id: 26282 };
      facture.client = client;

      activatedRoute.data = of({ facture });
      comp.ngOnInit();

      expect(comp.clientsSharedCollection).toContainEqual(client);
      expect(comp.facture).toEqual(facture);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFactureFacturation>>();
      const facture = { id: 29649 };
      jest.spyOn(factureFormService, 'getFactureFacturation').mockReturnValue(facture);
      jest.spyOn(factureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facture });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: facture }));
      saveSubject.complete();

      // THEN
      expect(factureFormService.getFactureFacturation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(factureService.update).toHaveBeenCalledWith(expect.objectContaining(facture));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFactureFacturation>>();
      const facture = { id: 29649 };
      jest.spyOn(factureFormService, 'getFactureFacturation').mockReturnValue({ id: null });
      jest.spyOn(factureService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facture: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: facture }));
      saveSubject.complete();

      // THEN
      expect(factureFormService.getFactureFacturation).toHaveBeenCalled();
      expect(factureService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFactureFacturation>>();
      const facture = { id: 29649 };
      jest.spyOn(factureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ facture });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(factureService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareClientFacturation', () => {
      it('should forward to clientService', () => {
        const entity = { id: 26282 };
        const entity2 = { id: 16836 };
        jest.spyOn(clientService, 'compareClientFacturation');
        comp.compareClientFacturation(entity, entity2);
        expect(clientService.compareClientFacturation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
