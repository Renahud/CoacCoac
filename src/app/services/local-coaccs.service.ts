import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {db, seq} from "./db"
import {comparatorOf} from "../model/comparators";


@Injectable({
  providedIn: "root"
})
export class LocalCoaccsService{

  getAll(): Observable<CoAccueil[]>{
    return new Observable(observer => {
      observer.next(db.sort(comparatorOf(c => Number(c.id))));
    });
  }

  getByAccueillante(accueillante: string) {
    return this.getAll().pipe(
      map(res => res.filter(coacc => coacc.ac1 === accueillante || coacc.ac2 === accueillante))
    )
  }

  nextSeq(){
    return new Observable( obs => {
     const id = seq.nextId;
     seq.nextId++;
     obs.next(id);
    })
  }

  updateCoAccueil(coAccueil: CoAccueil){
    return new Observable(obs => {
      let index = db.indexOf(db.find(c => c.id === coAccueil.id)!);
      db[index] = coAccueil;
      obs.next(coAccueil)
    });
  }

  saveCoaccueil(coAccueil: CoAccueil) {
    return new Observable(obs => {
      if(coAccueil.previousId){
        this.getById(coAccueil.previousId).subscribe(previous => {
          previous.end = new Date(coAccueil.start.getTime() - (1000 * 60 * 60 * 20))
          this.updateCoAccueil(previous).subscribe()
        })
      }
      db.push(coAccueil);
      obs.next(coAccueil);
    })
  }

  getById(id: string){
    return new Observable<CoAccueil>(obs => obs.next(db.find(c => c.id === id)!));
  }

  deleteCoaccueil(coaccueil: CoAccueil) {
    return new Observable(obs => {
      db.splice(db.indexOf(coaccueil), 1);
    })
  }
}

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
