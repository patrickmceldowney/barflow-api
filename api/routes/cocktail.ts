import { Router } from 'https://deno.land/x/oak@v17.1.3/mod.ts';
import type { AppState, Cocktail } from '../../types/index.ts';

const cocktailRouter = new Router<AppState>();

cocktailRouter.get('/', async (ctx) => {
  try {
    const db = ctx.state.db;
    const cocktails = await db.getCocktails();
    ctx.response.status = 200;
    ctx.response.body = cocktails;
  } catch (error) {
    console.error('Error getting cocktails', error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: 'Error getting cocktails',
    };
  }
});

cocktailRouter.post('/', async (ctx) => {
  try {
    const db = ctx.state.db;
    const data: Cocktail = await ctx.request.body.json();
    const cocktailId = db.createCocktail(data);
    console.log('Created cocktail with ID: ', cocktailId);
    ctx.response.status = 201;
    ctx.response.body = {
      message: 'Cocktail created successfully',
    };
  } catch (error) {
    console.log('Error getting cocktails', error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: 'Error getting cocktails',
    };
  }
});

cocktailRouter.get('/:id', async (ctx) => {
  try {
    const db = ctx.state.db;
    const cocktail = await db.getCocktailById(ctx.params.id);

    if (!cocktail) {
      ctx.response.status = 404;
      ctx.response.body = { message: 'Cocktail not found' };
      return;
    }

    ctx.response.body = cocktail;
  } catch (error) {
    console.error('Error getting cocktail', error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: 'Error getting cocktail',
    };
  }
});

cocktailRouter.put('/:id', async (ctx) => {
  try {
    const db = ctx.state.db;

    const data: Cocktail = await ctx.request.body.json();
    db.updateCocktail(ctx.params.id, data);

    ctx.response.body = {
      message: 'Cocktail updated successfully',
    };
  } catch (error) {
    console.error('Error updating cocktail', error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: 'Error updating cocktail',
    };
  }
});

cocktailRouter.delete('/:id', async (ctx) => {
  try {
    const db = ctx.state.db;

    const result = await db.deleteCocktail(ctx.params.id);

    if (!result.rowCount) {
      ctx.response.status = 404;
      ctx.response.body = {
        message: 'Cocktail not found',
      };
      return;
    }

    ctx.response.body = {
      message: 'Cocktail deleted successfully',
    };
  } catch (error) {
    console.error('Error updating cocktail', error);
    ctx.response.status = 500;
    ctx.response.body = {
      message: 'Error updating cocktail',
    };
  }
});

export default cocktailRouter;
