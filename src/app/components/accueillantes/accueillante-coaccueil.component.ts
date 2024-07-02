import {Component, inject, Input, OnInit} from "@angular/core";
import {CoAccueil, CoAccueillante, findSameAccueillantePosition, getAccueillante} from "../../model/coaccueil";
import {DatePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {LocalCoaccsService} from "../../services/local-coaccs.service";

@Component({
  selector: "app-accueillante-coaccueil",
  standalone: true,
  template: `
    <div class="coaccueil">
      Avec <a [routerLink]="['..', otherCoAccueillante.ac]">{{ otherCoAccueillante.ac }}
      ({{ otherCoAccueillante.titulaire ? "T" : "R" }})</a>
      depuis {{ coAccueil.start | date }}
      @if (coAccueil.end) {
        jusqu'à {{ coAccueil.end | date }}
      }
      @if (coAccueil.previousId && !sameAccueillante.titulaire) {
        <div class="replacement">(remplace <a [routerLink]="['..', replacedAccueillante?.ac]">{{ replacedAccueillante?.ac }}</a>)</div>
      }
    </div>
  `,
  imports: [
    DatePipe,
    RouterLink
  ],
  styles:[`
    .replacement{
        font-style: italic;
        color: darkslategray;
        padding-left: 20px;
    }
    .coaccueil{
      padding: 5px;
    }
  `]
})
export class AccueillanteCoaccueilComponent implements OnInit{
    @Input() currentAccueillante! : CoAccueillante;
    @Input() coAccueil!: CoAccueil

    previousCoAccueil?: CoAccueil

    service = inject(LocalCoaccsService);


    sameAccueillante!: CoAccueillante
    otherCoAccueillante!: CoAccueillante
    position!: string;
    replacedAccueillante?: CoAccueillante;

    ngOnInit(): void {
      this.position = findSameAccueillantePosition(this.currentAccueillante.ac, this.currentAccueillante.position, this.coAccueil);
      this.sameAccueillante = getAccueillante(this.coAccueil, this.position);
      this.otherCoAccueillante = getAccueillante(this.coAccueil, this.position === "1"? "2" : "1");
      if(this.coAccueil.previousId){
        this.service.getById(this.coAccueil.previousId).subscribe(res => {
          this.previousCoAccueil = res
          this.replacedAccueillante = this.previousCoAccueil? getAccueillante(this.previousCoAccueil, this.position) : undefined;
        });
      }

     /* console.log("currentAcueillante", this.currentAccueillante)
      console.log("sameAccueillante", this.sameAccueillante)
      console.log("otherCoAccueillante", this.otherCoAccueillante)*/
    }

}
