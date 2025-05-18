export interface IClientFacturation {
  id: number;
  nom?: string | null;
  email?: string | null;
  telephone?: string | null;
  siret?: string | null;
  adresseLigne1?: string | null;
  adresseLigne2?: string | null;
  codePostal?: string | null;
  ville?: string | null;
}

export type NewClientFacturation = Omit<IClientFacturation, 'id'> & { id: null };
