import { IFactureFacturation } from 'app/entities/facture-facturation/facture-facturation.model';

export interface ILigneFactureFacturation {
  id: number;
  description?: string | null;
  quantite?: number | null;
  prixUnitaireHT?: number | null;
  tauxTVA?: number | null;
  facture?: Pick<IFactureFacturation, 'id'> | null;
}

export type NewLigneFactureFacturation = Omit<ILigneFactureFacturation, 'id'> & { id: null };
