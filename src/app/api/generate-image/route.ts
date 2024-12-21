// src/app/api/generate-image/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    console.log('🔍 API Route - Received prompt:', text);
    
    // Replace with your Modal endpoint URL
    const modalUrl = "https://koernerg--example-flux-generate.modal.run";
    console.log('🌐 API Route - Calling Modal URL:', modalUrl);

    const fullUrl = `${modalUrl}?prompt=${encodeURIComponent(text)}`;
    console.log('🔗 API Route - Full request URL:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'POST',
    });

    console.log('📡 API Route - Modal response status:', response.status);
    console.log('📡 API Route - Modal response statusText:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Route - Modal error response:', errorText);
      throw new Error(`Modal API error: ${response.statusText} - ${errorText}`);
    }

    // Get the image bytes
    const imageBuffer = await response.arrayBuffer();
    console.log('📦 API Route - Received image buffer size:', imageBuffer.byteLength);

    const base64Image = Buffer.from(imageBuffer).toString('base64');
    console.log('✅ API Route - Successfully converted image to base64');

    return NextResponse.json({ 
      success: true, 
      image: `data:image/png;base64,${base64Image}`
    });
  } catch (error) {
    console.error('💥 API Route - Error details:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}