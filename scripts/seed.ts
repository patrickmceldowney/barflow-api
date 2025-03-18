// deno run --allow-net --allow-env --allow-read scripts/seed.ts

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types.ts';
import type {
  CocktailCategory,
  Glassware,
  IngredientType,
} from '../types/index.ts';

const supabase = createClient<Database>(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SECRET_KEY') || ''
);

const newCocktails = [
  {
    name: 'Mojito',
    description: 'A refreshing cuban highball',
    garnish: 'Mint sprig, lime wheel',
    glass: 'collins',
    category: 'collins',
    recipe_steps: [
      'Muddle mint leaves with sugar and lime juice',
      'Add splash of soda water',
      'Fill glass with ice',
      'Pour rum',
      'Top with soda water',
      'Garnish with mint sprig and lime wheel',
    ],
    ingredients: [
      { name: 'White rum', quantity: 2, unit: 'oz', type: 'spirit' },
      { name: 'Fresh lime juice', quantity: 0.75, unit: 'oz', type: 'juice' },
      { name: 'Simple Syrup', quantity: 0.5, unit: 'oz', type: 'syrup' },
      { name: 'Mint leaves', quantity: 6, unit: 'count', type: 'garnish' },
      { name: 'Soda water', quantity: 2, unit: 'oz', type: 'mixer' },
    ],
    flavor_profiles: [
      { name: 'Sweet', intensity: 2 },
      { name: 'Sour', intensity: 3 },
      { name: 'Herbal', intensity: 4 },
    ],
  },
];

