# Barflow API Documentation

A comprehensive cocktail recipe database API with user authentication and personalized recommendations.

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "cocktail_lover"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "cocktail_lover"
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "cocktail_lover"
  }
}
```

#### Get User Profile
```http
GET /auth/profile
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "username": "cocktail_lover",
    "preferences": {
      "favoriteFlavors": ["sweet", "fruity"],
      "favoriteIngredients": ["gin", "lime"],
      "dietaryRestrictions": []
    }
  }
}
```

### Cocktails

#### Get All Cocktails
```http
GET /cocktails
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Gin & Tonic",
    "description": "A classic refreshing cocktail",
    "glass": "highball",
    "category": "collins",
    "difficulty": "beginner"
  }
]
```

#### Get Cocktail by ID
```http
GET /cocktails/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "Gin & Tonic",
  "description": "A classic refreshing cocktail",
  "glass": "highball",
  "category": "collins",
  "ingredients": [
    {
      "name": "Gin",
      "quantity": 2,
      "unit": "oz"
    }
  ],
  "recipeSteps": [
    "Fill glass with ice",
    "Pour gin over ice",
    "Top with tonic water",
    "Garnish with lime wedge"
  ],
  "flavorProfiles": ["bitter", "herbal"]
}
```

#### Create Cocktail (Admin)
```http
POST /cocktails
```

**Headers:**
```
Authorization: Bearer <jwt-token>
X-API-Key: <admin-api-key>
```

**Request Body:**
```json
{
  "name": "New Cocktail",
  "description": "A delicious new cocktail",
  "glass": "coupe",
  "category": "sour",
  "slug": "new-cocktail",
  "ingredients": [
    {
      "ingredientName": "Gin",
      "quantity": 2,
      "unitAbbreviation": "oz"
    }
  ],
  "recipeSteps": [
    {
      "stepNumber": 1,
      "instruction": "Add gin to shaker"
    }
  ]
}
```

#### Delete Cocktail (Admin)
```http
DELETE /cocktails/:id
```

**Headers:**
```
Authorization: Bearer <jwt-token>
X-API-Key: <admin-api-key>
```

### User Preferences

#### Get User Preferences
```http
GET /preferences
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "favoriteFlavors": ["sweet", "fruity", "herbal"],
  "favoriteIngredients": ["gin", "lime", "mint"],
  "dietaryRestrictions": ["no-nuts"],
  "alcoholPreference": "moderate",
  "skillLevel": "beginner",
  "preferredGlassware": ["coupe", "rocks"]
}
```

#### Update User Preferences
```http
PUT /preferences
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "favoriteFlavors": ["sweet", "fruity"],
  "favoriteIngredients": ["gin", "lime"],
  "dietaryRestrictions": ["no-nuts"],
  "alcoholPreference": "moderate",
  "skillLevel": "beginner",
  "preferredGlassware": ["coupe", "rocks"]
}
```

#### Get Questionnaire
```http
GET /preferences/questionnaire
```

**Response:**
```json
[
  {
    "id": "flavor-profiles",
    "type": "multi-select",
    "question": "What flavor profiles do you enjoy?",
    "options": [
      { "value": "sweet", "label": "Sweet" },
      { "value": "sour", "label": "Sour" }
    ]
  }
]
```

### Recommendations

#### Get Personalized Recommendations
```http
POST /recommendations/cocktails
```

**Request Body:**
```json
{
  "favoriteFlavors": ["sweet", "fruity"],
  "favoriteIngredients": ["gin", "lime"],
  "dietaryRestrictions": ["no-nuts"],
  "alcoholPreference": "moderate",
  "skillLevel": "beginner",
  "limit": 10
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "id": 1,
      "name": "Gin & Tonic",
      "description": "A classic refreshing cocktail",
      "difficulty": "beginner",
      "flavorProfiles": ["bitter", "herbal"],
      "ingredients": ["gin", "tonic water", "lime"],
      "matchScore": 85
    }
  ],
  "totalFound": 1,
  "preferences": {
    "favoriteFlavors": ["sweet", "fruity"],
    "favoriteIngredients": ["gin", "lime"]
  }
}
```

#### Discover Random Cocktails
```http
GET /recommendations/discover?limit=5
```

**Response:**
```json
{
  "cocktails": [
    {
      "id": 4,
      "name": "Old Fashioned",
      "description": "A classic whiskey cocktail",
      "difficulty": "intermediate",
      "flavorProfiles": ["bitter", "sweet"],
      "ingredients": ["whiskey", "bitters", "simple-syrup"]
    }
  ],
  "totalFound": 1
}
```

#### Get Trending Cocktails
```http
GET /recommendations/trending?limit=10
```

**Response:**
```json
{
  "cocktails": [
    {
      "id": 1,
      "name": "Gin & Tonic",
      "description": "A classic refreshing cocktail",
      "viewCount": 1250,
      "favoriteCount": 89
    }
  ],
  "totalFound": 1
}
```

### Favorites

#### Get User Favorites
```http
GET /favorites
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "favorites": [
    {
      "id": 1,
      "cocktailId": 1,
      "addedAt": "2024-01-15T10:30:00Z",
      "cocktail": {
        "id": 1,
        "name": "Gin & Tonic",
        "description": "A classic refreshing cocktail",
        "difficulty": "beginner",
        "flavorProfiles": ["bitter", "herbal"],
        "ingredients": ["gin", "tonic water", "lime"]
      }
    }
  ],
  "totalCount": 1
}
```

#### Add to Favorites
```http
POST /favorites/:cocktailId
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "Cocktail added to favorites",
  "favorite": {
    "id": 3,
    "cocktailId": 1,
    "addedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Remove from Favorites
```http
DELETE /favorites/:cocktailId
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "Cocktail removed from favorites"
}
```

#### Check if Favorited
```http
GET /favorites/:cocktailId/check
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "isFavorited": true,
  "cocktailId": 1
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Cocktail not found"
}
```

### 409 Conflict
```json
{
  "error": "User already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!",
  "message": "Internal server error"
}
```

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
API_KEY=your-admin-api-key
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}
```

### UserPreferences
```typescript
interface UserPreferences {
  id: string;
  userId: string;
  favoriteFlavors: string[];
  favoriteIngredients: string[];
  dietaryRestrictions: string[];
  alcoholPreference: 'none' | 'light' | 'moderate' | 'strong';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredGlassware: string[];
}
```

### Cocktail
```typescript
interface Cocktail {
  id: number;
  name: string;
  slug: string;
  description: string;
  glass: Glassware;
  category: CocktailCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  ingredients: Ingredient[];
  recipeSteps: RecipeStep[];
  flavorProfiles: FlavorProfile[];
  viewCount: number;
  favoriteCount: number;
}
```

### UserFavorite
```typescript
interface UserFavorite {
  id: string;
  userId: string;
  cocktailId: number;
  addedAt: Date;
}
``` 