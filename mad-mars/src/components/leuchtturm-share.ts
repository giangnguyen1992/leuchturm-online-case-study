class LeuchtturmShare extends HTMLElement {
  static observedAttributes = ['article-title', 'article-url'];

  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private get articleTitle(): string {
    return this.getAttribute('article-title') ?? document.title;
  }

  private get articleUrl(): string {
    return this.getAttribute('article-url') ?? window.location.href;
  }

  private render() {
    const title = this.articleTitle;
    const url = this.articleUrl;
    const hasShareApi = typeof navigator !== 'undefined' && 'share' in navigator;
    const hasClipboard = typeof navigator !== 'undefined' && 'clipboard' in navigator;

    const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`;
    const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .share-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .share-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1rem;
          border: 1px solid var(--share-border, #e0e0e8);
          border-radius: 8px;
          background: var(--share-bg, #fff);
          color: var(--share-color, #2d2d3a);
          font: inherit;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 150ms ease;
          text-decoration: none;
          line-height: 1.4;
        }

        .share-btn:hover {
          border-color: var(--share-accent, #e94560);
          color: var(--share-accent, #e94560);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .share-btn:focus-visible {
          outline: 2px solid var(--share-accent, #e94560);
          outline-offset: 2px;
        }

        .share-btn .icon {
          font-size: 1.125rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .share-btn[hidden] {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .share-btn {
            transition: none;
          }
        }

        .copy-feedback {
          color: #2d8a56;
          font-weight: 600;
        }
      </style>

      <div class="share-buttons" role="group" aria-label="Teilen-Optionen">
        <button
          class="share-btn share-native"
          aria-label="Artikel teilen"
          ${hasShareApi ? '' : 'hidden'}
        >
          <span class="icon" aria-hidden="true">📤</span>
          Teilen
        </button>

        <button
          class="share-btn share-copy"
          aria-label="Link kopieren"
          ${hasClipboard ? '' : 'hidden'}
        >
          <span class="icon" aria-hidden="true">📋</span>
          <span class="copy-label">Link kopieren</span>
        </button>

        <a
          class="share-btn share-email"
          href="${emailHref}"
          aria-label="Per E-Mail teilen"
        >
          <span class="icon" aria-hidden="true">✉️</span>
          E-Mail
        </a>

        <a
          class="share-btn share-twitter"
          href="${twitterHref}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Auf X teilen (öffnet in neuem Tab)"
        >
          <span class="icon" aria-hidden="true">𝕏</span>
          X / Twitter
        </a>
      </div>

      <div class="copy-status" aria-live="assertive" aria-atomic="true" style="position:absolute;clip:rect(0,0,0,0);width:1px;height:1px;overflow:hidden;"></div>
    `;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    const nativeBtn = this.shadow.querySelector('.share-native') as HTMLButtonElement | null;
    const copyBtn = this.shadow.querySelector('.share-copy') as HTMLButtonElement | null;
    const copyStatus = this.shadow.querySelector('.copy-status') as HTMLElement | null;

    nativeBtn?.addEventListener('click', async () => {
      try {
        await navigator.share({
          title: this.articleTitle,
          url: this.articleUrl,
        });
      } catch (err) {
        if ((err as DOMException).name !== 'AbortError') {
          // User cancelled — not an error
        }
      }
    });

    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(this.articleUrl);
        const label = copyBtn.querySelector('.copy-label');
        if (label) {
          label.textContent = 'Kopiert!';
          label.classList.add('copy-feedback');
          if (copyStatus) {
            copyStatus.textContent = 'Link in die Zwischenablage kopiert';
          }
          setTimeout(() => {
            label.textContent = 'Link kopieren';
            label.classList.remove('copy-feedback');
            if (copyStatus) copyStatus.textContent = '';
          }, 2000);
        }
      } catch {
        // Clipboard not available in this context
      }
    });
  }
}

customElements.define('leuchtturm-share', LeuchtturmShare);
