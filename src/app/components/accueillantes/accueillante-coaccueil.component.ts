import {Component, inject, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {CoAccueil, CoAccueillante, findSameAccueillantePosition, getAccueillante} from "../../model/coaccueil";
import {DatePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {LocalCoaccsService} from "../../services/local-coaccs.service";

@Component({
  selector: "app-accueillante-coaccueil",
  standalone: true,
  template: `
    <div [class]="getClass()">
      Avec <a [routerLink]="['..', otherCoAccueillante.ac]">{{ otherCoAccueillante.ac }}
      ({{ otherCoAccueillante.titulaire ? "T" : "R" }})</a>
      depuis {{ coAccueil.start | date }}
      @if (coAccueil.end) {
        jusqu'à {{ coAccueil.end | date }}
      }
      @if (coAccueil.previousId && !sameAccueillante.titulaire && replacedAccueillante?.ac != sameAccueillante.ac) {
        <div class="replacement">(remplace <a
          [routerLink]="['..', replacedAccueillante?.ac]">{{ replacedAccueillante?.ac }}</a>)
        </div>
      }
      @if (coAccueil.previousId && replacedAccueillante?.ac === sameAccueillante.ac && !replacedAccueillante?.titulaire && sameAccueillante.titulaire) {
        <div class="replacement">(titularisation)</div>
      }
    </div>
  `,
  imports: [
    DatePipe,
    RouterLink
  ],
  styles: [`
    .replacement {
      font-style: italic;
      color: darkslategray;
      padding-left: 20px;
    }

    .coaccueil {
      padding: 5px;
    }
    .current {
      background-color: #0707070f;
    }
    .titulaire {
      border-left: 3px solid #8fe3ec;
    }
    .temporaire {
      border-left: 3px solid #f7ba8f;
    }
  `]
})
export class AccueillanteCoaccueilComponent implements OnChanges {

    @Input() currentAccueillante! : CoAccueillante;
    @Input() coAccueil!: CoAccueil
    @Input() current: boolean = false

    previousCoAccueil?: CoAccueil

    service = inject(LocalCoaccsService);


    sameAccueillante!: CoAccueillante
    otherCoAccueillante!: CoAccueillante
    position!: string;
    replacedAccueillante?: CoAccueillante;

    ngOnChanges(changes: SimpleChanges): void {
      // console.log("coaccueil " , this.coAccueil)
      this.position = findSameAccueillantePosition(this.currentAccueillante.ac, this.currentAccueillante.position, this.coAccueil);
      this.sameAccueillante = getAccueillante(this.coAccueil, this.position);
      this.otherCoAccueillante = getAccueillante(this.coAccueil, this.position === "1"? "2" : "1");
      if(this.coAccueil.previousId){
        this.service.getById(this.coAccueil.previousId).subscribe(res => {
          this.previousCoAccueil = res
          this.replacedAccueillante = this.previousCoAccueil? getAccueillante(this.previousCoAccueil, this.position) : undefined;
        });
      }
      // console.log("currentAcueillante", this.currentAccueillante)
      // console.log("sameAccueillante", this.sameAccueillante)
      // console.log("otherCoAccueillante", this.otherCoAccueillante)
    }

  getClass() {
    var c = 'coaccueil';
    if(this.current){
      c+= " current";
    }
    if(this.sameAccueillante.titulaire){
      c+= " titulaire";
    }else{
      c+= " temporaire";
    }
    return c;
  }
}
