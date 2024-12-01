import type { Next } from 'https://deno.land/x/oak@v17.1.3/middleware.ts';
import type { Context } from 'https://deno.land/x/oak@v17.1.3/mod.ts';

const apiKey = Deno.env.get('API_KEY');

export async function apiAuth(ctx: Context, next: Next) {
  const requestKey = ctx.request.headers.get('X-API-Key');

  if (apiKey !== requestKey) {
    ctx.response.status = 401;
    ctx.response.body = { error: 'Unauthorized' };
    return;
  }

  await next();
}
