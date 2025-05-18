import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IClientFacturation } from '../client-facturation.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../client-facturation.test-samples';

import { ClientFacturationService } from './client-facturation.service';

const requireRestSample: IClientFacturation = {
  ...sampleWithRequiredData,
};

describe('ClientFacturation Service', () => {
  let service: ClientFacturationService;
  let httpMock: HttpTestingController;
  let expectedResult: IClientFacturation | IClientFacturation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ClientFacturationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ClientFacturation', () => {
      const client = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(client).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClientFacturation', () => {
      const client = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(client).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ClientFacturation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClientFacturation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ClientFacturation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addClientFacturationToCollectionIfMissing', () => {
      it('should add a ClientFacturation to an empty array', () => {
        const client: IClientFacturation = sampleWithRequiredData;
        expectedResult = service.addClientFacturationToCollectionIfMissing([], client);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(client);
      });

      it('should not add a ClientFacturation to an array that contains it', () => {
        const client: IClientFacturation = sampleWithRequiredData;
        const clientCollection: IClientFacturation[] = [
          {
            ...client,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClientFacturationToCollectionIfMissing(clientCollection, client);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClientFacturation to an array that doesn't contain it", () => {
        const client: IClientFacturation = sampleWithRequiredData;
        const clientCollection: IClientFacturation[] = [sampleWithPartialData];
        expectedResult = service.addClientFacturationToCollectionIfMissing(clientCollection, client);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(client);
      });

      it('should add only unique ClientFacturation to an array', () => {
        const clientArray: IClientFacturation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const clientCollection: IClientFacturation[] = [sampleWithRequiredData];
        expectedResult = service.addClientFacturationToCollectionIfMissing(clientCollection, ...clientArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const client: IClientFacturation = sampleWithRequiredData;
        const client2: IClientFacturation = sampleWithPartialData;
        expectedResult = service.addClientFacturationToCollectionIfMissing([], client, client2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(client);
        expect(expectedResult).toContain(client2);
      });

      it('should accept null and undefined values', () => {
        const client: IClientFacturation = sampleWithRequiredData;
        expectedResult = service.addClientFacturationToCollectionIfMissing([], null, client, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(client);
      });

      it('should return initial array if no ClientFacturation is added', () => {
        const clientCollection: IClientFacturation[] = [sampleWithRequiredData];
        expectedResult = service.addClientFacturationToCollectionIfMissing(clientCollection, undefined, null);
        expect(expectedResult).toEqual(clientCollection);
      });
    });

    describe('compareClientFacturation', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClientFacturation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 26282 };
        const entity2 = null;

        const compareResult1 = service.compareClientFacturation(entity1, entity2);
        const compareResult2 = service.compareClientFacturation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 26282 };
        const entity2 = { id: 16836 };

        const compareResult1 = service.compareClientFacturation(entity1, entity2);
        const compareResult2 = service.compareClientFacturation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 26282 };
        const entity2 = { id: 26282 };

        const compareResult1 = service.compareClientFacturation(entity1, entity2);
        const compareResult2 = service.compareClientFacturation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
