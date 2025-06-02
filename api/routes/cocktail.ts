import { Router } from 'https://deno.land/x/oak@v17.1.3/mod.ts';
import type { AppState } from '../../types/index.ts';
import { apiAuth } from '../../tools/middleware.ts';
import type { CocktailCreatePayload } from '../../types/api.ts';

const cocktailRouter = new Router<AppState>();

cocktailRouter.use(apiAuth);

cocktailRouter.get('/', async (ctx) => {
  try {
    const db = ctx.state.db;
    const { data, error } = await db.getCocktails();

    if (error) {
      console.error('Error finding cocktails', error);
      ctx.response.status = 500;
      ctx.response.body = {
        error: 'Failed to find cocktails',
        details: error,
      };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = data;
  } catch (error) {
    console.error('Error getting cocktails', error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: 'Error getting cocktails',
    };
  }
});

cocktailRouter.get('/:id', async (ctx) => {
  try {
    const db = ctx.state.db;
    const { data, error } = await db.getCocktailById(ctx.params.id);

    if (!data) {
      ctx.response.status = 404;
      ctx.response.body = { message: 'Cocktail not found' };
      return;
    }

    if (error) {
      console.error(`Error finding cocktail with id (${ctx.params.id})`, error);
      ctx.response.status = 500;
      ctx.response.body = {
        error: 'Failed to find cocktail',
        details: error,
      };
      return;
    }

    ctx.response.body = data;
  } catch (error) {
    console.error('Error getting cocktail', error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: 'Error getting cocktail',
    };
  }
});

cocktailRouter.delete('/:id', async (ctx) => {
  try {
    const db = ctx.state.db;

    const { error, count } = await db.deleteCocktail(ctx.params.id);

    if (!count) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: 'Cocktail not found',
      };
      return;
    }

    if (error) {
      console.error('Error deleting cocktail', error);
      ctx.response.status = 500;
      ctx.response.body = {
        error: 'Failed to create cocktail',
        details: error,
      };
      return;
    }

    ctx.response.body = {
      message: 'Cocktail deleted successfully',
    };
  } catch (error) {
    console.error('API Error', error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: 'Internal server error',
    };
  }
});

cocktailRouter.post('/', async (ctx) => {
  try {
    const body = await ctx.request.body.json();
    const cocktailData: CocktailCreatePayload = body;

    if (
      !cocktailData.name ||
      !cocktailData.slug ||
      !cocktailData.glass ||
      !cocktailData.category ||
      !cocktailData.ingredients ||
      !cocktailData.recipeSteps
    ) {
      ctx.response.status = 400;
      ctx.response.body = { error: 'Missing required cocktail fields.' };
      return;
    }

    // Call supabase RPC
    const { data: newCocktailId, error } = await ctx.state.db.createCocktail(
      cocktailData
    );

    if (error) {
      console.error('Error calling create_cocktail function', error.message);
      ctx.response.status = 500;
      ctx.response.body = {
        error: 'Failed to create cocktail',
        details: error.message,
      };
      return;
    }

    ctx.response.status = 201;
    ctx.response.body = {
      message: 'Cocktail created successfully',
      id: newCocktailId,
    };
  } catch (e) {
    console.error('API Error', e);
    ctx.response.status = 500;
    ctx.response.body = {
      error: 'Internal server error',
    };
  }
});

export default cocktailRouter;
