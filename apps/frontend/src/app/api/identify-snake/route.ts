import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy route that forwards snake images directly to the local Python ML
 * classifier, bypassing the backend's Cloudinary URL download step.
 *
 * POST /api/identify-snake
 * Body: FormData with a "file" field containing the image
 */
export async function POST(request: NextRequest) {
  const pythonServiceUrl =
    process.env.PYTHON_ML_SERVICE_URL || 'http://localhost:8000';

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 },
      );
    }

    // Forward the file directly to the Python classifier
    const proxyFormData = new FormData();
    proxyFormData.append('file', file);

    const response = await fetch(
      `${pythonServiceUrl.replace(/\/$/, '')}/api/v1/predict`,
      {
        method: 'POST',
        body: proxyFormData,
        signal: AbortSignal.timeout(30000),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Python classifier error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Classification service returned an error', detail: errorText },
        { status: response.status },
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Snake identification proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to classify snake image' },
      { status: 500 },
    );
  }
}
