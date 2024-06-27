import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {CoaccsService, CoAccueil} from "./services/coaccs.service";
import {DatePipe, JsonPipe} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, ReactiveFormsModule, RouterLink, DatePipe],
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
        </div>
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
  title = 'Coac';
  coaccs: CoAccueil[] = []
  service = inject(CoaccsService);

  ngOnInit(): void {
    console.log("test")
      this.service.getAll().subscribe(res => {
        this.coaccs = res;
      });
  }

}
export type RemplacementType = "Definitif" | "Temporaire";
