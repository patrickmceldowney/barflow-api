-- CreateEnum
CREATE TYPE "Glassware" AS ENUM ('wine', 'martini', 'rocks', 'coupe', 'highball', 'collins', 'shot', 'tiki_mug', 'copper_mug', 'margarita', 'beer_mug', 'pint', 'hurricane', 'snifter', 'julep', 'glencairn', 'punch_bowl', 'irish_coffee', 'coupe_martini');

-- CreateEnum
CREATE TYPE "CocktailCategory" AS ENUM ('spirit_forward', 'sour', 'tiki', 'fizz', 'smash', 'collins', 'blended', 'digestif', 'apertif', 'shooter', 'mocktail');

-- CreateEnum
CREATE TYPE "IngredientType" AS ENUM ('spirit', 'liqueur', 'juice', 'mixer', 'bitter', 'garnish', 'ice', 'syrup', 'vermouth', 'fortified_wine', 'special');

-- CreateEnum
CREATE TYPE "AlcoholPreference" AS ENUM ('none', 'light', 'moderate', 'strong');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "favoriteFlavors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "favoriteIngredients" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dietaryRestrictions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "alcoholPreference" "AlcoholPreference" NOT NULL DEFAULT 'moderate',
    "skillLevel" "SkillLevel" NOT NULL DEFAULT 'beginner',
    "preferredGlassware" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cocktails" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "garnish" TEXT,
    "glass" "Glassware" NOT NULL,
    "category" "CocktailCategory" NOT NULL,
    "difficulty" "SkillLevel" NOT NULL DEFAULT 'beginner',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cocktails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "IngredientType" NOT NULL,
    "description" TEXT,
    "allergens" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cocktail_ingredients" (
    "id" SERIAL NOT NULL,
    "cocktailId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cocktail_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "cocktailId" INTEGER NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flavor_profiles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flavor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cocktail_flavor_profiles" (
    "id" SERIAL NOT NULL,
    "cocktailId" INTEGER NOT NULL,
    "flavorProfileId" INTEGER NOT NULL,
    "intensity" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cocktail_flavor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cocktailId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "cocktails_slug_key" ON "cocktails"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_slug_key" ON "ingredients"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cocktail_ingredients_cocktailId_ingredientId_key" ON "cocktail_ingredients"("cocktailId", "ingredientId");

-- CreateIndex
CREATE UNIQUE INDEX "units_name_key" ON "units"("name");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_cocktailId_stepNumber_key" ON "recipes"("cocktailId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "flavor_profiles_slug_key" ON "flavor_profiles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cocktail_flavor_profiles_cocktailId_flavorProfileId_key" ON "cocktail_flavor_profiles"("cocktailId", "flavorProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_userId_cocktailId_key" ON "user_favorites"("userId", "cocktailId");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktail_ingredients" ADD CONSTRAINT "cocktail_ingredients_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "cocktails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktail_ingredients" ADD CONSTRAINT "cocktail_ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktail_ingredients" ADD CONSTRAINT "cocktail_ingredients_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "cocktails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktail_flavor_profiles" ADD CONSTRAINT "cocktail_flavor_profiles_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "cocktails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cocktail_flavor_profiles" ADD CONSTRAINT "cocktail_flavor_profiles_flavorProfileId_fkey" FOREIGN KEY ("flavorProfileId") REFERENCES "flavor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_cocktailId_fkey" FOREIGN KEY ("cocktailId") REFERENCES "cocktails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
