<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchTopStories } from '../lib/hacker-news';
import type { HNStoryDisplay } from '../types/hacker-news';

type State = 'loading' | 'error' | 'empty' | 'success';

const stories = ref<HNStoryDisplay[]>([]);
const state = ref<State>('loading');

async function loadStories() {
  state.value = 'loading';
  try {
    const data = await fetchTopStories(3);
    if (data.length === 0) {
      state.value = 'empty';
    } else {
      stories.value = data;
      state.value = 'success';
    }
  } catch {
    state.value = 'error';
  }
}

onMounted(() => {
  loadStories();
});
</script>

<template>
  <div class="related-articles" :aria-busy="state === 'loading'">
    <!-- Loading: skeleton cards -->
    <div v-if="state === 'loading'" class="cards-grid">
      <div v-for="n in 3" :key="n" class="card skeleton-card" aria-hidden="true">
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-meta"></div>
        <div class="skeleton-line skeleton-score"></div>
      </div>
      <p class="sr-only">Artikel werden geladen…</p>
    </div>

    <!-- Error state -->
    <div v-else-if="state === 'error'" class="state-card error-card" role="alert">
      <span class="state-icon" aria-hidden="true">⚠️</span>
      <p>Artikel konnten nicht geladen werden.</p>
      <button class="retry-btn" @click="loadStories">
        Erneut versuchen
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="state === 'empty'" class="state-card empty-card">
      <span class="state-icon" aria-hidden="true">📭</span>
      <p>Aktuell keine Artikel verfügbar.</p>
      <a
        href="https://news.ycombinator.com"
        class="hn-link"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hacker News besuchen (öffnet in neuem Tab)"
      >
        Hacker News besuchen →
      </a>
    </div>

    <!-- Success: story cards -->
    <div v-else class="cards-grid">
      <article v-for="story in stories" :key="story.id" class="card story-card">
        <h3 class="card-title">
          <a
            :href="story.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${story.title} auf ${story.hostname} (öffnet in neuem Tab)`"
          >
            {{ story.title }}
          </a>
        </h3>
        <div class="card-meta">
          <span class="card-hostname">{{ story.hostname }}</span>
          <span class="card-score">{{ story.score }} Punkte</span>
        </div>
        <a
          :href="story.commentsUrl"
          class="card-comments"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Kommentare zu ${story.title} auf Hacker News (öffnet in neuem Tab)`"
        >
          Diskussion →
        </a>
      </article>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.related-articles {
  width: 100%;
}

.cards-grid {
  display: grid;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  padding: 1.5rem;
  border: 1px solid #e0e0e8;
  border-radius: 12px;
  background: #fff;
  transition: box-shadow 250ms ease, transform 250ms ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  color: #1a1a2e;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: #e94560;
    }
  }
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #6b6b80;
  margin-bottom: 0.75rem;
}

.card-hostname {
  padding: 0.125rem 0.5rem;
  background: #f0f0f5;
  border-radius: 9999px;
}

.card-comments {
  font-size: 0.875rem;
  font-weight: 500;
  color: #e94560;
  text-decoration: none;
  transition: color 150ms ease;

  &:hover {
    color: #c73a52;
  }
}

/* Skeleton */
.skeleton-card {
  &:hover {
    box-shadow: none;
    transform: none;
  }
}

.skeleton-line {
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    #e8e8ee 25%,
    #f0f0f5 50%,
    #e8e8ee 75%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

.skeleton-title {
  height: 1rem;
  width: 80%;
  margin-bottom: 0.75rem;
}

.skeleton-meta {
  height: 0.75rem;
  width: 50%;
  margin-bottom: 0.75rem;
}

.skeleton-score {
  height: 0.875rem;
  width: 30%;
}

@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* State cards */
.state-card {
  text-align: center;
  padding: 2rem;
  border: 1px solid #e0e0e8;
  border-radius: 12px;
  background: #fff;
}

.state-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

.error-card p {
  color: #d93025;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.5rem 1.5rem;
  border: 1px solid #e94560;
  border-radius: 8px;
  background: transparent;
  color: #e94560;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: #e94560;
    color: #fff;
  }

  &:focus-visible {
    outline: 2px solid #e94560;
    outline-offset: 2px;
  }
}

.hn-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: #e94560;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #c73a52;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
