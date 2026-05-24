/**
 * Centralized Next.js frontend environment variables configuration.
 */
export const envConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "AllTechTamil",
  cdnBase: process.env.NEXT_PUBLIC_CDN_BASE || "https://cdn.jsdelivr.net/gh/alltechtamil/blog-images@main",
  revalidateSecret: process.env.REVALIDATE_SECRET || "your_revalidate_secret_token",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX",
  instagramProfile: 'https://www.instagram.com/all_tech_tamil',
  twitterProfile: 'https://twitter.com/all_tech_tamil'
};
