const stagingUrl = process.env.STAGING_URL || 'http://localhost:3000';

describe('Cocktails API', () => {
  test('Plural Cocktails Route', async () => {
    const res = await fetch(`${stagingUrl}/api/cocktails`);
    const data = await res.json();
    console.log(data);
    expect(res.status).toBe(200);
  });

  test('Single Cocktail Route & Cocktail Data', async () => {
    const res = await fetch(`${stagingUrl}/api/cocktails/2`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.name).toBe('Margarita');
  });
}); 