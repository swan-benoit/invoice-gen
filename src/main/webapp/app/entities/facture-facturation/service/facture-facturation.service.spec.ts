import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IFactureFacturation } from '../facture-facturation.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../facture-facturation.test-samples';

import { FactureFacturationService, RestFactureFacturation } from './facture-facturation.service';

const requireRestSample: RestFactureFacturation = {
  ...sampleWithRequiredData,
  dateFacture: sampleWithRequiredData.dateFacture?.toJSON(),
  dateEcheance: sampleWithRequiredData.dateEcheance?.toJSON(),
};

describe('FactureFacturation Service', () => {
  let service: FactureFacturationService;
  let httpMock: HttpTestingController;
  let expectedResult: IFactureFacturation | IFactureFacturation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(FactureFacturationService);
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

    it('should create a FactureFacturation', () => {
      const facture = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(facture).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FactureFacturation', () => {
      const facture = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(facture).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FactureFacturation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FactureFacturation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FactureFacturation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFactureFacturationToCollectionIfMissing', () => {
      it('should add a FactureFacturation to an empty array', () => {
        const facture: IFactureFacturation = sampleWithRequiredData;
        expectedResult = service.addFactureFacturationToCollectionIfMissing([], facture);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(facture);
      });

      it('should not add a FactureFacturation to an array that contains it', () => {
        const facture: IFactureFacturation = sampleWithRequiredData;
        const factureCollection: IFactureFacturation[] = [
          {
            ...facture,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFactureFacturationToCollectionIfMissing(factureCollection, facture);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FactureFacturation to an array that doesn't contain it", () => {
        const facture: IFactureFacturation = sampleWithRequiredData;
        const factureCollection: IFactureFacturation[] = [sampleWithPartialData];
        expectedResult = service.addFactureFacturationToCollectionIfMissing(factureCollection, facture);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(facture);
      });

      it('should add only unique FactureFacturation to an array', () => {
        const factureArray: IFactureFacturation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const factureCollection: IFactureFacturation[] = [sampleWithRequiredData];
        expectedResult = service.addFactureFacturationToCollectionIfMissing(factureCollection, ...factureArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const facture: IFactureFacturation = sampleWithRequiredData;
        const facture2: IFactureFacturation = sampleWithPartialData;
        expectedResult = service.addFactureFacturationToCollectionIfMissing([], facture, facture2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(facture);
        expect(expectedResult).toContain(facture2);
      });

      it('should accept null and undefined values', () => {
        const facture: IFactureFacturation = sampleWithRequiredData;
        expectedResult = service.addFactureFacturationToCollectionIfMissing([], null, facture, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(facture);
      });

      it('should return initial array if no FactureFacturation is added', () => {
        const factureCollection: IFactureFacturation[] = [sampleWithRequiredData];
        expectedResult = service.addFactureFacturationToCollectionIfMissing(factureCollection, undefined, null);
        expect(expectedResult).toEqual(factureCollection);
      });
    });

    describe('compareFactureFacturation', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFactureFacturation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 29649 };
        const entity2 = null;

        const compareResult1 = service.compareFactureFacturation(entity1, entity2);
        const compareResult2 = service.compareFactureFacturation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 29649 };
        const entity2 = { id: 30124 };

        const compareResult1 = service.compareFactureFacturation(entity1, entity2);
        const compareResult2 = service.compareFactureFacturation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 29649 };
        const entity2 = { id: 29649 };

        const compareResult1 = service.compareFactureFacturation(entity1, entity2);
        const compareResult2 = service.compareFactureFacturation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
