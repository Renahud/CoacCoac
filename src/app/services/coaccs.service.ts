import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, tap} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CoaccsService{
  httpClient = inject(HttpClient);
  basePath = "http://localhost:3000/coaccs"

  getAll(){
    return this.httpClient.get<CoAccueil[]>(this.basePath).pipe(
      map(res => res.sort((coacc1, coacc2) => coacc1.start <coacc2.start ? -1 : coacc1.start> coacc2.start? 1 : 0))
    );
  }

  getByAccueillante(accueillante: string) {
    return this.getAll().pipe(
      map(res => res.filter(coacc => coacc.ac1 === accueillante || coacc.ac2 === accueillante))
    )
  }

  nextSeq(){
     return this.httpClient.get<{ nextId: number }>("http://localhost:3000/seq").pipe(
       tap(id => {
         const newId = Number(id.nextId) +1;
         this.httpClient.put("http://localhost:3000/seq", {nextId:newId}).subscribe();
       }),
       map(seq => seq.nextId)
     );
  }

  updateCoAccueil(coAccueil: CoAccueil){
    return this.httpClient.put(`${this.basePath}/${coAccueil.id}`, coAccueil);
  }

  saveCoaccueil(coAccueil: CoAccueil) {
    if(coAccueil.previousId){
      this.getById(coAccueil.previousId).subscribe(previous => {
        previous.end = new Date()
        previous.end.setDate(coAccueil.start.getDate() - 1);
        this.updateCoAccueil(previous).subscribe()
      })
    }
    return this.httpClient.post(this.basePath, coAccueil);
  }

  getById(id: string){
    return this.httpClient.get<CoAccueil>(`${this.basePath}/${id}`)
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
    previousId?: string
}
