import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mapToDisplay, fetchTopStories } from '../../src/lib/hacker-news';
import type { HNItem } from '../../src/types/hacker-news';

const mockItem: HNItem = {
  id: 12345,
  title: 'Test Story',
  url: 'https://example.com/article',
  score: 150,
  by: 'testuser',
  time: 1709000000,
  type: 'story',
  descendants: 42,
};

const mockItemNoUrl: HNItem = {
  id: 12346,
  title: 'Ask HN: Something',
  score: 80,
  by: 'askuser',
  time: 1709000100,
  type: 'story',
};

describe('mapToDisplay', () => {
  it('maps an item with URL to display format', () => {
    const result = mapToDisplay(mockItem);
    expect(result).not.toBeNull();
    expect(result!.id).toBe(12345);
    expect(result!.title).toBe('Test Story');
    expect(result!.url).toBe('https://example.com/article');
    expect(result!.hostname).toBe('example.com');
    expect(result!.score).toBe(150);
    expect(result!.author).toBe('testuser');
    expect(result!.commentsUrl).toBe('https://news.ycombinator.com/item?id=12345');
  });

  it('returns null for items without URL', () => {
    expect(mapToDisplay(mockItemNoUrl)).toBeNull();
  });

  it('strips www. from hostname', () => {
    const item = { ...mockItem, url: 'https://www.example.com/page' };
    const result = mapToDisplay(item);
    expect(result!.hostname).toBe('example.com');
  });

  it('returns null for invalid URL', () => {
    const item = { ...mockItem, url: 'not-a-url' };
    expect(mapToDisplay(item)).toBeNull();
  });
});

describe('fetchTopStories', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns filtered stories with URLs', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
      if (url.includes('topstories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([1, 2, 3]),
        });
      }
      // Return items — item 2 has no URL
      const id = Number(url.split('/').pop()?.replace('.json', ''));
      const items: Record<number, HNItem> = {
        1: { ...mockItem, id: 1 },
        2: { ...mockItemNoUrl, id: 2 },
        3: { ...mockItem, id: 3, title: 'Third Story', url: 'https://other.com/post' },
      };
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(items[id]),
      });
    }));

    const stories = await fetchTopStories(2);
    expect(stories).toHaveLength(2);
    expect(stories[0].id).toBe(1);
    expect(stories[1].id).toBe(3);
  });

  it('throws on API error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
    }));

    await expect(fetchTopStories()).rejects.toThrow('HN API error: 503');
  });
});
