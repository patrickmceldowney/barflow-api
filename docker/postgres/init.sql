-- Barflow Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE glassware AS ENUM (
        'wine', 'martini', 'rocks', 'coupe', 'highball', 'collins', 
        'shot', 'tiki_mug', 'copper_mug', 'margarita', 'beer_mug', 
        'pint', 'hurricane', 'snifter', 'julep', 'glencairn', 
        'punch_bowl', 'irish_coffee', 'coupe_martini'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE cocktail_category AS ENUM (
        'spirit-forward', 'sour', 'tiki', 'fizz', 'smash', 'collins', 
        'blended', 'digestif', 'apertif', 'shooter', 'mocktail'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ingredient_type AS ENUM (
        'spirit', 'liqueur', 'juice', 'mixer', 'bitter', 'garnish', 
        'ice', 'syrup', 'vermouth', 'fortified_wine', 'special'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alcohol_preference AS ENUM (
        'none', 'light', 'moderate', 'strong'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE skill_level AS ENUM (
        'beginner', 'intermediate', 'advanced'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cocktails_slug ON cocktails(slug);
CREATE INDEX IF NOT EXISTS idx_cocktails_category ON cocktails(category);
CREATE INDEX IF NOT EXISTS idx_cocktails_difficulty ON cocktails(difficulty);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_cocktail_id ON user_favorites(cocktail_id);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_cocktails_name_search ON cocktails USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_cocktails_description_search ON cocktails USING gin(to_tsvector('english', description));

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO barflow_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO barflow_user; 