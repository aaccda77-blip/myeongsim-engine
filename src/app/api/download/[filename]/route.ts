import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  const allowed = [
    'app_icon_512.png',
    'feature_graphic_1024x500.png',
    'screenshot_1.png',
    'screenshot_2.png',
    'screenshot_3.png',
    'myeongsim-release.apk',
    'myeongsim-release.aab',
    'google_play_assets.zip'
  ];

  if (!allowed.includes(filename)) {
    return new NextResponse('File not found', { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'public', 'store-assets', filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found on server', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const contentType = filename.endsWith('.png')
    ? 'image/png'
    : filename.endsWith('.zip')
    ? 'application/zip'
    : 'application/octet-stream';

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
