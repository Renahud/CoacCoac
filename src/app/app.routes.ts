import { Routes } from '@angular/router';
import {AccueillanteComponent} from "./components/accueillantes/accueillante.component";

export const routes: Routes = [
  {
    path: "accueillante/:accueillante",
    component: AccueillanteComponent
  }
];
