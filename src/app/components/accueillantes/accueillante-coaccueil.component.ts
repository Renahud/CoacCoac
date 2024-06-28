import {Component, inject, Input, OnInit} from "@angular/core";
import {
  CoAccueil,
  CoAccueillante,
  findPosition,
  findSameAccueillantePosition,
  getAccueillante
} from "../../model/coaccueil";
import {DatePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {CoaccsService} from "../../services/coaccs.service";

@Component({
  selector: "app-accueillante-coaccueil",
  standalone: true,
  template: `
    <div>avec <a [routerLink]="['..', otherCoAccueillante.ac]">{{ otherCoAccueillante.ac }}
      ({{ otherCoAccueillante.titulaire ? "T" : "R" }})</a> depuis {{ coAccueil.start | date }}
      @if (coAccueil.end) {
        jusqu'à {{ coAccueil.end | date }}
      }
      @if (coAccueil.previousId && !sameAccueillante.titulaire) {
        (remplace <a [routerLink]="['..', replacedAccueillante?.ac]">{{ replacedAccueillante?.ac }}</a>)
      }
    </div>
  `,
  imports: [
    DatePipe,
    RouterLink
  ]
})
export class AccueillanteCoaccueilComponent implements OnInit{
    @Input() currentAccueillante! : CoAccueillante;
    @Input() coAccueil!: CoAccueil

    previousCoAccueil?: CoAccueil

    service = inject(CoaccsService);


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
    }

}
