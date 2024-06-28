export type CoAccueil = {
  id: string,
  ac1: string,
  ac2: string,
  titulaire1: boolean,
  titulaire2: boolean,
  start: Date,
  end?: Date,
  address: string,
  previousId?: string,
  sae: string
}

export type CoAccueillante = {
  ac: string,
  titulaire: boolean,
  position: string
}

export function findSameAccueillantePosition(accueillante: string, originalPosition: string, coAccueil: CoAccueil): string{
  if(coAccueil.ac1 === accueillante){
    return "1";
  }
  if(coAccueil.ac2 === accueillante){
    return "2";
  }
  return originalPosition;
}

export function findPosition(accueillante: String, coAccueil: CoAccueil){
  return accueillante === coAccueil.ac1 ? "1" : "2";
}

export function getAccueillante(coAccueil: CoAccueil, position: string): CoAccueillante{
  return {
    ac : (coAccueil as any)[`ac${position}`] as string,
    titulaire:  (coAccueil as any)[`titulaire${position}`] as boolean,
    position: position
  }
}
