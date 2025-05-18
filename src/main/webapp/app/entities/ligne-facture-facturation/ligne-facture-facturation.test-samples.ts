import { ILigneFactureFacturation, NewLigneFactureFacturation } from './ligne-facture-facturation.model';

export const sampleWithRequiredData: ILigneFactureFacturation = {
  id: 160,
  description: 'assurément',
  quantite: 19771,
  prixUnitaireHT: 27581.54,
};

export const sampleWithPartialData: ILigneFactureFacturation = {
  id: 22518,
  description: 'corps enseignant',
  quantite: 12370,
  prixUnitaireHT: 19496.53,
  tauxTVA: 26.02,
};

export const sampleWithFullData: ILigneFactureFacturation = {
  id: 2315,
  description: 'dès avant pratiquer',
  quantite: 1862,
  prixUnitaireHT: 21994.87,
  tauxTVA: 2.88,
};

export const sampleWithNewData: NewLigneFactureFacturation = {
  description: 'athlète trop vu que',
  quantite: 32352,
  prixUnitaireHT: 3707.14,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
