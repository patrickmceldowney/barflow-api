import type { DatabaseClient } from '../tools/db.ts';

export interface AppState {
  db: DatabaseClient;
}

export enum Unit {
  dash,
  ounce,
  milliliter,
  teaspoon,
  tablespoon,
  cup,
  part,
}

export enum Glass {
  wine,
  martini,
  rocks,
  coupe,
  highball,
  collins,
  shot,
  tiki_mug,
  copper_mug,
  margarita,
  beer_mug,
  pint,
  hurricane,
  snifter,
  julep,
  glencairn,
  punch_bowl,
  irish_coffee,
  coupe_martini,
}
export enum CocktailCategory {
  'spirit-forward',
  sour,
  tiki,
  fizz,
  smash,
  collins,
  blended,
  digestif,
  apertif,
  shooter,
  mocktail,
}

export enum IngredientType {
  spirit,
  liqueur,
  juice,
  mixer,
  bitter,
  garnish,
  ice,
  syrup,
  vermouth,
  fortified_wine,
  special,
}
