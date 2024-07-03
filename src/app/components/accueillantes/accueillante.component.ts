import {Component, inject, OnInit, provideZoneChangeDetection} from "@angular/core";
import {CoAccueil} from "../../services/coaccs.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, DatePipe} from "@angular/common";
import {AccueillanteCoaccueilComponent} from "./accueillante-coaccueil.component";
import {CoAccueillante, getAccueillante} from "../../model/coaccueil";
import {LocalCoaccsService} from "../../services/local-coaccs.service";

@Component({
  selector: "app-accueillante",
  standalone: true,
  template: `
    <div class="accueillante">
      <h1> Co-accueils de {{ accueillante }}</h1>
      @if (coaccs.length === 0) {
        Pas de Coaccueil
      } @else {
        <div>
          @for (coaccueil of coaccs; track coaccueil.id + coAccueillante?.position) {
<!--            {{coaccueil.id + coAccueillante?.position}}-->
            <app-accueillante-coaccueil
              [currentAccueillante]="coAccueillante!"
              [coAccueil]="coaccueil"
              [current]="current === coaccueil"
            ></app-accueillante-coaccueil>
          }
        </div>
        <form class="remplacementForm" [formGroup]="formGroup">
          <h3>Remplacer une accueillante</h3>
          <div>
            Temporaire ?
            <input formControlName="temporary" type="checkbox">
          </div>
          <div>
            Accueillante remplacée
            <input formControlName="oldAc">
          </div>
          <div>
            Accueillante remplaçante
            <input formControlName="newAc">
          </div>
          <div>
            Date de début
            <input formControlName="startDate" type="date">
          </div>
          <div>
            <button (click)="addRemplacement()">Enregistrer</button>
          </div>
        </form>

      }
    </div>
  `,
  styles:[`
    .accueillante{
      margin: 30px;
      padding: 20px;
      width: 30%;
      background-color: aliceblue;
      border-radius: 10px;
    }
    .remplacementForm{
      margin-top: 20px;
      display: flex;
      flex-direction: column;

    }
  `],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    RouterLink,
    AsyncPipe,
    AccueillanteCoaccueilComponent
  ]
})
export class AccueillanteComponent implements OnInit{

  service = inject(LocalCoaccsService);
  route  = inject(ActivatedRoute);
  accueillante?: string;
  coAccueillante?: CoAccueillante;
  router = inject(Router)

  formGroup = new FormGroup({
    temporary : new FormControl<boolean>(true),
    oldAc : new FormControl<string|undefined>(undefined, {validators: Validators.required}),
    newAc : new FormControl<string|undefined>(undefined, {validators: Validators.required}),
    startDate: new FormControl<Date | undefined>(undefined, {validators: Validators.required}),
  })
  coaccs : CoAccueil[]  = []

  place!: string;
  current?: CoAccueil;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      // console.log("accueillante " + this.accueillante)
      this.accueillante = params["accueillante"] ;
      if(this.accueillante){
        this.service.getByAccueillante(this.accueillante).subscribe(res => {
          this.coaccs = res;
          this.current = this.coaccs[0]
          this.place = this.accueillante === this.current.ac1 ? "1" : "2";
          this.coAccueillante = getAccueillante(this.current!, this.place);
          console.log("current", this.current)
          console.log("place", this.place)
          console.log("this.coAccueillante", this.coAccueillante)

        });
        this.formGroup.controls.oldAc.setValue(this.accueillante);
        this.formGroup.controls.oldAc.disable();
      }
    });

  }

  addRemplacement() {
    let value = this.formGroup.getRawValue();

    this.service.nextSeq().subscribe(newId => {
      this.service.saveCoaccueil({
        id: String(newId),
        ac1: this.place === "1" ? value.newAc! : this.current?.ac1! ,
        ac2: this.place === "2" ? value.newAc! : this.current?.ac2!,
        start: new Date(value.startDate!),
        address: this.current?.address || "pas d'adresse",
        previousId: String(this.current?.id),
        titulaire1: this.place === "1" ? !value.temporary: this.current!.titulaire1 ,
        titulaire2: this.place === "2" ? !value.temporary: this.current!.titulaire2,
        sae: this.current!.sae
      }).subscribe( res => {
        this.router.navigate(["..", this.accueillante], {relativeTo:this.route, onSameUrlNavigation:"reload"})
      });

    })
  }

  track(coAccueil : CoAccueil){
    console.log("track", { coAccueil: coAccueil, accueillante: this.accueillante})
    return { coAccueil: coAccueil, accueillante: this.accueillante}
  }


}
