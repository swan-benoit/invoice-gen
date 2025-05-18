import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFactureFacturation, NewFactureFacturation } from '../facture-facturation.model';

export type PartialUpdateFactureFacturation = Partial<IFactureFacturation> & Pick<IFactureFacturation, 'id'>;

type RestOf<T extends IFactureFacturation | NewFactureFacturation> = Omit<T, 'dateFacture' | 'dateEcheance'> & {
  dateFacture?: string | null;
  dateEcheance?: string | null;
};

export type RestFactureFacturation = RestOf<IFactureFacturation>;

export type NewRestFactureFacturation = RestOf<NewFactureFacturation>;

export type PartialUpdateRestFactureFacturation = RestOf<PartialUpdateFactureFacturation>;

export type EntityResponseType = HttpResponse<IFactureFacturation>;
export type EntityArrayResponseType = HttpResponse<IFactureFacturation[]>;

@Injectable({ providedIn: 'root' })
export class FactureFacturationService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/factures');

  create(facture: NewFactureFacturation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(facture);
    return this.http
      .post<RestFactureFacturation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(facture: IFactureFacturation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(facture);
    return this.http
      .put<RestFactureFacturation>(`${this.resourceUrl}/${this.getFactureFacturationIdentifier(facture)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(facture: PartialUpdateFactureFacturation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(facture);
    return this.http
      .patch<RestFactureFacturation>(`${this.resourceUrl}/${this.getFactureFacturationIdentifier(facture)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFactureFacturation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFactureFacturation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFactureFacturationIdentifier(facture: Pick<IFactureFacturation, 'id'>): number {
    return facture.id;
  }

  compareFactureFacturation(o1: Pick<IFactureFacturation, 'id'> | null, o2: Pick<IFactureFacturation, 'id'> | null): boolean {
    return o1 && o2 ? this.getFactureFacturationIdentifier(o1) === this.getFactureFacturationIdentifier(o2) : o1 === o2;
  }

  addFactureFacturationToCollectionIfMissing<Type extends Pick<IFactureFacturation, 'id'>>(
    factureCollection: Type[],
    ...facturesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const factures: Type[] = facturesToCheck.filter(isPresent);
    if (factures.length > 0) {
      const factureCollectionIdentifiers = factureCollection.map(factureItem => this.getFactureFacturationIdentifier(factureItem));
      const facturesToAdd = factures.filter(factureItem => {
        const factureIdentifier = this.getFactureFacturationIdentifier(factureItem);
        if (factureCollectionIdentifiers.includes(factureIdentifier)) {
          return false;
        }
        factureCollectionIdentifiers.push(factureIdentifier);
        return true;
      });
      return [...facturesToAdd, ...factureCollection];
    }
    return factureCollection;
  }

  protected convertDateFromClient<T extends IFactureFacturation | NewFactureFacturation | PartialUpdateFactureFacturation>(
    facture: T,
  ): RestOf<T> {
    return {
      ...facture,
      dateFacture: facture.dateFacture?.toJSON() ?? null,
      dateEcheance: facture.dateEcheance?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFactureFacturation: RestFactureFacturation): IFactureFacturation {
    return {
      ...restFactureFacturation,
      dateFacture: restFactureFacturation.dateFacture ? dayjs(restFactureFacturation.dateFacture) : undefined,
      dateEcheance: restFactureFacturation.dateEcheance ? dayjs(restFactureFacturation.dateEcheance) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFactureFacturation>): HttpResponse<IFactureFacturation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFactureFacturation[]>): HttpResponse<IFactureFacturation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
