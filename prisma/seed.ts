import { PrismaClient } from '@prisma/client';
import { createSlug } from '../tools/index';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create units
  const units = await Promise.all([
    prisma.unit.upsert({
      where: { name: 'ounce' },
      update: {},
      create: { name: 'ounce', abbreviation: 'oz' },
    }),
    prisma.unit.upsert({
      where: { name: 'teaspoon' },
      update: {},
      create: { name: 'teaspoon', abbreviation: 'tsp' },
    }),
    prisma.unit.upsert({
      where: { name: 'tablespoon' },
      update: {},
      create: { name: 'tablespoon', abbreviation: 'tbsp' },
    }),
    prisma.unit.upsert({
      where: { name: 'dash' },
      update: {},
      create: { name: 'dash', abbreviation: 'dash' },
    }),
    prisma.unit.upsert({
      where: { name: 'count' },
      update: {},
      create: { name: 'count', abbreviation: 'count' },
    }),
  ]);

  console.log('✅ Units created');

  // Create flavor profiles
  const flavorProfiles = await Promise.all([
    prisma.flavorProfile.upsert({
      where: { slug: 'sweet' },
      update: {},
      create: {
        name: 'Sweet',
        slug: 'sweet',
        description:
          'Sugary taste, often from syrups, liqueurs or fruit juices',
      },
    }),
    prisma.flavorProfile.upsert({
      where: { slug: 'sour' },
      update: {},
      create: {
        name: 'Sour',
        slug: 'sour',
        description: 'Tart or acidic taste, often from citrus or other fruits',
      },
    }),
    prisma.flavorProfile.upsert({
      where: { slug: 'bitter' },
      update: {},
      create: {
        name: 'Bitter',
        slug: 'bitter',
        description:
          'Sharp, sometimes unpleasant taste, often from ingredients like bitters or certain herbs',
      },
    }),
    prisma.flavorProfile.upsert({
      where: { slug: 'herbal' },
      update: {},
      create: {
        name: 'Herbal',
        slug: 'herbal',
        description:
          'Plant-like taste, often from herbs like mint, basil, or rosemary',
      },
    }),
    prisma.flavorProfile.upsert({
      where: { slug: 'fruity' },
      update: {},
      create: {
        name: 'Fruity',
        slug: 'fruity',
        description:
          'Taste reminiscent of fruits, often from fruit juices or fruit-flavored liqueurs',
      },
    }),
  ]);

  console.log('✅ Flavor profiles created');

  // Create ingredients
  const ingredients = await Promise.all([
    prisma.ingredient.upsert({
      where: { slug: 'gin' },
      update: {},
      create: {
        name: 'Gin',
        slug: 'gin',
        type: 'spirit',
        description:
          'A distilled alcoholic drink that derives its predominant flavour from juniper berries',
      },
    }),
    prisma.ingredient.upsert({
      where: { slug: 'lime-juice' },
      update: {},
      create: {
        name: 'Lime Juice',
        slug: 'lime-juice',
        type: 'juice',
        description: 'Fresh squeezed lime juice',
      },
    }),
    prisma.ingredient.upsert({
      where: { slug: 'simple-syrup' },
      update: {},
      create: {
        name: 'Simple Syrup',
        slug: 'simple-syrup',
        type: 'syrup',
        description:
          'Equal parts sugar and water, heated until sugar dissolves',
      },
    }),
    prisma.ingredient.upsert({
      where: { slug: 'mint-leaves' },
      update: {},
      create: {
        name: 'Mint Leaves',
        slug: 'mint-leaves',
        type: 'garnish',
        description: 'Fresh mint leaves for muddling and garnish',
      },
    }),
    prisma.ingredient.upsert({
      where: { slug: 'rum' },
      update: {},
      create: {
        name: 'White Rum',
        slug: 'rum',
        type: 'spirit',
        description: 'Light, clear rum with a mild flavor',
      },
    }),
    prisma.ingredient.upsert({
      where: { slug: 'tonic-water' },
      update: {},
      create: {
        name: 'Tonic Water',
        slug: 'tonic-water',
        type: 'mixer',
        description: 'Carbonated water with quinine and sweeteners',
      },
    }),
  ]);

  console.log('✅ Ingredients created');

  // Create cocktails
  const ginTonic = await prisma.cocktail.upsert({
    where: { slug: 'gin-tonic' },
    update: {},
    create: {
      name: 'Gin & Tonic',
      slug: 'gin-tonic',
      description: 'A classic refreshing cocktail perfect for any occasion',
      garnish: 'Lime wheel',
      glass: 'highball',
      category: 'collins',
      difficulty: 'beginner',
    },
  });

  const mojito = await prisma.cocktail.upsert({
    where: { slug: 'mojito' },
    update: {},
    create: {
      name: 'Mojito',
      slug: 'mojito',
      description: 'A refreshing Cuban highball cocktail',
      garnish: 'Mint sprig, lime wheel',
      glass: 'collins',
      category: 'collins',
      difficulty: 'beginner',
    },
  });

  console.log('✅ Cocktails created');

  // Add ingredients to Gin & Tonic
  await Promise.all([
    prisma.cocktailIngredient.upsert({
      where: {
        cocktailId_ingredientId: {
          cocktailId: ginTonic.id,
          ingredientId: ingredients.find(i => i.slug === 'gin')!.id,
        },
      },
      update: {},
      create: {
        cocktailId: ginTonic.id,
        ingredientId: ingredients.find(i => i.slug === 'gin')!.id,
        quantity: 2,
        unitId: units.find(u => u.name === 'ounce')!.id,
      },
    }),
    prisma.cocktailIngredient.upsert({
      where: {
        cocktailId_ingredientId: {
          cocktailId: ginTonic.id,
          ingredientId: ingredients.find(i => i.slug === 'tonic-water')!.id,
        },
      },
      update: {},
      create: {
        cocktailId: ginTonic.id,
        ingredientId: ingredients.find(i => i.slug === 'tonic-water')!.id,
        quantity: 4,
        unitId: units.find(u => u.name === 'ounce')!.id,
      },
    }),
  ]);

  // Add ingredients to Mojito
  await Promise.all([
    prisma.cocktailIngredient.upsert({
      where: {
        cocktailId_ingredientId: {
          cocktailId: mojito.id,
          ingredientId: ingredients.find(i => i.slug === 'rum')!.id,
        },
      },
      update: {},
      create: {
        cocktailId: mojito.id,
        ingredientId: ingredients.find(i => i.slug === 'rum')!.id,
        quantity: 2,
        unitId: units.find(u => u.name === 'ounce')!.id,
      },
    }),
    prisma.cocktailIngredient.upsert({
      where: {
        cocktailId_ingredientId: {
          cocktailId: mojito.id,
          ingredientId: ingredients.find(i => i.slug === 'lime-juice')!.id,
        },
      },
      update: {},
      create: {
        cocktailId: mojito.id,
        ingredientId: ingredients.find(i => i.slug === 'lime-juice')!.id,
        quantity: 0.75,
        unitId: units.find(u => u.name === 'ounce')!.id,
      },
    }),
    prisma.cocktailIngredient.upsert({
      where: {
        cocktailId_ingredientId: {
          cocktailId: mojito.id,
          ingredientId: ingredients.find(i => i.slug === 'simple-syrup')!.id,
        },
      },
      update: {},
      create: {
        cocktailId: mojito.id,
        ingredientId: ingredients.find(i => i.slug === 'simple-syrup')!.id,
        quantity: 0.5,
        unitId: units.find(u => u.name === 'ounce')!.id,
      },
    }),
    prisma.cocktailIngredient.upsert({
      where: {
        cocktailId_ingredientId: {
          cocktailId: mojito.id,
          ingredientId: ingredients.find(i => i.slug === 'mint-leaves')!.id,
        },
      },
      update: {},
      create: {
        cocktailId: mojito.id,
        ingredientId: ingredients.find(i => i.slug === 'mint-leaves')!.id,
        quantity: 6,
        unitId: units.find(u => u.name === 'count')!.id,
      },
    }),
  ]);

  console.log('✅ Cocktail ingredients created');

  // Add recipe steps
  await Promise.all([
    // Gin & Tonic steps
    prisma.recipeStep.upsert({
      where: {
        cocktailId_stepNumber: {
          cocktailId: ginTonic.id,
          stepNumber: 1,
        },
      },
      update: {},
      create: {
        cocktailId: ginTonic.id,
        stepNumber: 1,
        instruction: 'Fill a highball glass with ice cubes',
      },
    }),
    prisma.recipeStep.upsert({
      where: {
        cocktailId_stepNumber: {
          cocktailId: ginTonic.id,
          stepNumber: 2,
        },
      },
      update: {},
      create: {
        cocktailId: ginTonic.id,
        stepNumber: 2,
        instruction: 'Pour gin over the ice',
      },
    }),
    prisma.recipeStep.upsert({
      where: {
        cocktailId_stepNumber: {
          cocktailId: ginTonic.id,
          stepNumber: 3,
        },
      },
      update: {},
      create: {
        cocktailId: ginTonic.id,
        stepNumber: 3,
        instruction: 'Top with tonic water and stir gently',
      },
    }),
    prisma.recipeStep.upsert({
      where: {
        cocktailId_stepNumber: {
          cocktailId: ginTonic.id,
          stepNumber: 4,
        },
      },
      update: {},
      create: {
        cocktailId: ginTonic.id,
        stepNumber: 4,
        instruction: 'Garnish with a lime wheel',
      },
    }),

    // Mojito steps
    prisma.recipeStep.upsert({
      where: {
        cocktailId_stepNumber: {
          cocktailId: mojito.id,
          stepNumber: 1,
        },
      },
      update: {},
      create: {
        cocktailId: mojito.id,
        stepNumber: 1,
        instruction:
          'Muddle mint leaves with sugar and lime juice in a collins glass',
      },
    }),
    prisma.recipeStep.upsert({
      where: {
        cocktailId_stepNumber: {
          cocktailId: mojito.id,
          stepNumber: 2,
        },
      },
      update: {},
      create: {
        cocktailId: mojito.id,
        stepNumber: 2,
        instruction: 'Add splash of soda water',
      },
    }),
    prisma.recipeStep.upsert({
      where: {
        cocktailId_stepNumber: {
          cocktailId: mojito.id,
          stepNumber: 3,
        },
      },
      update: {},
      create: {
        cocktailId: mojito.id,
        stepNumber: 3,
        instruction: 'Fill glass with ice',
      },
    }),
    prisma.recipeStep.upsert({
      where: {
        cocktailId_stepNumber: {
          cocktailId: mojito.id,
          stepNumber: 4,
        },
      },
      update: {},
      create: {
        cocktailId: mojito.id,
        stepNumber: 4,
        instruction: 'Pour rum and top with soda water',
      },
    }),
    prisma.recipeStep.upsert({
      where: {
        cocktailId_stepNumber: {
          cocktailId: mojito.id,
          stepNumber: 5,
        },
      },
      update: {},
      create: {
        cocktailId: mojito.id,
        stepNumber: 5,
        instruction: 'Garnish with mint sprig and lime wheel',
      },
    }),
  ]);

  console.log('✅ Recipe steps created');

  // Add flavor profiles to cocktails
  await Promise.all([
    // Gin & Tonic flavors
    prisma.cocktailFlavorProfile.upsert({
      where: {
        cocktailId_flavorProfileId: {
          cocktailId: ginTonic.id,
          flavorProfileId: flavorProfiles.find(f => f.slug === 'bitter')!.id,
        },
      },
      update: {},
      create: {
        cocktailId: ginTonic.id,
        flavorProfileId: flavorProfiles.find(f => f.slug === 'bitter')!.id,
        intensity: 4,
      },
    }),
    prisma.cocktailFlavorProfile.upsert({
      where: {
        cocktailId_flavorProfileId: {
          cocktailId: ginTonic.id,
          flavorProfileId: flavorProfiles.find(f => f.slug === 'herbal')!.id,
        },
      },
      update: {},
      create: {
        cocktailId: ginTonic.id,
        flavorProfileId: flavorProfiles.find(f => f.slug === 'herbal')!.id,
        intensity: 3,
      },
    }),

    // Mojito flavors
    prisma.cocktailFlavorProfile.upsert({
      where: {
        cocktailId_flavorProfileId: {
          cocktailId: mojito.id,
          flavorProfileId: flavorProfiles.find(f => f.slug === 'sweet')!.id,
        },
      },
      update: {},
      create: {
        cocktailId: mojito.id,
        flavorProfileId: flavorProfiles.find(f => f.slug === 'sweet')!.id,
        intensity: 2,
      },
    }),
    prisma.cocktailFlavorProfile.upsert({
      where: {
        cocktailId_flavorProfileId: {
          cocktailId: mojito.id,
          flavorProfileId: flavorProfiles.find(f => f.slug === 'sour')!.id,
        },
      },
      update: {},
      create: {
        cocktailId: mojito.id,
        flavorProfileId: flavorProfiles.find(f => f.slug === 'sour')!.id,
        intensity: 3,
      },
    }),
    prisma.cocktailFlavorProfile.upsert({
      where: {
        cocktailId_flavorProfileId: {
          cocktailId: mojito.id,
          flavorProfileId: flavorProfiles.find(f => f.slug === 'herbal')!.id,
        },
      },
      update: {},
      create: {
        cocktailId: mojito.id,
        flavorProfileId: flavorProfiles.find(f => f.slug === 'herbal')!.id,
        intensity: 4,
      },
    }),
  ]);

  console.log('✅ Flavor profiles added to cocktails');

  console.log('🎉 Database seeding completed!');
  console.log('');
  console.log('📊 Sample data created:');
  console.log(`   - ${units.length} units`);
  console.log(`   - ${flavorProfiles.length} flavor profiles`);
  console.log(`   - ${ingredients.length} ingredients`);
  console.log(`   - 2 cocktails (Gin & Tonic, Mojito)`);
  console.log('');
  console.log('🔍 View your data with: npx prisma studio');
}

main()
  .catch(e => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
