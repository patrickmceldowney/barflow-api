const stagingUrl = Deno.env.get('STAGING_URL') || 'http://localhost:3000';

Deno.bench('Single Cocktail', async () => {
  await fetch(`${stagingUrl}/cocktails/2`);
});

Deno.bench('All Cocktails', async () => {
  await fetch(`${stagingUrl}/cocktails`);
});
