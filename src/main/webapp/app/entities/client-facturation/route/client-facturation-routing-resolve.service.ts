import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClientFacturation } from '../client-facturation.model';
import { ClientFacturationService } from '../service/client-facturation.service';

const clientResolve = (route: ActivatedRouteSnapshot): Observable<null | IClientFacturation> => {
  const id = route.params.id;
  if (id) {
    return inject(ClientFacturationService)
      .find(id)
      .pipe(
        mergeMap((client: HttpResponse<IClientFacturation>) => {
          if (client.body) {
            return of(client.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default clientResolve;
