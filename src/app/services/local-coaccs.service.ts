import {Injectable} from "@angular/core";
import {map, Observable, Subject} from "rxjs";
import {seq} from "./db"
import {CoaccsService} from "./coaccs.service";


@Injectable({
  providedIn: "root"
})
export class LocalCoaccsService{

  db$ = new Subject<CoAccueil[]>();
  currentDB: CoAccueil[] = [];

  init(db: CoAccueil[]) {
    this.db$.subscribe(data => {
      console.log("new DB", data)
      this.currentDB = data
    });
    this.load(db);
  }

  getAll(): Observable<CoAccueil[]>{
    return this.db$;
  }

  getByAccueillante(accueillante: string) {
    /*return this.getAll().pipe(
      map(res => res.filter(coacc => coacc.ac1 === accueillante || coacc.ac2 === accueillante))
    )*/
    return new Observable<CoAccueil[]>(obs => obs.next(this.currentDB.filter(coacc => coacc.ac1 === accueillante || coacc.ac2 === accueillante)))
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
      let index = this.currentDB.indexOf(this.currentDB.find(c => c.id === coAccueil.id)!);
      this.currentDB[index] = coAccueil;
      this.db$.next(this.currentDB);
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
      this.currentDB.push(coAccueil);
      this.db$.next(this.currentDB);
      obs.next(coAccueil);
    })
  }

  getById(id: string){
    const found = this.currentDB.find(c => c.id === id)!;
    return new Observable<CoAccueil>(obs => {
      obs.next(found)
    });
    /*return this.db$.pipe(
      map(data => data.find(c => c.id === id)!)
    );*/
  }

  deleteCoaccueil(coaccueil: CoAccueil) {
    return new Observable(obs => {
      this.currentDB.splice(this.currentDB.indexOf(coaccueil), 1);
      this.db$.next(this.currentDB);
    })
  }

  load(coaccs: CoAccueil[]){
    this.db$.next(coaccs);
    let maxId = coaccs.map(c => c.id).sort((id1, id2) => id1<id2? -1 : id1>id2 ? 1 : 0).reverse()[0];
    seq.nextId = Number(maxId) +1;
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
