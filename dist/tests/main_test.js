"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@std/assert");
const stagingUrl = Deno.env.get('STAGING_URL') || 'http://localhost:3000';
Deno.test('Plural Cocktails Route', async () => {
    const res = await fetch(`${stagingUrl}/cocktails`);
    const data = await res.json();
    console.log(data);
    (0, assert_1.assertEquals)(res.status, 200);
});
Deno.test('Single Cocktail Route & Cocktail Data', async () => {
    const res = await fetch(`${stagingUrl}/cocktails/2`);
    const data = await res.json();
    (0, assert_1.assertEquals)(res.status, 200);
    (0, assert_1.assertEquals)(data.name, 'Margarita');
});
//# sourceMappingURL=main_test.js.map