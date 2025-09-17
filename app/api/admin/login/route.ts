import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    console.log("🔍 [LOGIN] Mencoba login dengan username:", username)
    console.log("🔍 [LOGIN] Password yang diterima:", password ? "***" : "kosong")
    
    const supabase = await createClient()
    
    console.log("✅ [SUPABASE] Koneksi ke Supabase berhasil dibuat")
    console.log("🔍 [SUPABASE] URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("🔍 [SUPABASE] Anon Key tersedia:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // Get user from users table
    console.log("🔍 [DATABASE] Mencari user dengan username:", username)
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single()

    console.log("🔍 [DATABASE] Hasil query:", { user, error })

    if (error) {
      console.log("❌ [DATABASE] Error saat query:", error.message)
      return NextResponse.json({ error: "Database error: " + error.message }, { status: 500 })
    }

    if (!user) {
      console.log("❌ [LOGIN] User tidak ditemukan dengan username:", username)
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
    }

    console.log("✅ [DATABASE] User ditemukan:", { id: user.id, username: user.username })

    // Check password (plain text comparison - no encryption)
    console.log("🔍 [PASSWORD] Membandingkan password...")
    console.log("🔍 [PASSWORD] Password dari database:", user.password)
    console.log("🔍 [PASSWORD] Password yang dimasukkan:", password)
    
    if (user.password !== password) {
      console.log("❌ [PASSWORD] Password tidak cocok")
      return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
    }

    console.log("✅ [PASSWORD] Password cocok!")
    console.log("✅ [LOGIN] Login berhasil untuk user:", user.username)

    // Return success without JWT token (simple session)
    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: { id: user.id, username: user.username },
    })
  } catch (error) {
    console.error("❌ [ERROR] Login error:", error)
    return NextResponse.json({ error: "Internal server error: " + error }, { status: 500 })
  }
}