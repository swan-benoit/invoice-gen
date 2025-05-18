import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClientFacturation, NewClientFacturation } from '../client-facturation.model';

export type PartialUpdateClientFacturation = Partial<IClientFacturation> & Pick<IClientFacturation, 'id'>;

export type EntityResponseType = HttpResponse<IClientFacturation>;
export type EntityArrayResponseType = HttpResponse<IClientFacturation[]>;

@Injectable({ providedIn: 'root' })
export class ClientFacturationService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clients');

  create(client: NewClientFacturation): Observable<EntityResponseType> {
    return this.http.post<IClientFacturation>(this.resourceUrl, client, { observe: 'response' });
  }

  update(client: IClientFacturation): Observable<EntityResponseType> {
    return this.http.put<IClientFacturation>(`${this.resourceUrl}/${this.getClientFacturationIdentifier(client)}`, client, {
      observe: 'response',
    });
  }

  partialUpdate(client: PartialUpdateClientFacturation): Observable<EntityResponseType> {
    return this.http.patch<IClientFacturation>(`${this.resourceUrl}/${this.getClientFacturationIdentifier(client)}`, client, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClientFacturation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClientFacturation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClientFacturationIdentifier(client: Pick<IClientFacturation, 'id'>): number {
    return client.id;
  }

  compareClientFacturation(o1: Pick<IClientFacturation, 'id'> | null, o2: Pick<IClientFacturation, 'id'> | null): boolean {
    return o1 && o2 ? this.getClientFacturationIdentifier(o1) === this.getClientFacturationIdentifier(o2) : o1 === o2;
  }

  addClientFacturationToCollectionIfMissing<Type extends Pick<IClientFacturation, 'id'>>(
    clientCollection: Type[],
    ...clientsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clients: Type[] = clientsToCheck.filter(isPresent);
    if (clients.length > 0) {
      const clientCollectionIdentifiers = clientCollection.map(clientItem => this.getClientFacturationIdentifier(clientItem));
      const clientsToAdd = clients.filter(clientItem => {
        const clientIdentifier = this.getClientFacturationIdentifier(clientItem);
        if (clientCollectionIdentifiers.includes(clientIdentifier)) {
          return false;
        }
        clientCollectionIdentifiers.push(clientIdentifier);
        return true;
      });
      return [...clientsToAdd, ...clientCollection];
    }
    return clientCollection;
  }
}
