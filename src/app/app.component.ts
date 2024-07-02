import {Component, inject, OnInit, provideZoneChangeDetection} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CoAccueil} from "./services/coaccs.service";
import {DatePipe, JsonPipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LocalCoaccsService} from "./services/local-coaccs.service";
import {db} from "./services/db";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, ReactiveFormsModule, RouterLink, DatePipe, FormsModule],
  template: `

    <router-outlet />
    <div class="allRecord">
        <h2>Tous les records</h2>
      @for (coaccueil of coaccs; track coaccueil.id){
        <div class="coaccueil">
          <div style="flex: 1"> {{ coaccueil.id}}</div>
          <div  class="cell"> <a [routerLink]="['accueillante', coaccueil.ac1]" >{{ coaccueil.ac1}}</a> ({{coaccueil.titulaire1? 'Titulaire' : 'Remplaçante'}})</div>
          <div  class="cell"> <a [routerLink]="['accueillante', coaccueil.ac2]" >{{ coaccueil.ac2}}</a> ({{coaccueil.titulaire2? 'Titulaire' : 'Remplaçante'}})</div>
          <div  class="cell"> {{ coaccueil.start | date}}</div>
          <div  class="cell"> {{ coaccueil.end | date}}</div>
          <div  class="cell"> {{ coaccueil.address}}</div>
          <div  class="cell"> {{ coaccueil.sae}}</div>
          <div  class="cell"> @if (coaccueil.previousId){-> {{ coaccueil.previousId}}}</div>
          <div class="cell"><button (click)="delete(coaccueil)">Delete</button></div>
        </div>
        }
        <button (click)="showJSON = !showJSON">voir JSON</button>
        @if(showJSON){
        <div style="background-color: lightgray; font-family: 'JetBrains Mono'; padding: 10px" >
          {{coaccs | json}}
        </div>
        <textarea [(ngModel)]="importJson" style="width: 500px"></textarea><button (click)="import()">importer la db</button>
      }
    </div>
  `,
  styles: [`
    .allRecord{
      font-size: small;
      margin: 30px;
      padding: 20px;
      color: gray;
    }
    .coaccueil{
      padding: 5px;
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: start;
    }
    .cell{
      flex: 2;
    }
  `]
})
export class AppComponent implements OnInit{
  coaccs: CoAccueil[] = []
  service = inject(LocalCoaccsService);
  showJSON = false;
  importJson: string ="";

  ngOnInit(): void {

      this.service.getAll().subscribe(res => {
        console.log("res2", res)
        this.coaccs = res;
      });

    //this.service.load(db)
  }

  delete(coaccueil: CoAccueil) {
    this.service.deleteCoaccueil(coaccueil).subscribe()
  }

  import(){
    const importdb = JSON.parse(this.importJson) as CoAccueil[];
    this.service.load(importdb);
  }
}
