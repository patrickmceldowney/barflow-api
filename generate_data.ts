#!/usr/bin/env -S deno run --allow-write
const fakeData = {
  cocktails: [
    {
      id: 1,
      name: 'Old Fashioned',
    },
    {
      id: 2,
      name: 'Margarita',
    },
    {
      id: 3,
      name: 'Negroni',
    },
    {
      id: 4,
      name: 'Manhattan',
    },
    {
      id: 5,
      name: 'Dry Martini',
    },
    {
      id: 6,
      name: 'Daquiri',
    },
  ],
};

await Deno.writeTextFile('./data_blob.json', JSON.stringify(fakeData, null, 2));
