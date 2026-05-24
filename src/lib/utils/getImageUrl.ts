import type { BlogListItem } from '@/types/blog.types';
import type { StaticImageData } from 'next/image';
import { NoImage } from '../../../public/images';

/**
 * Extracts the best available image URL from a blog post object.
 * Falls back to a high-quality placeholder if no image is available.
 */
export function getImageUrl(post: BlogListItem | null | undefined): string | StaticImageData {
  if (!post) return NoImage;

  // 1. Try direct OG image URL
  if (post.ogImageUrl) {
    return post.ogImageUrl;
  }

  // 2. Try the first image from the populated relations array (present on full Blog type)
  const anyPost = post as any;
  const images = anyPost.Images || anyPost.images || [];
  if (images.length > 0) {
    const firstImage = images[0];
    if (firstImage.cdnUrl) return firstImage.cdnUrl;
    if (firstImage.url) return firstImage.url;
  }

  return NoImage;
}
