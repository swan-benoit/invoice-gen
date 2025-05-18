import dayjs from 'dayjs/esm';
import { IClientFacturation } from 'app/entities/client-facturation/client-facturation.model';
import { FactureStatut } from 'app/entities/enumerations/facture-statut.model';

export interface IFactureFacturation {
  id: number;
  numero?: string | null;
  dateFacture?: dayjs.Dayjs | null;
  dateEcheance?: dayjs.Dayjs | null;
  statut?: keyof typeof FactureStatut | null;
  notes?: string | null;
  client?: Pick<IClientFacturation, 'id'> | null;
}

export type NewFactureFacturation = Omit<IFactureFacturation, 'id'> & { id: null };
