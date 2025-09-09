export interface UploadFileParams {
  file: File
  bucket?: string
  path?: string
}

export interface UploadFileResponse {
  file_url: string
  file_path: string
}

export async function UploadFile({ 
  file, 
  bucket = 'uploads', 
  path 
}: UploadFileParams): Promise<UploadFileResponse> {
  console.log("🔍 [UPLOAD] Starting mock file upload:", file.name)
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Generate mock file path
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filePath = path ? `${path}/${fileName}` : fileName
  
  // Generate mock URL based on file type
  let mockUrl: string;
  
  if (file.type.startsWith('image/')) {
    // For images, use placeholder service
    const width = 800;
    const height = 600;
    mockUrl = `/api/placeholder/${width}/${height}`;
  } else if (file.type === 'image/svg+xml') {
    // For SVG icons
    mockUrl = `/api/placeholder/64/64`;
  } else {
    // For other files
    mockUrl = `/api/placeholder/file/${fileName}`;
  }

  console.log("✅ [UPLOAD] Mock file uploaded successfully:", filePath)
  
  return {
    file_url: mockUrl,
    file_path: filePath
  }
}

// Helper function to delete file (mock)
export async function DeleteFile(filePath: string, bucket = 'uploads'): Promise<void> {
  console.log("🔍 [DELETE] Mock deleting file:", filePath)
  
  // Simulate delete delay
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log("✅ [DELETE] Mock file deleted successfully:", filePath)
}
