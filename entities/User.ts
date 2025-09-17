import { createClient } from "@/lib/supabase/client"
import { hashPassword, verifyPassword, isHashed } from "@/lib/password"

export interface User {
  id: string
  username: string
  password: string
  created_at: string
  updated_at: string
}

export class User {
  id: string
  username: string
  password: string
  created_at: string
  updated_at: string

  constructor(data: User) {
    this.id = data.id
    this.username = data.username
    this.password = data.password
    this.created_at = data.created_at
    this.updated_at = data.updated_at
  }

  static async findByUsername(username: string): Promise<User | null> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (error) {
        console.error('Error finding user by username:', error)
        return null
      }

      return data ? new User(data) : null
    } catch (error) {
      console.error('Error in findByUsername:', error)
      return null
    }
  }

  static async updatePassword(username: string, newPassword: string): Promise<boolean> {
    try {
      // Hash the new password before storing
      const hashedPassword = await hashPassword(newPassword)
      
      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({ 
          password: hashedPassword,
          updated_at: new Date().toISOString()
        })
        .eq('username', username)

      if (error) {
        console.error('Error updating password:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updatePassword:', error)
      return false
    }
  }

  static async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.findByUsername(username)
      if (user) {
        // Check if password is already hashed (new format) or plain text (legacy)
        if (isHashed(user.password)) {
          // New format: verify hashed password
          const isValid = await verifyPassword(password, user.password)
          if (isValid) {
            return user
          }
        } else {
          // Legacy format: direct comparison (for backward compatibility)
          if (user.password === password) {
            return user
          }
        }
      }
      return null
    } catch (error) {
      console.error('Error in authenticate:', error)
      return null
    }
  }

  static async create(username: string, password: string): Promise<User | null> {
    try {
      // Hash the password before storing
      const hashedPassword = await hashPassword(password)
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users')
        .insert({
          username,
          password: hashedPassword,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating user:', error)
        return null
      }

      return data ? new User(data) : null
    } catch (error) {
      console.error('Error in create:', error)
      return null
    }
  }

  static async list(): Promise<User[]> {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error listing users:', error)
        return []
      }

      return data ? data.map(user => new User(user)) : []
    } catch (error) {
      console.error('Error in list:', error)
      return []
    }
  }
}
