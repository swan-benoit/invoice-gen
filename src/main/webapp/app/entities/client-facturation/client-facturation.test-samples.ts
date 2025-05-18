import { IClientFacturation, NewClientFacturation } from './client-facturation.model';

export const sampleWithRequiredData: IClientFacturation = {
  id: 16289,
  nom: 'du côté de chialer oh',
};

export const sampleWithPartialData: IClientFacturation = {
  id: 15082,
  nom: "à l'insu de",
  email: 'Sandrine_Legall30@yahoo.fr',
  telephone: '0542933057',
  siret: 'ronron pendant glouglou',
  adresseLigne1: 'cocorico après que mature',
  adresseLigne2: 'reconstruire trop cocher',
  codePostal: 'antagoniste avant que autour de',
};

export const sampleWithFullData: IClientFacturation = {
  id: 31496,
  nom: 'bzzz lectorat séculaire',
  email: 'Therese.Schneider@yahoo.fr',
  telephone: '+33 372692810',
  siret: 'jamais tendre',
  adresseLigne1: 'évoluer sur mal',
  adresseLigne2: 'coin-coin de la part de dynamique',
  codePostal: 'orange de sorte que',
  ville: 'incognito pacifique égoïste',
};

export const sampleWithNewData: NewClientFacturation = {
  nom: 'tôt à la merci',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
