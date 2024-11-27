import type { Database } from '../tools/db.ts';

export interface AppState {
  db: Database;
}

export interface Cocktail {
  id: number;
  name: string;
  description?: string;
  garnish: string;
  glass: Glass;
  category: CocktailCategory;
  ingredients: CocktailIngredient[];
  recipe_steps: RecipeStep[];
}

export interface CocktailIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
}

export interface RecipeStep {
  step_number: number;
  instruction: string;
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
