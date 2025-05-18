import dayjs from 'dayjs/esm';

import { IFactureFacturation, NewFactureFacturation } from './facture-facturation.model';

export const sampleWithRequiredData: IFactureFacturation = {
  id: 28182,
  numero: 'entre-temps',
  dateFacture: dayjs('2025-05-18T10:22'),
  statut: 'PAYEE',
};

export const sampleWithPartialData: IFactureFacturation = {
  id: 8201,
  numero: 'à partir de près pin-pon',
  dateFacture: dayjs('2025-05-18T12:26'),
  statut: 'ENVOYEE',
  notes: 'vouh au-dessus de',
};

export const sampleWithFullData: IFactureFacturation = {
  id: 4844,
  numero: 'lorsque dedans membre de l’équipe',
  dateFacture: dayjs('2025-05-18T10:00'),
  dateEcheance: dayjs('2025-05-17T19:35'),
  statut: 'ANNULEE',
  notes: 'pendant que combien',
};

export const sampleWithNewData: NewFactureFacturation = {
  numero: 'clac sitôt que altruiste',
  dateFacture: dayjs('2025-05-18T18:55'),
  statut: 'BROUILLON',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
