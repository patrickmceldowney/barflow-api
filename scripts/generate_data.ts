#!/usr/bin/env -S deno run --allow-write
const fakeData = {
  cocktails: [
    {
      id: 1,
      name: 'Old Fashioned',
      description: '',
      ingredients: [
        {
          name: 'Bourbon',
          quantity: 2,
          unit: 'oz',
        },
        {
          name: 'Simple Syrup',
          quantity: 0.5,
          unit: 'oz',
        },
        {
          name: 'Angostura Bitters',
          quantity: 3,
          unit: 'dashes',
        },
      ],
      recipe: [
        'Add ice to a rocks glass to chill it while you peform the rest of the steps',
        'Combine all ingredients into a mixing glass',
        'Add ice to the mixing glass and stir until well chilled',
        'Toss out ice from the rocks glass and add in a large ice cube',
        'Strain ingredients from the mixing glass into your glass',
        "Squeeze orange peel over the glass and add it in along a maraschino cherry if you'd like.",
      ],
      garnish: 'Orange peel and maraschino cherry',
      glass: 'rocks', // wine glass, martini, coupe, copper mug, highball, rocks
      category: 'classic', //classic, mocktail, tropical
    },
    {
      id: 2,
      name: 'Margarita',
      description: '',
      ingredients: [
        {
          name: 'Blanco Tequila',
          quantity: 1.5,
          unit: 'oz',
        },
        {
          name: 'Simple Syrup',
          quantity: 0.5,
          unit: 'oz',
        },
        {
          name: 'Lime juice',
          quantity: 1,
          unit: 'oz',
        },
        {
          name: 'Cointreau',
          quantity: 0.75,
          unit: 'oz',
        },
      ],
      recipe: [
        'Rub a lime wedge over one half of the glass and roll it in salt or tajin.',
        'Combine all ingredients into a cocktail shaker',
        'Add ice to the shaker and shake until well chilled',
        'Double strain the ingredients into your chilled glass',
        'Add lime wheel to the side of the glass or just drop it in',
      ],
      garnish: 'Lime wheel',
      glass: 'coupe', // wine glass, martini, coupe, copper mug, highball, rocks
      category: 'classic', //classic, mocktail, tropical
    },
    {
      id: 3,
      name: 'Negroni',
      description: '',
      ingredients: [
        {
          name: 'London Dry Gin',
          quantity: 1,
          unit: 'oz',
        },
        {
          name: 'Campari',
          quantity: 1,
          unit: 'oz',
        },
        {
          name: 'Sweet vermouth',
          quantity: 1,
          unit: 'oz',
        },
      ],
      recipe: [
        'Add ice to a rocks glass to chill it while you peform the rest of the steps',
        'Combine all ingredients into a mixing glass',
        'Add ice to the mixing glass and stir until well chilled',
        'Toss out ice from the rocks glass and add in a large ice cube',
        'Strain ingredients from the mixing glass into your glass',
      ],
      garnish: 'Orange wheel',
      glass: 'rocks', // wine glass, martini, coupe, copper mug, highball, rocks
      category: 'classic', //classic, mocktail, tropical
    },
    {
      id: 4,
      name: 'Manhattan',
      description: '',
      ingredients: [
        {
          name: 'Rye',
          quantity: 2,
          unit: 'oz',
        },
        {
          name: 'Sweet vermouth',
          quantity: 1,
          unit: 'oz',
        },
        {
          name: 'Angostura Bitters',
          quantity: 3,
          unit: 'dashes',
        },
      ],
      recipe: [
        'Combine all ingredients into a mixing glass',
        'Add ice to the mixing glass and stir until well chilled',
        'Toss out ice from the rocks glass and add in a large ice cube',
        'Strain ingredients from the mixing glass into your glass',
        'Squeeze orange peel over the glass and cut a small slit in it to attach it to the side rim of the glass',
      ],
      garnish: 'Orange peel',
      glass: 'coupe', // wine glass, martini, coupe, copper mug, highball, rocks
      category: 'classic', //classic, mocktail, tropical
    },
  ],
};

await Deno.writeTextFile(
  './data/data_blob.json',
  JSON.stringify(fakeData, null, 2)
);
