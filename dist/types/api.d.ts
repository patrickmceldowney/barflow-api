import type { CocktailCategory, Glassware } from './index';
export interface CocktailCreatePayload {
    name: string;
    description?: string | null;
    glass: Glassware;
    category: CocktailCategory;
    slug: string;
    ingredients: Array<{
        ingredientName: string;
        quantity: number;
        unitAbbreviation: string;
    }>;
    flavorProfiles?: Array<{
        profileName: string;
        intensity: number;
    }>;
    garnishes?: Array<{
        garnishName: string;
        notes?: string;
    }>;
    recipeSteps: Array<{
        stepNumber: number;
        instruction: string;
    }>;
}
//# sourceMappingURL=api.d.ts.map