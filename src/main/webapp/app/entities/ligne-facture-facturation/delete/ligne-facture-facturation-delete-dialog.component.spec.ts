jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LigneFactureFacturationService } from '../service/ligne-facture-facturation.service';

import { LigneFactureFacturationDeleteDialogComponent } from './ligne-facture-facturation-delete-dialog.component';

describe('LigneFactureFacturation Management Delete Component', () => {
  let comp: LigneFactureFacturationDeleteDialogComponent;
  let fixture: ComponentFixture<LigneFactureFacturationDeleteDialogComponent>;
  let service: LigneFactureFacturationService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LigneFactureFacturationDeleteDialogComponent],
      providers: [provideHttpClient(), NgbActiveModal],
    })
      .overrideTemplate(LigneFactureFacturationDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LigneFactureFacturationDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LigneFactureFacturationService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
