/**
 * PatelTales — Homepage
 * Fetches all published stories from Supabase and renders the editorial grid.
 */

const supabaseClient = supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function excerpt(text, max = 200) {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  return flat.slice(0, max).replace(/\s\S*$/, '') + '\u2026';
}

function goToStory(id) {
  window.location.href = `story.html?id=${encodeURIComponent(id)}`;
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderFeatured(story) {
  const img = story.image_url
    ? `<img class="featured-image" src="${story.image_url}" alt="${story.title}" loading="eager">`
    : `<div class="featured-image-placeholder"><span style="letter-spacing:.1em">No image</span></div>`;

  document.getElementById('featured-story').innerHTML = `
    <div class="featured-story" onclick="goToStory('${story.id}')" role="article" tabindex="0"
         onkeydown="if(event.key==='Enter')goToStory('${story.id}')">
      ${img}
      <div class="featured-body">
        <p class="story-category">Featured</p>
        <h2 class="featured-title">${story.title}</h2>
        <p class="featured-excerpt">${excerpt(story.content)}</p>
        <p class="story-meta">${formatDate(story.created_at)}</p>
        <span class="read-more">Read Story <span>→</span></span>
      </div>
    </div>
  `;
}

function renderGrid(stories) {
  if (!stories.length) return;
  document.getElementById('more-label').style.display = 'block';

  document.getElementById('story-grid').innerHTML = stories.map(s => {
    const img = s.image_url
      ? `<img class="card-image" src="${s.image_url}" alt="${s.title}" loading="lazy">`
      : `<div class="card-image-placeholder"></div>`;
    return `
      <div class="story-card" onclick="goToStory('${s.id}')" role="article" tabindex="0"
           onkeydown="if(event.key==='Enter')goToStory('${s.id}')">
        ${img}
        <div class="card-body">
          <h3 class="card-title">${s.title}</h3>
          <p class="card-excerpt">${excerpt(s.content, 130)}</p>
          <p class="story-meta">${formatDate(s.created_at)}</p>
        </div>
      </div>
    `;
  }).join('');
}

// ── Load ──────────────────────────────────────────────────────────────────────

async function loadStories() {
  const $loading   = document.getElementById('loading');
  const $container = document.getElementById('stories-container');
  const $empty     = document.getElementById('empty-state');
  const $error     = document.getElementById('error-state');

  try {
    const { data, error } = await supabaseClient
      .from('stories')
      .select('id, title, content, image_url, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    $loading.style.display = 'none';

    if (!data || data.length === 0) {
      $empty.style.display = 'block';
      return;
    }

    $container.style.display = 'block';
    renderFeatured(data[0]);
    renderGrid(data.slice(1));

  } catch (err) {
    $loading.style.display = 'none';
    $error.style.display = 'block';
    console.error('[PatelTales] Failed to load stories:', err);
  }
}

loadStories();