// Define flavor profiles to add
const flavorProfileDescriptions: { [key: string]: string } = {
  sweet: 'Sugary taste, often from syrups, liqueurs or fruit juices',
  sour: 'Tart or acidic taste, often from citrus or other fruits',
  bitter:
    'Sharp, sometimes unpleasant taste, often from ingredients like bitters or certain herbs',
  herbal: 'Plant-like taste, often from herbs like mint, basil, or rosemary',
  spicy: 'Hot or peppery taste, often from ingredients like ginger or chili',
  fruity:
    'Taste reminiscent of fruits, often from fruit juices or fruit-flavored liqueurs',
  smoky:
    'Taste reminiscent of smoke, often from ingredients like mezcal or scotch',
  floral: 'Flowery taste, often from ingredients like elderflower or lavender',
  creamy: 'Smooth, dairy-like taste, often from ingredients like cream or milk',
  nutty:
    'Taste reminiscent of nuts, often from ingredients like orgeat or amaretto',
};

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    for (const cocktail of newCocktails) {
      const { data: existingCocktail } = await supabase
        .from('cocktails')
        .select('id')
        .eq('name', cocktail.name)
        .maybeSingle();

      let cocktailId: number;

      if (existingCocktail) {
        console.log(`Cocktail "${cocktail.name}" already exists, updating...`);
        cocktailId = existingCocktail.id;

        // update cocktail
        await supabase
          .from('cocktails')
          .update({
            description: cocktail.description,
            garnish: cocktail.garnish,
            glass: cocktail.glass as Glassware,
            category: cocktail.category as CocktailCategory,
            updated_at: new Date().toISOString(),
          })
          .eq('id', cocktailId);
      } else {
        console.log(`Adding new cocktail: ${cocktail.name}`);

        const { data: newCocktail, error: cocktailError } = await supabase
          .from('cocktails')
          .insert({
            name: cocktail.name,
            description: cocktail.description,
            garnish: cocktail.garnish,
            glass: cocktail.glass as Glassware,
            category: cocktail.category as CocktailCategory,
          })
          .select();

        if (cocktailError) {
          console.error(
            `Error adding cocktail ${cocktail.name}:`,
            cocktailError
          );
          continue;
        }

        cocktailId = newCocktail[0].id;
      }

      // Delete existing recipes if updating
      if (existingCocktail) {
        await supabase.from('recipes').delete().eq('cocktail_id', cocktailId);
      }

      // add recipe steps
      for (let i = 0; i < cocktail.recipe_steps.length; i++) {
        await supabase.from('recipes').insert({
          cocktail_id: cocktailId,
          step_number: i + 1,
          instruction: cocktail.recipe_steps[i],
        });
      }

      // Process ingredients
      for (const ingredient of cocktail.ingredients) {
        // check if ingredient exists
        const { data: existingIngredient } = await supabase
          .from('ingredients')
          .select('id')
          .eq('name', ingredient.name)
          .maybeSingle();

        let ingredientId: number;

        if (existingIngredient) {
          ingredientId = existingIngredient.id;
        } else {
          // add new ingredient
          const { data: newIngredient, error: ingredientError } = await supabase
            .from('ingredients')
            .insert({
              name: ingredient.name,
              type: ingredient.type as IngredientType,
              description: '',
              allergens: '',
            })
            .select();

          if (ingredientError) {
            console.error(
              `Error adding ingredient ${ingredient.name}:`,
              ingredientError
            );
            continue;
          }

          ingredientId = newIngredient[0].id;
        }

        // Check if unit exists
        const { data: existingUnit } = await supabase
          .from('units')
          .select('id')
          .eq('name', ingredient.unit)
          .maybeSingle();

        let unitId: number;

        if (existingUnit) {
          unitId = existingUnit.id;
        } else {
          let abbreviation = ingredient.unit;
          // Create abbreviations for common units
          if (ingredient.unit === 'ounce' || ingredient.unit === 'oz')
            abbreviation = 'oz';
          if (ingredient.unit === 'teaspoon' || ingredient.unit === 'tsp')
            abbreviation = 'tsp';
          if (ingredient.unit === 'tablespoon' || ingredient.unit === 'tbsp')
            abbreviation = 'tbsp';

          const { data: newUnit, error: unitError } = await supabase
            .from('units')
            .insert({
              name: ingredient.unit,
              abbreviation,
            })
            .select();

          if (unitError) {
            console.error(`Error adding unit ${ingredient.unit}:`, unitError);
            continue;
          }

          unitId = newUnit[0].id;
        }

        // check if cocktail ingredient already exists
        const { data: existingCocktailIngredient } = await supabase
          .from('cocktail_ingredients')
          .select('id')
          .eq('cocktail_id', cocktailId)
          .eq('ingredient_id', ingredientId)
          .maybeSingle();

        if (existingCocktailIngredient) {
          await supabase
            .from('cocktail_ingredients')
            .update({ quantity: ingredient.quantity, unit: unitId })
            .eq('id', existingCocktailIngredient.id);
        } else {
          await supabase.from('cocktail_ingredients').insert({
            cocktail_id: cocktailId,
            ingredient_id: ingredientId,
            quantity: ingredient.quantity,
            unit: unitId,
          });
        }

        console.log(`Successfully processed cocktail: ${cocktail.name}`);
      }

      // Process flavor profiles
      for (const flavor of cocktail.flavor_profiles) {
        const { data: existingFlavor } = await supabase
          .from('flavor_profiles')
          .select('id')
          .eq('name', flavor.name)
          .maybeSingle();

        let flavorId: number;

        if (existingFlavor) {
          flavorId = existingFlavor.id;
        } else {
          const { data: newFlavor, error: flavorError } = await supabase
            .from('flavor_profiles')
            .insert({
              name: flavor.name,
              description:
                flavorProfileDescriptions[flavor.name.toLowerCase()] ?? '',
            })
            .select();

          if (flavorError) {
            console.error(
              `Error adding flavor profile ${flavor.name}:`,
              flavorError
            );
            continue;
          }

          flavorId = newFlavor[0].id;
        }

        // check if cocktial flavor profile already exists
        const { data: existingCocktailFlavor } = await supabase
          .from('cocktail_flavor_profiles')
          .select('id')
          .eq('cocktail_id', cocktailId)
          .eq('flavor_profile_id', flavorId)
          .maybeSingle();

        if (existingCocktailFlavor) {
          // update cocktail flavor profile
          await supabase
            .from('cocktail_flavor_profiles')
            .update({
              intensity: flavor.intensity || 3,
            })
            .eq('id', existingCocktailFlavor.id);
        } else {
          // add cocktail flavor profile
          await supabase.from('cocktail_flavor_profiles').insert({
            cocktail_id: cocktailId,
            flavor_profile_id: flavorId,
            intensity: flavor.intensity || 3,
          });
        }
      }

      console.log('All cocktail processed...');
    }
  } catch (error) {
    console.error('Error adding cocktails:', error);
  }
}
