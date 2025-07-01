export type Unit =
  | 'dash'
  | 'ounce'
  | 'milliliter'
  | 'teaspoon'
  | 'tablespoon'
  | 'cup'
  | 'part';

export type Glassware =
  | 'wine'
  | 'martini'
  | 'rocks'
  | 'coupe'
  | 'highball'
  | 'collins'
  | 'shot'
  | 'tiki_mug'
  | 'copper_mug'
  | 'margarita'
  | 'beer_mug'
  | 'pint'
  | 'hurricane'
  | 'snifter'
  | 'julep'
  | 'glencairn'
  | 'punch_bowl'
  | 'irish_coffee'
  | 'coupe_martini';

export type CocktailCategory =
  | 'spirit-forward'
  | 'sour'
  | 'tiki'
  | 'fizz'
  | 'smash'
  | 'collins'
  | 'blended'
  | 'digestif'
  | 'apertif'
  | 'shooter'
  | 'mocktail';

export type IngredientType =
  | 'spirit'
  | 'liqueur'
  | 'juice'
  | 'mixer'
  | 'bitter'
  | 'garnish'
  | 'ice'
  | 'syrup'
  | 'vermouth'
  | 'fortified_wine'
  | 'special';

export interface Cocktail {
  id?: number;
  category: CocktailCategory;
  description: string;
  garnish: string | null;
  glass: Glassware;
  ingredients: Ingredient[];
  name: string;
  recipe_steps: string[];
  flavor_profiles: FlavorProfile[];
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface FlavorProfile {
  name: string;
  description?: string;
  intensity: number;
}
