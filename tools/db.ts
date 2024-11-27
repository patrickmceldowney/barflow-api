import { Client } from 'https://deno.land/x/postgres@v0.19.3/mod.ts';
import type { Cocktail } from '../types/index.ts';

export class Database {
  private client: Client;

  constructor() {
    this.client = new Client({
      user: Deno.env.get('DB_USER') || 'postgres',
      database: Deno.env.get('DB_NAME') || 'cocktails',
      hostname: Deno.env.get('DB_HOST') || 'localhost',
      password: Deno.env.get('DB_PASSWORD') || '',
      port: parseInt(Deno.env.get('DB_PORT') || '5432'),
    });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.end();
  }

  // Cocktails

  async getCocktails(): Promise<Cocktail[]> {
    const result = await this.client.queryObject<Cocktail>(`
      SELECT
        *
      FROM cocktail_details
      ORDER BY name
    `);
    return result.rows;
  }

  async getCocktailById(id: string): Promise<Cocktail | null> {
    const result = await this.client.queryObject<Cocktail>(`
    SELECT
      *
    FROM
      cocktail_details
    WHERE
      id = ${id}
   `);

    return result.rows[0] || null;
  }

  async createCocktail(cocktail: Omit<Cocktail, 'id'>) {
    const transaction = this.client.createTransaction('create_cocktail');
    try {
      await transaction.begin();
      const cocktailResult = await transaction.queryObject<{ id: number }>`
        INSERT INTO cocktails (name, description, garnish, glass, category)
        VALUES (${cocktail.name}, ${cocktail.description}, ${cocktail.garnish}, ${cocktail.glass}, ${cocktail.category})
        RETURNING id
      `;
      const cocktailId = cocktailResult.rows[0]?.id || '';

      // insert ingredients
      for (const ingredient of cocktail.ingredients) {
        // get ingredient id
        const ingredientResult = await this.client.queryObject<{ id: number }>(`
          SELECT id FROM ingredients WHERE id = ${ingredient.id}
        `);

        if (!ingredientResult.rows.length) {
          throw new Error(`Ingredient not found: ${ingredient.name}`);
        }

        await this.client.queryObject`
          INSERT INTO cocktail_ingredients (cocktail_id, ingredient_id, quantity, unit)
          VALUES (${cocktailId}, ${ingredient.id}, ${ingredient.quantity}. ${ingredient.unit})
        `;
      }

      // Insert recipe
      for (const recipe of cocktail.recipe_steps) {
        await this.client.queryObject`
          INSERT INTO recipes (cocktail_id, step_number, instruction)
          VALUES (${cocktailId}, ${recipe.step_number}, ${recipe.instruction})
        `;
      }

      await transaction.commit();

      return cocktailId;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateCocktail(id: string, cocktail: Omit<Cocktail, 'id'>) {
    const transaction = this.client.createTransaction('update_cocktail');
    try {
      await transaction.begin();
      await transaction.queryObject`
        UPDATE cocktails
        SET
          name = ${cocktail.name},
          description = ${cocktail.description},
          garnish = ${cocktail.garnish},
          glass = ${cocktail.glass},
          category = ${cocktail.category},
          updated_at = NOW()
        WHERE 
          id = ${id}
      `;

      // delete existing ingredients and recipe steps
      await transaction.queryObject`
        DELETE FROM cocktail_ingredients
        WHERE cocktail_id = ${id}
      `;
      await transaction.queryObject`
        DELETE FROM recipes
        WHERE cocktail_id = ${id}
      `;

      // re-insert ingredients
      for (const ingredient of cocktail.ingredients) {
        await transaction.queryObject`
          INSERT INTO cocktail_ingredients (
            cocktail_id,
            ingredient_id,
            quantity,
            unit
          ) VALUES (
            ${id},
            ${ingredient.id},
            ${ingredient.quantity},
            ${ingredient.unit} 
          )
        `;
      }

      // re-insert recipe
      for (const recipe of cocktail.recipe_steps) {
        await this.client.queryObject`
          INSERT INTO recipes (cocktail_id, step_number, instruction)
          VALUES (${id}, ${recipe.step_number}, ${recipe.instruction})
        `;
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteCocktail(id: string) {
    const result = await this.client.queryObject`
      DELETE FROM cocktails
      WHERE id = ${id}
    `;
    return result;
  }
}
