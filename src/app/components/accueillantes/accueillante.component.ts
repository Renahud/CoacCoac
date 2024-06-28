import {Component, inject, OnInit} from "@angular/core";
import {CoaccsService, CoAccueil} from "../../services/coaccs.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, DatePipe} from "@angular/common";
import {map} from "rxjs";

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
            <div>avec <a [routerLink]="['..', otherAccueillante(coaccueil).ac]">{{ otherAccueillante(coaccueil).ac }} ({{otherAccueillante(coaccueil).titulaire? "T" : "R"}})</a> depuis {{ coaccueil.start | date }}
              @if (coaccueil.end){
                jusqu'à {{ coaccueil.end | date}}
              }
              @if (coaccueil.previousId && !getAccueillante(coaccueil).titulaire){
                (remplace <a [routerLink]="['..', replacedAccueillante(coaccueil)]">{{replacedAccueillante(coaccueil) }}</a>)
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
    RouterLink,
    AsyncPipe
  ]
})
export class AccueillanteComponent implements OnInit{

  service = inject(CoaccsService);
  route  = inject(ActivatedRoute);
  accueillante?: string;
  router = inject(Router)

  formGroup = new FormGroup({
    temporary : new FormControl<boolean>(true),
    oldAc : new FormControl<string|undefined>(undefined, {validators: Validators.required}),
    newAc : new FormControl<string|undefined>(undefined, {validators: Validators.required}),
    startDate: new FormControl<Date | undefined>(undefined, {validators: Validators.required}),
  })
  coaccs : CoAccueil[]  = []
  previousCoaccueils  = new Map<string,CoAccueil>

  place!: string;
  current?: CoAccueil;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accueillante = params["accueillante"] ;
      if(this.accueillante){
        this.service.getByAccueillante(this.accueillante).subscribe(res => {
          this.coaccs = res;
          this.current = this.coaccs[this.coaccs.length -1]
          this.place = this.accueillante === this.current.ac1 ? "1" : "2";
          this.coaccs
            .filter(c => !!c.previousId)
            .forEach(coAccueil => {
            this.service.getById(coAccueil.previousId!).subscribe( previous => {
              this.previousCoaccueils.set(previous.id, previous)
            })
          })
        });
      }
    })

  }

  otherAccueillante(coaccueil: CoAccueil) {
    const otherPlace = this.place === "1" ? "2" : "1"
    return {
      ac : (coaccueil as any)[`ac${otherPlace}`] as string,
      titulaire:  (coaccueil as any)[`titulaire${otherPlace}`] as boolean
    }
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

  getAccueillante(coAccueil: CoAccueil){
    return {
      ac : (coAccueil as any)[`ac${this.place}`] as string,
      titulaire:  (coAccueil as any)[`titulaire${this.place}`] as boolean
    }
  }

  replacedAccueillante(coaccueil: CoAccueil) {
    let previous = this.previousCoaccueils.get(coaccueil.previousId!);
    if(previous){
      return this.getAccueillante(previous).ac
    }
    return "";
  }
}
