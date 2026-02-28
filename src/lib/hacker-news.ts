import type { HNItem, HNStoryDisplay } from '../types/hacker-news';

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

export async function fetchTopStoryIds(): Promise<number[]> {
  const response = await fetch(`${HN_API_BASE}/topstories.json`);
  if (!response.ok) {
    throw new Error(`HN API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchItem(id: number): Promise<HNItem> {
  const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
  if (!response.ok) {
    throw new Error(`HN item fetch error: ${response.status}`);
  }
  return response.json();
}

export function mapToDisplay(item: HNItem): HNStoryDisplay | null {
  if (!item.url) return null;

  let hostname: string;
  try {
    hostname = new URL(item.url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }

  return {
    id: item.id,
    title: item.title,
    url: item.url,
    hostname,
    score: item.score,
    author: item.by,
    commentsUrl: `https://news.ycombinator.com/item?id=${item.id}`,
  };
}

export async function fetchTopStories(count = 3): Promise<HNStoryDisplay[]> {
  const ids = await fetchTopStoryIds();
  const stories: HNStoryDisplay[] = [];

  // Fetch more than needed to account for items without URLs
  const batchSize = count * 3;
  const batch = ids.slice(0, batchSize);

  const items = await Promise.all(batch.map(fetchItem));

  for (const item of items) {
    if (stories.length >= count) break;
    const display = mapToDisplay(item);
    if (display) stories.push(display);
  }

  return stories;
}
