import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILigneFactureFacturation, NewLigneFactureFacturation } from '../ligne-facture-facturation.model';

export type PartialUpdateLigneFactureFacturation = Partial<ILigneFactureFacturation> & Pick<ILigneFactureFacturation, 'id'>;

export type EntityResponseType = HttpResponse<ILigneFactureFacturation>;
export type EntityArrayResponseType = HttpResponse<ILigneFactureFacturation[]>;

@Injectable({ providedIn: 'root' })
export class LigneFactureFacturationService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ligne-factures');

  create(ligneFacture: NewLigneFactureFacturation): Observable<EntityResponseType> {
    return this.http.post<ILigneFactureFacturation>(this.resourceUrl, ligneFacture, { observe: 'response' });
  }

  update(ligneFacture: ILigneFactureFacturation): Observable<EntityResponseType> {
    return this.http.put<ILigneFactureFacturation>(
      `${this.resourceUrl}/${this.getLigneFactureFacturationIdentifier(ligneFacture)}`,
      ligneFacture,
      { observe: 'response' },
    );
  }

  partialUpdate(ligneFacture: PartialUpdateLigneFactureFacturation): Observable<EntityResponseType> {
    return this.http.patch<ILigneFactureFacturation>(
      `${this.resourceUrl}/${this.getLigneFactureFacturationIdentifier(ligneFacture)}`,
      ligneFacture,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILigneFactureFacturation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILigneFactureFacturation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLigneFactureFacturationIdentifier(ligneFacture: Pick<ILigneFactureFacturation, 'id'>): number {
    return ligneFacture.id;
  }

  compareLigneFactureFacturation(
    o1: Pick<ILigneFactureFacturation, 'id'> | null,
    o2: Pick<ILigneFactureFacturation, 'id'> | null,
  ): boolean {
    return o1 && o2 ? this.getLigneFactureFacturationIdentifier(o1) === this.getLigneFactureFacturationIdentifier(o2) : o1 === o2;
  }

  addLigneFactureFacturationToCollectionIfMissing<Type extends Pick<ILigneFactureFacturation, 'id'>>(
    ligneFactureCollection: Type[],
    ...ligneFacturesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ligneFactures: Type[] = ligneFacturesToCheck.filter(isPresent);
    if (ligneFactures.length > 0) {
      const ligneFactureCollectionIdentifiers = ligneFactureCollection.map(ligneFactureItem =>
        this.getLigneFactureFacturationIdentifier(ligneFactureItem),
      );
      const ligneFacturesToAdd = ligneFactures.filter(ligneFactureItem => {
        const ligneFactureIdentifier = this.getLigneFactureFacturationIdentifier(ligneFactureItem);
        if (ligneFactureCollectionIdentifiers.includes(ligneFactureIdentifier)) {
          return false;
        }
        ligneFactureCollectionIdentifiers.push(ligneFactureIdentifier);
        return true;
      });
      return [...ligneFacturesToAdd, ...ligneFactureCollection];
    }
    return ligneFactureCollection;
  }
}
