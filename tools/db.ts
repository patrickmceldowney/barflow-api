import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types.ts';
import type { CocktailCreatePayload } from '../types/api.ts';

export class DatabaseClient {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SECRET_KEY') || ''
    );
  }

  // Cocktails

  async getCocktails() {
    const cocktails = await this.supabase
      .from('cocktail_details')
      .select('*')
      .order('name');
    return cocktails;
  }

  async getCocktailById(id: string) {
    const cocktail = await this.supabase
      .from('cocktail_details')
      .select('*')
      .eq('id', id)
      .single();

    return cocktail;
  }

  async deleteCocktail(id: string) {
    const result = await this.supabase.from('cocktails').delete().eq('id', id);
    return result;
  }

  async createCocktail(cocktailData: CocktailCreatePayload) {
    const result = await this.supabase.rpc('create_cocktail', {
      cocktail_data: cocktailData,
    });
    return result;
  }
}
