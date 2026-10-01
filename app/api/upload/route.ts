import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { getCurrentDbUser } from '@/lib/actions/user.actions';

export async function POST(req: Request) {
  try {
    const user = await getCurrentDbUser();
    if (!user) {
      console.error('Upload Error: Unauthorized User');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      console.error('Upload Error: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Upload Error: Missing Cloudinary Environment Variables in .env.local');
      return NextResponse.json({ error: 'Server missing Cloudinary config' }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'campus-find' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Stream Error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    return NextResponse.json(uploadResult, { status: 200 });
  } catch (error: any) {
    console.error('Upload API catch block error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
