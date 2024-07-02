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
    },
    {
      "id": "3",
      "ac1": "Kathy",
      "ac2": "Adèle",
      "start": new Date("2020-02-01T00:00:00.000Z"),
      "address": "Rue des enfers, 666 BRUXELLES",
      "sae": "SAC Miguel",
      "previousId": "2",
      "titulaire1": true,
      "titulaire2": false,
      "end": new Date("2020-02-29T04:00:00.000Z")
    },
    {
      "id": "4",
      "ac1": "Karine",
      "ac2": "Carla",
      "start": new Date("2020-02-01T00:00:00.000Z"),
      "address": "Rue du paradis, 42 NAMUR",
      "sae": "Marmotine",
      "previousId": "1",
      "titulaire1": true,
      "titulaire2": false,
      "end": new Date("2020-03-31T04:00:00.000Z")
    },
    {
      "id": "5",
      "ac1": "Kathy",
      "ac2": "Jeanne",
      "start": new Date("2020-03-01T00:00:00.000Z"),
      "address": "Rue des enfers, 666 BRUXELLES",
      "sae": "SAC Miguel",
      "previousId": "3",
      "titulaire1": true,
      "titulaire2": true,
      "end": new Date("2020-03-31T04:00:00.000Z")
    },
    {
      "id": "6",
      "ac1": "Karine",
      "ac2": "Marcelle",
      "start": new Date("2020-04-01T00:00:00.000Z"),
      "address": "Rue du paradis, 42 NAMUR",
      "sae": "Marmotine",
      "previousId": "4",
      "titulaire1": true,
      "titulaire2": false,
      "end": new Date("2020-04-30T04:00:00.000Z")
    },
    {
      "id": "7",
      "ac1": "Carla",
      "ac2": "Jeanne",
      "start": new Date("2020-04-01T00:00:00.000Z"),
      "address": "Rue des enfers, 666 BRUXELLES",
      "sae": "SAC Miguel",
      "previousId": "5",
      "titulaire1": false,
      "titulaire2": true
    },
    {
      "id": "8",
      "ac1": "Géraldine",
      "ac2": "Marcelle",
      "start": new Date("2020-05-01T00:00:00.000Z"),
      "address": "Rue du paradis, 42 NAMUR",
      "previousId": "6",
      "titulaire1": false,
      "titulaire2": false,
      "sae": "Marmotine",
      "end": new Date("2020-05-31T04:00:00.000Z")
    },
    {
      "id": "9",
      "ac1": "Géraldine",
      "ac2": "Marcelle",
      "start": new Date("2020-06-01T00:00:00.000Z"),
      "address": "Rue du paradis, 42 NAMUR",
      "previousId": "8",
      "titulaire1": true,
      "titulaire2": false,
      "sae": "Marmotine"
    }
  ];

export const seq = {
    "nextId": 10
  };
