export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cocktail_flavor_profiles: {
        Row: {
          cocktail_id: number | null
          flavor_profile_id: number | null
          id: number
          intensity: number | null
        }
        Insert: {
          cocktail_id?: number | null
          flavor_profile_id?: number | null
          id?: number
          intensity?: number | null
        }
        Update: {
          cocktail_id?: number | null
          flavor_profile_id?: number | null
          id?: number
          intensity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cocktail_flavor_profiles_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "cocktail_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cocktail_flavor_profiles_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "cocktails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cocktail_flavor_profiles_flavor_profile_id_fkey"
            columns: ["flavor_profile_id"]
            isOneToOne: false
            referencedRelation: "flavor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cocktail_ingredients: {
        Row: {
          cocktail_id: number
          id: number
          ingredient_id: number | null
          quantity: number
          unit: number
        }
        Insert: {
          cocktail_id: number
          id?: never
          ingredient_id?: number | null
          quantity: number
          unit: number
        }
        Update: {
          cocktail_id?: number
          id?: never
          ingredient_id?: number | null
          quantity?: number
          unit?: number
        }
        Relationships: [
          {
            foreignKeyName: "cocktail_ingredients_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "cocktail_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cocktail_ingredients_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "cocktails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cocktail_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cocktail_ingredients_unit_fkey"
            columns: ["unit"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      cocktails: {
        Row: {
          category: Database["public"]["Enums"]["Cocktail category"] | null
          created_at: string
          description: string | null
          garnish: string | null
          glass: Database["public"]["Enums"]["Glassware"] | null
          id: number
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["Cocktail category"] | null
          created_at?: string
          description?: string | null
          garnish?: string | null
          glass?: Database["public"]["Enums"]["Glassware"] | null
          id?: never
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["Cocktail category"] | null
          created_at?: string
          description?: string | null
          garnish?: string | null
          glass?: Database["public"]["Enums"]["Glassware"] | null
          id?: never
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      flavor_profiles: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          allergens: string | null
          created_at: string
          description: string | null
          id: number
          is_alcoholic: boolean
          name: string
          slug: string
          type: Database["public"]["Enums"]["Ingredient type"] | null
          updated_at: string
        }
        Insert: {
          allergens?: string | null
          created_at?: string
          description?: string | null
          id?: never
          is_alcoholic?: boolean
          name: string
          slug: string
          type?: Database["public"]["Enums"]["Ingredient type"] | null
          updated_at?: string
        }
        Update: {
          allergens?: string | null
          created_at?: string
          description?: string | null
          id?: never
          is_alcoholic?: boolean
          name?: string
          slug?: string
          type?: Database["public"]["Enums"]["Ingredient type"] | null
          updated_at?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          cocktail_id: number
          created_at: string
          id: number
          instruction: string
          step_number: number
          updated_at: string
        }
        Insert: {
          cocktail_id: number
          created_at?: string
          id?: never
          instruction: string
          step_number: number
          updated_at?: string
        }
        Update: {
          cocktail_id?: number
          created_at?: string
          id?: never
          instruction?: string
          step_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "cocktail_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_cocktail_id_fkey"
            columns: ["cocktail_id"]
            isOneToOne: false
            referencedRelation: "cocktails"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          abbreviation: string
          id: number
          name: string
        }
        Insert: {
          abbreviation: string
          id?: number
          name: string
        }
        Update: {
          abbreviation?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      cocktail_details: {
        Row: {
          category: Database["public"]["Enums"]["Cocktail category"] | null
          description: string | null
          garnish: string | null
          glass: Database["public"]["Enums"]["Glassware"] | null
          id: number | null
          ingredients: Json | null
          name: string | null
          recipe_steps: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      "Cocktail category":
        | "spirit-forward"
        | "sour"
        | "tiki"
        | "fizz"
        | "smash"
        | "collins"
        | "blended"
        | "digestif"
        | "apertif"
        | "shooter"
        | "mocktail"
      Glassware:
        | "wine"
        | "martini"
        | "rocks"
        | "highball"
        | "collins"
        | "coupe"
        | "shot"
        | "tiki_mug"
        | "copper_mug"
        | "margarita"
        | "beer_mug"
        | "pint"
        | "hurricane"
        | "snifter"
        | "julep"
        | "glencairn"
        | "punch_bowl"
        | "irish_coffee"
        | "coupe_martini"
      "Ingredient type":
        | "spirit"
        | "liqueur"
        | "juice"
        | "mixer"
        | "bitter"
        | "garnish"
        | "ice"
        | "syrup"
        | "vermouth"
        | "fortified_wine"
        | "special"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
