import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ILigneFactureFacturation } from '../ligne-facture-facturation.model';
import {
  sampleWithFullData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithRequiredData,
} from '../ligne-facture-facturation.test-samples';

import { LigneFactureFacturationService } from './ligne-facture-facturation.service';

const requireRestSample: ILigneFactureFacturation = {
  ...sampleWithRequiredData,
};

describe('LigneFactureFacturation Service', () => {
  let service: LigneFactureFacturationService;
  let httpMock: HttpTestingController;
  let expectedResult: ILigneFactureFacturation | ILigneFactureFacturation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(LigneFactureFacturationService);
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

    it('should create a LigneFactureFacturation', () => {
      const ligneFacture = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ligneFacture).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LigneFactureFacturation', () => {
      const ligneFacture = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ligneFacture).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LigneFactureFacturation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LigneFactureFacturation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LigneFactureFacturation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLigneFactureFacturationToCollectionIfMissing', () => {
      it('should add a LigneFactureFacturation to an empty array', () => {
        const ligneFacture: ILigneFactureFacturation = sampleWithRequiredData;
        expectedResult = service.addLigneFactureFacturationToCollectionIfMissing([], ligneFacture);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ligneFacture);
      });

      it('should not add a LigneFactureFacturation to an array that contains it', () => {
        const ligneFacture: ILigneFactureFacturation = sampleWithRequiredData;
        const ligneFactureCollection: ILigneFactureFacturation[] = [
          {
            ...ligneFacture,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLigneFactureFacturationToCollectionIfMissing(ligneFactureCollection, ligneFacture);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LigneFactureFacturation to an array that doesn't contain it", () => {
        const ligneFacture: ILigneFactureFacturation = sampleWithRequiredData;
        const ligneFactureCollection: ILigneFactureFacturation[] = [sampleWithPartialData];
        expectedResult = service.addLigneFactureFacturationToCollectionIfMissing(ligneFactureCollection, ligneFacture);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ligneFacture);
      });

      it('should add only unique LigneFactureFacturation to an array', () => {
        const ligneFactureArray: ILigneFactureFacturation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ligneFactureCollection: ILigneFactureFacturation[] = [sampleWithRequiredData];
        expectedResult = service.addLigneFactureFacturationToCollectionIfMissing(ligneFactureCollection, ...ligneFactureArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ligneFacture: ILigneFactureFacturation = sampleWithRequiredData;
        const ligneFacture2: ILigneFactureFacturation = sampleWithPartialData;
        expectedResult = service.addLigneFactureFacturationToCollectionIfMissing([], ligneFacture, ligneFacture2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ligneFacture);
        expect(expectedResult).toContain(ligneFacture2);
      });

      it('should accept null and undefined values', () => {
        const ligneFacture: ILigneFactureFacturation = sampleWithRequiredData;
        expectedResult = service.addLigneFactureFacturationToCollectionIfMissing([], null, ligneFacture, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ligneFacture);
      });

      it('should return initial array if no LigneFactureFacturation is added', () => {
        const ligneFactureCollection: ILigneFactureFacturation[] = [sampleWithRequiredData];
        expectedResult = service.addLigneFactureFacturationToCollectionIfMissing(ligneFactureCollection, undefined, null);
        expect(expectedResult).toEqual(ligneFactureCollection);
      });
    });

    describe('compareLigneFactureFacturation', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLigneFactureFacturation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 32395 };
        const entity2 = null;

        const compareResult1 = service.compareLigneFactureFacturation(entity1, entity2);
        const compareResult2 = service.compareLigneFactureFacturation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 32395 };
        const entity2 = { id: 8522 };

        const compareResult1 = service.compareLigneFactureFacturation(entity1, entity2);
        const compareResult2 = service.compareLigneFactureFacturation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 32395 };
        const entity2 = { id: 32395 };

        const compareResult1 = service.compareLigneFactureFacturation(entity1, entity2);
        const compareResult2 = service.compareLigneFactureFacturation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
