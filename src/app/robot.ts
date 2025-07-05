import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: 'Googlebot',
                allow: ['/'],
                disallow: '/private/',
            },
            {
                userAgent: ['Applebot', 'Bingbot'],
                disallow: ['/api/*'],
            },
        ],
        sitemap: 'https://0xxplorer.com.com/sitemap.xml',
    }
}