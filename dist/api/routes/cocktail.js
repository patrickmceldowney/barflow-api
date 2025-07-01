"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../tools/middleware");
const cocktailRouter = express_1.default.Router();
cocktailRouter.get('/', async (req, res) => {
    try {
        const cocktails = await req.db.cocktail.findMany({
            include: {
                ingredients: {
                    include: {
                        ingredient: true,
                        unit: true,
                    },
                },
                recipeSteps: {
                    orderBy: {
                        stepNumber: 'asc',
                    },
                },
                flavorProfiles: {
                    include: {
                        flavorProfile: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        return res.status(200).json(cocktails);
    }
    catch (error) {
        console.error('Error getting cocktails', error);
        return res.status(500).json({
            message: 'Error getting cocktails',
        });
    }
});
cocktailRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cocktail = await req.db.cocktail.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                ingredients: {
                    include: {
                        ingredient: true,
                        unit: true,
                    },
                },
                recipeSteps: {
                    orderBy: {
                        stepNumber: 'asc',
                    },
                },
                flavorProfiles: {
                    include: {
                        flavorProfile: true,
                    },
                },
            },
        });
        if (!cocktail) {
            return res.status(404).json({ message: 'Cocktail not found' });
        }
        return res.json(cocktail);
    }
    catch (error) {
        console.error('Error getting cocktail', error);
        return res.status(500).json({
            message: 'Error getting cocktail',
        });
    }
});
cocktailRouter.delete('/:id', middleware_1.apiAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const existingCocktail = await req.db.cocktail.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingCocktail) {
            return res.status(404).json({
                message: 'Cocktail not found',
            });
        }
        await req.db.cocktail.delete({
            where: { id: parseInt(id) },
        });
        return res.json({
            message: 'Cocktail deleted successfully',
        });
    }
    catch (error) {
        console.error('API Error', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
});
cocktailRouter.post('/', middleware_1.apiAuth, async (req, res) => {
    try {
        const cocktailData = req.body;
        if (!cocktailData.name ||
            !cocktailData.slug ||
            !cocktailData.glass ||
            !cocktailData.category ||
            !cocktailData.ingredients ||
            !cocktailData.recipeSteps) {
            return res
                .status(400)
                .json({ error: 'Missing required cocktail fields.' });
        }
        const cocktail = await req.db.cocktail.create({
            data: {
                name: cocktailData.name,
                slug: cocktailData.slug,
                description: cocktailData.description,
                garnish: cocktailData.garnishes?.map(g => g.garnishName).join(', ') || null,
                glass: cocktailData.glass,
                category: cocktailData.category,
                difficulty: 'beginner',
            },
        });
        for (const ingredientData of cocktailData.ingredients) {
            console.log(`Would create ingredient: ${ingredientData.ingredientName} - ${ingredientData.quantity} ${ingredientData.unitAbbreviation}`);
        }
        for (const stepData of cocktailData.recipeSteps) {
            await req.db.recipeStep.create({
                data: {
                    cocktailId: cocktail.id,
                    stepNumber: stepData.stepNumber,
                    instruction: stepData.instruction,
                },
            });
        }
        if (cocktailData.flavorProfiles) {
            for (const flavorData of cocktailData.flavorProfiles) {
                console.log(`Would create flavor profile: ${flavorData.profileName} - intensity ${flavorData.intensity}`);
            }
        }
        return res.status(201).json({
            message: 'Cocktail created successfully',
            id: cocktail.id,
        });
    }
    catch (e) {
        console.error('API Error', e);
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
});
exports.default = cocktailRouter;
//# sourceMappingURL=cocktail.js.map