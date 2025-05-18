import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILigneFactureFacturation } from '../ligne-facture-facturation.model';
import { LigneFactureFacturationService } from '../service/ligne-facture-facturation.service';

const ligneFactureResolve = (route: ActivatedRouteSnapshot): Observable<null | ILigneFactureFacturation> => {
  const id = route.params.id;
  if (id) {
    return inject(LigneFactureFacturationService)
      .find(id)
      .pipe(
        mergeMap((ligneFacture: HttpResponse<ILigneFactureFacturation>) => {
          if (ligneFacture.body) {
            return of(ligneFacture.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default ligneFactureResolve;
