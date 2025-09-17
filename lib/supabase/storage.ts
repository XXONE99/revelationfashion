import { createClient } from "./client"

export async function uploadImageToStorage(params: {
  bucket: string
  file: File
  pathPrefix?: string
}): Promise<string> {
  const { bucket, file, pathPrefix } = params
  const supabase = createClient()

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const timestamp = Date.now()
  const path = `${pathPrefix ? `${pathPrefix}/` : ""}${timestamp}-${sanitizedName}`

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  })

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`)
  }

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path)
  return publicUrl.publicUrl
}


