import {CoAccueil} from "./local-coaccs.service";

export var db :CoAccueil[] =
  [
    {
      "id": "1",
      "ac1": "Karine",
      "ac2": "Sophie",
      "titulaire1": true,
      "titulaire2": true,
      "sae": "Marmotine",
      "start": new Date("2020-01-01T00:00:00.001Z"),
      "address": "Rue du paradis, 42 NAMUR",
      "end": new Date("2020-01-31T04:00:00.000Z")
    },
    {
      "id": "2",
      "ac1": "Kathy",
      "ac2": "Jeanne",
      "start": new Date("2020-01-01T00:00:00.000Z"),
      "address": "Rue des enfers, 666 BRUXELLES",
      "sae": "SAC Miguel",
      "titulaire1": true,
      "titulaire2": true,
      "end": new Date("2020-01-31T04:00:00.000Z")
    }
  ];

export const seq = {
    "nextId": 3
  };
