import { Routes } from '@angular/router';
import {AccueillanteComponent} from "./components/accueillantes/accueillante.component";
import {inject} from "@angular/core";
import {LocalCoaccsService} from "./services/local-coaccs.service";
import {db} from "./services/db";

export const routes: Routes = [
  {
    path: "",
    resolve: {
      db : () => inject(LocalCoaccsService).init(db)
    },
    children: [
      {
        path: "accueillante/:accueillante",
        component: AccueillanteComponent
      }
    ]
  },

];
