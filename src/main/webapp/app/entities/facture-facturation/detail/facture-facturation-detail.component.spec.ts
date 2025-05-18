import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { FactureFacturationDetailComponent } from './facture-facturation-detail.component';

describe('FactureFacturation Management Detail Component', () => {
  let comp: FactureFacturationDetailComponent;
  let fixture: ComponentFixture<FactureFacturationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureFacturationDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./facture-facturation-detail.component').then(m => m.FactureFacturationDetailComponent),
              resolve: { facture: () => of({ id: 29649 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(FactureFacturationDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureFacturationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load facture on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', FactureFacturationDetailComponent);

      // THEN
      expect(instance.facture()).toEqual(expect.objectContaining({ id: 29649 }));
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
