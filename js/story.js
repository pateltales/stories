/**
 * PatelTales — Story Page
 * Reads ?id= from the URL and fetches that story from Supabase.
 */

const supabaseClient = supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

/**
 * Converts plain text to HTML paragraphs.
 * Double newlines → paragraph breaks. Single newlines → <br>.
 */
function toHtml(text) {
  return text
    .split(/\n\s*\n/)
    .filter(p => p.trim())
    .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');
}

async function loadStory() {
  const $loading   = document.getElementById('loading');
  const $container = document.getElementById('story-container');
  const $error     = document.getElementById('error-state');

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    $loading.style.display = 'none';
    $error.style.display = 'flex';
    return;
  }

  try {
    const { data: story, error } = await supabaseClient
      .from('stories')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .maybeSingle();

    $loading.style.display = 'none';

    if (error || !story) {
      $error.style.display = 'flex';
      return;
    }

    // Update meta
    document.title = `${story.title} — PatelTales`;

    // Populate header
    document.getElementById('story-title').textContent = story.title;
    document.getElementById('story-date').textContent  = formatDate(story.created_at);

    // Feature image (optional)
    if (story.image_url) {
      const img = document.getElementById('story-image');
      img.src   = story.image_url;
      img.alt   = story.title;
      img.style.display = 'block';
    }

    // Body
    document.getElementById('story-content').innerHTML = toHtml(story.content);

    $container.style.display = 'block';

  } catch (err) {
    $loading.style.display = 'none';
    $error.style.display = 'flex';
    console.error('[PatelTales] Failed to load story:', err);
  }
}

loadStory();
