// deno run --allow-net --allow-env --allow-read scripts/seed.ts

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types.ts';
import type {
  CocktailCategory,
  Glassware,
  IngredientType,
} from '../types/index.ts';
import { createSlug } from '../tools/index.ts';

const isDryRun = Deno.args.includes('--dry-run');

console.log(
  isDryRun
    ? '🔍 DRY RUN MODE: No database changes will be made'
    : '💾 LIVE MODE: Database changes will be executed'
);

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
      const cocktailSlug = createSlug(cocktail.name);

      const { data: existingCocktail } = await supabase
        .from('cocktails')
        .select('id')
        .eq('slug', cocktailSlug)
        .maybeSingle();

      let cocktailId: number;

      if (existingCocktail) {
        console.log(
          `Cocktail "${cocktail.name}" (slug: ${cocktailSlug}) already exists, updating...`
        );
        cocktailId = existingCocktail.id;

        // update cocktail but not the slug
        await dbOperation('update', `cocktail "${cocktail.name}"`, async () => {
          return await supabase
            .from('cocktails')
            .update({
              name: cocktail.name,
              description: cocktail.description,
              garnish: cocktail.garnish,
              glass: cocktail.glass as Glassware,
              category: cocktail.category as CocktailCategory,
              updated_at: new Date().toISOString(),
            })
            .eq('id', cocktailId);
        });

        if (isDryRun) cocktailId = 9999; // fake id for dry run
      } else {
        console.log(`Adding new cocktail: ${cocktail.name}`);

        const insertResult = await dbOperation(
          'insert',
          `cocktail: "${cocktail.name}"`,
          async () => {
            const { data, error } = await supabase
              .from('cocktails')
              .insert({
                name: cocktail.name,
                slug: cocktailSlug,
                description: cocktail.description,
                garnish: cocktail.garnish,
                glass: cocktail.glass as Glassware,
                category: cocktail.category as CocktailCategory,
              })
              .select();

            if (error) throw error;
            return data;
          }
        );

        if (!isDryRun && insertResult) {
          cocktailId = insertResult[0].id;
        } else {
          cocktailId = 9999;
        }
      }

      // Delete existing recipes if updating
      if (existingCocktail) {
        await dbOperation(
          'delete',
          `existing recipe steps for cocktail "${cocktail.name}"`,
          async () => {
            return await supabase
              .from('recipes')
              .delete()
              .eq('cocktail_id', cocktailId);
          }
        );
      }

      // add recipe steps
      for (let i = 0; i < cocktail.recipe_steps.length; i++) {
        await dbOperation(
          'insert',
          `recipe step ${i + 1} for cocktail "${cocktail.name}"`,
          async () => {
            return await supabase.from('recipes').insert({
              cocktail_id: cocktailId,
              step_number: i + 1,
              instruction: cocktail.recipe_steps[i],
            });
          }
        );
      }

      // Process ingredients
      for (const ingredient of cocktail.ingredients) {
        const ingredientSlug = createSlug(ingredient.name);

        // check if ingredient exists
        const { data: existingIngredient } = await supabase
          .from('ingredients')
          .select('id')
          .eq('slug', ingredientSlug)
          .maybeSingle();

        let ingredientId: number;

        if (existingIngredient) {
          ingredientId = existingIngredient.id;
          console.log(
            `Using existing ingredient: ${ingredient.name} (slug: ${ingredientSlug})`
          );
        } else {
          // add new ingredient
          const insertResult = await dbOperation(
            'insert',
            `ingredient "${ingredient.name}"`,
            async () => {
              const { data, error } = await supabase
                .from('ingredients')
                .insert({
                  slug: ingredientSlug,
                  name: ingredient.name,
                  type: ingredient.type as IngredientType,
                  description: '',
                  allergens: '',
                })
                .select();

              if (error) throw error;
              return data;
            }
          );

          if (!isDryRun && insertResult) {
            ingredientId = insertResult[0].id;
          } else {
            ingredientId = 9999;
          }

          console.log(
            `Added new ingredient: ${ingredient.name} (slug: ${ingredientSlug})`
          );
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

          const insertResult = await dbOperation(
            'insert',
            `unit: "${ingredient.unit}"`,
            async () => {
              const { data, error } = await supabase
                .from('units')
                .insert({
                  name: ingredient.unit,
                  abbreviation,
                })
                .select();

              if (error) throw error;
              return data;
            }
          );

          if (!isDryRun && insertResult) {
            unitId = insertResult[0].id;
          } else {
            unitId = 9999;
          }
        }

        // check if cocktail ingredient already exists
        const { data: existingCocktailIngredient } = !isDryRun
          ? await supabase
              .from('cocktail_ingredients')
              .select('id')
              .eq('cocktail_id', cocktailId)
              .eq('ingredient_id', ingredientId)
              .maybeSingle()
          : { data: null };

        if (existingCocktailIngredient) {
          await dbOperation(
            'update',
            `cocktail ingredient relation for "${cocktail.name}" and "${ingredient.name}"`,
            async () => {
              return await supabase
                .from('cocktail_ingredients')
                .update({ quantity: ingredient.quantity, unit: unitId })
                .eq('id', existingCocktailIngredient.id);
            }
          );
        } else {
          await dbOperation(
            'insert',
            `cocktail ingredient relation for "${cocktail.name}" and "${ingredient.name}"`,
            async () => {
              return await supabase.from('cocktail_ingredients').insert({
                cocktail_id: cocktailId,
                ingredient_id: ingredientId,
                quantity: ingredient.quantity,
                unit: unitId,
              });
            }
          );
        }

        console.log(
          `Successfully processed cocktail ingredient for ${cocktail.name}: ${ingredient.name} / ${ingredient.quantity} ${ingredient.unit}`
        );
      }

      // Process flavor profiles
      for (const flavor of cocktail.flavor_profiles) {
        const flavorSlug = createSlug(flavor.name);

        const { data: existingFlavor } = await supabase
          .from('flavor_profiles')
          .select('id')
          .eq('slug', flavorSlug)
          .maybeSingle();

        let flavorId: number;

        if (existingFlavor) {
          flavorId = existingFlavor.id;
        } else {
          const insertResult = await dbOperation(
            'insert',
            `flavor profile "${flavor.name}"`,
            async () => {
              const { data, error } = await supabase
                .from('flavor_profiles')
                .insert({
                  slug: flavorSlug,
                  name: flavor.name,
                  description:
                    flavorProfileDescriptions[flavor.name.toLowerCase()] ?? '',
                })
                .select();

              if (error) throw error;
              return data;
            }
          );

          if (!isDryRun && insertResult) {
            flavorId = insertResult[0].id;
          } else {
            flavorId = 9999;
          }
        }

        // check if cocktial flavor profile already exists
        const { data: existingCocktailFlavor } = !isDryRun
          ? await supabase
              .from('cocktail_flavor_profiles')
              .select('id')
              .eq('cocktail_id', cocktailId)
              .eq('flavor_profile_id', flavorId)
              .maybeSingle()
          : { data: null };

        if (existingCocktailFlavor) {
          // update cocktail flavor profile
          await dbOperation(
            'update',
            `cocktail flavor profile relation for "${cocktail.name}" and "${flavor.name}"`,
            async () => {
              return await supabase
                .from('cocktail_flavor_profiles')
                .update({
                  intensity: flavor.intensity || 3,
                })
                .eq('id', existingCocktailFlavor.id);
            }
          );
        } else {
          await dbOperation(
            'insert',
            `cocktail flavor profile relation for "${cocktail.name}" and "${flavor.name}"`,
            async () => {
              return await supabase.from('cocktail_flavor_profiles').insert({
                cocktail_id: cocktailId,
                flavor_profile_id: flavorId,
                intensity: flavor.intensity || 3,
              });
            }
          );
        }

        console.log(
          `Finished processing cocktail: ${cocktail.name} (slug: ${cocktailSlug})`
        );
      }

      console.log(
        isDryRun
          ? '🔍 DRY RUN COMPLETED: No changes were made to the database'
          : '💾 LIVE RUN COMPLETED: All changes were applied to the database'
      );
    }
  } catch (error) {
    console.error('Error adding cocktails:', error);
  }
}

async function dbOperation<T>(
  operationName: string,
  entity: string,
  queryFn: () => Promise<T>
): Promise<T | null> {
  if (isDryRun) {
    console.log(`[DRY RUN] Would ${operationName} ${entity}`);
    return null;
  }

  try {
    return await queryFn();
  } catch (error) {
    console.error(`Error ${operationName} ${entity}: `, error);
    throw error;
  }
}

seedDatabase();
