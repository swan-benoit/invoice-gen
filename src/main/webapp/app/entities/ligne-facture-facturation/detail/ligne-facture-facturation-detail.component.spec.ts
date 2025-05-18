import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { LigneFactureFacturationDetailComponent } from './ligne-facture-facturation-detail.component';

describe('LigneFactureFacturation Management Detail Component', () => {
  let comp: LigneFactureFacturationDetailComponent;
  let fixture: ComponentFixture<LigneFactureFacturationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigneFactureFacturationDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () =>
                import('./ligne-facture-facturation-detail.component').then(m => m.LigneFactureFacturationDetailComponent),
              resolve: { ligneFacture: () => of({ id: 32395 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(LigneFactureFacturationDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LigneFactureFacturationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load ligneFacture on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', LigneFactureFacturationDetailComponent);

      // THEN
      expect(instance.ligneFacture()).toEqual(expect.objectContaining({ id: 32395 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
