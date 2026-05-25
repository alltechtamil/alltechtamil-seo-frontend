import { envConfig } from '@/config/env.config';

export const SEO_CONSTANTS = {
    sameAs: [
        'https://www.instagram.com/all_tech_tamil',
        'https://twitter.com/all_tech_tamil'
    ],
    defaultKeywords: [
        'Tamil tech news',
        'ChatGPT prompts Tamil',
        'AI image prompts Tamil',
        'AI tutorials Tamil',
        'gadget reviews Tamil'
    ],
    defaultDescription: 'Stay ahead with All Tech Tamil: daily Tamil‑language tech news, expert ChatGPT text/image prompts, AI & ML tutorials, and gadget reviews.',
    defaultTitle: 'All Tech Tamil – Tamil Tech News, ChatGPT & AI Image Prompts',
    defaultLogo: `${(envConfig.siteUrl || 'https://www.alltechtamil.in/').replace(/\/$/, '')}/favicon-96x96.png`
};
