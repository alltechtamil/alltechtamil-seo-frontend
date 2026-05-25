import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Secret
    const secret = request.headers.get('x-revalidate-secret');
    const expectedSecret = process.env.REVALIDATE_SECRET;

    if (!expectedSecret) {
      console.warn('REVALIDATE_SECRET is not set in environment variables');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { message: 'Invalid revalidation token' },
        { status: 401 }
      );
    }

    // 2. Parse Payload
    const body = await request.json();
    const { type, slug } = body;

    if (!type) {
      return NextResponse.json(
        { message: 'Missing type in payload' },
        { status: 400 }
      );
    }

    // 3. Execute Revalidation Rules
    let pathsRevalidated: string[] = [];

    switch (type) {
      case 'blog':
        if (!slug) throw new Error('Slug is required for blog revalidation');
        revalidatePath(`/blog/${slug}`);
        revalidatePath('/'); // Home page might show this new blog
        pathsRevalidated = [`/blog/${slug}`, '/'];
        break;

      case 'category':
        if (!slug) throw new Error('Slug is required for category revalidation');
        revalidatePath(`/search/category/${slug}`);
        pathsRevalidated = [`/search/category/${slug}`];
        break;

      case 'tag':
        if (!slug) throw new Error('Slug is required for tag revalidation');
        revalidatePath(`/search/tag/${slug}`);
        pathsRevalidated = [`/search/tag/${slug}`];
        break;

      case 'home':
        revalidatePath('/');
        pathsRevalidated = ['/'];
        break;

      default:
        return NextResponse.json(
          { message: `Invalid type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
      paths: pathsRevalidated
    });

  } catch (error: any) {
    console.error('Revalidation error:', error.message);
    return NextResponse.json(
      { message: 'Error revalidating', error: error.message },
      { status: 500 }
    );
  }
}
