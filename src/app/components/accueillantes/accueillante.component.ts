import {Component, inject, OnInit} from "@angular/core";
import {CoaccsService, CoAccueil} from "../../services/coaccs.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";

@Component({
  selector: "app-accueillante",
  standalone: true,
  template: `
    <div class = "accueillante">
        <h1> Co-accueils de {{ accueillante }}</h1>
      @if (coaccs.length === 0) {
        Pas de Coaccueil
      } @else {
        <div>
          @for (coaccueil of coaccs; track coaccueil.id) {
            <div>avec <a [routerLink]="['..', otherAccueillante(coaccueil)]">{{ otherAccueillante(coaccueil) }}</a> depuis {{ coaccueil.start | date }}
              @if (coaccueil.end){
                jusqu'à {{ coaccueil.end | date}}
              }
            </div>
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
      width: 50%;
      background-color: aliceblue;
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
    RouterLink
  ]
})
export class AccueillanteComponent implements OnInit{

    service = inject(CoaccsService);
    route  = inject(ActivatedRoute);
    accueillante?: string;

  formGroup = new FormGroup({
    temporary : new FormControl<boolean>(true),
    oldAc : new FormControl<string|undefined>(undefined, {validators: Validators.required}),
    newAc : new FormControl<string|undefined>(undefined, {validators: Validators.required}),
    startDate: new FormControl<Date | undefined>(undefined, {validators: Validators.required}),
  })


  coaccs : CoAccueil[]  = []
    ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.accueillante = params["accueillante"] ;
        if(this.accueillante){
          this.service.getByAccueillante(this.accueillante).subscribe(res => this.coaccs = res);
        }
      })

    }

  otherAccueillante(coaccueil: CoAccueil) {
    return this.accueillante === coaccueil.ac1 ? coaccueil.ac2 : coaccueil.ac1;
  }

  addRemplacement() {
    let value = this.formGroup.getRawValue();
    const current = this.coaccs[this.coaccs.length -1]

    this.service.nextSeq().subscribe(newId => {
      this.service.saveCoaccueil({
        id: String(newId),
        ac1: current.ac1 === value.oldAc ? value.newAc! : current.ac1! ,
        ac2: current.ac2 === value.oldAc ? value.newAc! : current.ac2!,
        start: new Date(value.startDate!),
        address: current.address,
        previousId: String(current.id),
        titulaire1: current.ac1 === value.oldAc ? !value.temporary: current.titulaire1 ,
        titulaire2: current.ac2 === value.oldAc ? !value.temporary: current.titulaire2
      }).subscribe( res => {

      });

    })
  }
}
