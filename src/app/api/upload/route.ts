import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('video') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No video file found in request." }, { status: 400 });
    }

    console.log("📥 Receiving video:", file.name);

    // 1. Convert file to binary buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Save locally so the Editor's <Player /> can watch it
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    // Create the public/uploads folder if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    const localVideoUrl = `/uploads/${filename}`;
    console.log("✅ Saved locally to:", localVideoUrl);

    // 3. Upload to AssemblyAI to get a Public Link for n8n
    const assemblyApiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!assemblyApiKey) {
      throw new Error("ASSEMBLYAI_API_KEY is missing from your .env file!");
    }

    console.log("☁️ Uploading to AssemblyAI...");
    const assemblyResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': assemblyApiKey,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });

    if (!assemblyResponse.ok) {
      throw new Error(`AssemblyAI Upload Failed: ${assemblyResponse.statusText}`);
    }

    const assemblyData = await assemblyResponse.json();
    const publicUploadUrl = assemblyData.upload_url;
    console.log("✅ AssemblyAI Public Link Generated:", publicUploadUrl);

    // 4. Return BOTH links to the frontend
    return NextResponse.json({
      success: true,
      localUrl: localVideoUrl,       // For your Next.js Editor
      publicUrl: publicUploadUrl     // For n8n
    });

  } catch (error: any) {
    console.error("❌ Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
