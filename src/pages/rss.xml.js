import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
  const notionPosts = await getCollection('posts');
  const mdxPosts = await getCollection('postsMdx');

  const items = [
    ...notionPosts.map((post) => ({
      title: post.data.properties.bTitle,
      description: post.data.properties.bDescription,
      pubDate: new Date(typeof post.data.properties.bPublished?.start === 'string' ? post.data.properties.bPublished.start : post.data.properties.bPublished?.start || Date.now()),
      link: `/blog/${post.data.properties.bSlug}/`,
    })),
    ...mdxPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.published),
      link: `/blog/${post.data.slug}/`,
    })),
  ].sort((a, b) => b.pubDate - a.pubDate);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
  });
}
