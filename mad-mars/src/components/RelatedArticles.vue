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
  gap: $space-md;

  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(lg) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card {
  padding: $space-lg;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  background: #fff;
  transition: box-shadow $transition-base, transform $transition-base;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  @include reduced-motion {
    transition: none;
    &:hover {
      transform: none;
    }
  }
}

.card-title {
  font-size: $font-size-base;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  color: $color-navy;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: $color-accent;
    }
  }
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: $font-size-xs;
  color: $color-text-light;
  margin-bottom: 0.75rem;
}

.card-hostname {
  padding: $space-xs $space-sm;
  background: $color-bg-alt;
  border-radius: $radius-full;
}

.card-comments {
  font-size: $font-size-sm;
  font-weight: 500;
  color: $color-accent;
  text-decoration: none;
  transition: color $transition-fast;

  &:hover {
    color: $color-accent-dark;
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
  border-radius: $radius-sm;
  background: linear-gradient(
    90deg,
    $color-skeleton 25%,
    $color-bg-alt 50%,
    $color-skeleton 75%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;

  @include reduced-motion {
    animation: none;
  }
}

.skeleton-title {
  height: $font-size-base;
  width: 80%;
  margin-bottom: 0.75rem;
}

.skeleton-meta {
  height: $font-size-xs;
  width: 50%;
  margin-bottom: 0.75rem;
}

.skeleton-score {
  height: $font-size-sm;
  width: 30%;
}

@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* State cards */
.state-card {
  text-align: center;
  padding: $space-xl;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  background: #fff;
}

.state-icon {
  font-size: $font-size-3xl;
  display: block;
  margin-bottom: $space-md;
}

.error-card p {
  color: $color-error;
  margin-bottom: $space-md;
}

.retry-btn {
  padding: $space-sm $space-lg;
  border: 1px solid $color-accent;
  border-radius: $radius-md;
  background: transparent;
  color: $color-accent;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: $color-accent;
    color: #fff;
  }

  &:focus-visible {
    @include focus-ring;
  }
}

.hn-link {
  display: inline-block;
  margin-top: $space-sm;
  color: $color-accent;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: $color-accent-dark;
  }
}
</style>
