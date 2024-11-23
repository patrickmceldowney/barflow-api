import { assertEquals } from '@std/assert';
const stagingUrl = Deno.env.get('STAGING_URL') || 'http://localhost:3000';

Deno.test('Plural Cocktails Route', async () => {
  const res = await fetch(`${stagingUrl}/cocktails`);
  const data = await res.json();
  console.log(data);
  assertEquals(res.status, 200);
});

Deno.test('Single Cocktail Route & Cocktail Data', async () => {
  const res = await fetch(`${stagingUrl}/cocktails/2`);
  const data = await res.json();
  assertEquals(res.status, 200);
  assertEquals(data.name, 'Margarita');
});
