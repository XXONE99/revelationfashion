import { createClient } from "@/lib/supabase/client"

export interface Product {
  id: string
  name: string
  description: string
  category: string
  images: string[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export class Product {
  static async list(): Promise<Product[]> {
    console.log("🔍 [PRODUCT] Fetching products...")
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ [PRODUCT] Error fetching products:", error)
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    console.log("✅ [PRODUCT] Products fetched successfully:", data?.length || 0)
    return data || []
  }

  static async get(id: string): Promise<Product | null> {
    console.log("🔍 [PRODUCT] Fetching product:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("❌ [PRODUCT] Error fetching product:", error)
      return null
    }

    console.log("✅ [PRODUCT] Product fetched successfully")
    return data
  }

  static async create(productData: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product> {
    console.log("🔍 [PRODUCT] Creating product:", productData.name)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single()

    if (error) {
      console.error("❌ [PRODUCT] Error creating product:", error)
      throw new Error(`Failed to create product: ${error.message}`)
    }

    console.log("✅ [PRODUCT] Product created successfully:", data.id)
    return data
  }

  static async update(id: string, updates: Partial<Product>): Promise<Product> {
    console.log("🔍 [PRODUCT] Updating product:", id)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("products")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ [PRODUCT] Error updating product:", error)
      throw new Error(`Failed to update product: ${error.message}`)
    }

    console.log("✅ [PRODUCT] Product updated successfully")
    return data
  }

  static async delete(id: string): Promise<void> {
    console.log("🔍 [PRODUCT] Deleting product:", id)
    const supabase = createClient()
    
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("❌ [PRODUCT] Error deleting product:", error)
      throw new Error(`Failed to delete product: ${error.message}`)
    }

    console.log("✅ [PRODUCT] Product deleted successfully")
  }
}
