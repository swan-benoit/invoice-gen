import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFactureFacturation } from '../facture-facturation.model';
import { FactureFacturationService } from '../service/facture-facturation.service';

const factureResolve = (route: ActivatedRouteSnapshot): Observable<null | IFactureFacturation> => {
  const id = route.params.id;
  if (id) {
    return inject(FactureFacturationService)
      .find(id)
      .pipe(
        mergeMap((facture: HttpResponse<IFactureFacturation>) => {
          if (facture.body) {
            return of(facture.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default factureResolve;
