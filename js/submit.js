/**
 * PatelTales — Private Admin Submission Page
 *
 * Security model:
 *   1. Page checks URL param ?k= against a SHA-256 hash stored in config.js
 *   2. If the URL key matches → form unlocks automatically (no password typing needed)
 *   3. If URL key is missing/wrong → a gate overlay asks for the key manually
 *   4. The raw passphrase is NEVER stored; only its hash lives in config.js
 */

const supabaseClient = supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

let isAuthenticated = false;
let selectedFile    = null;

// ── Key hashing ──────────────────────────────────────────────────────────────

async function sha256(text) {
  const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyKey(key) {
  if (!key) return false;
  const hash = await sha256(key);
  return hash === CONFIG.adminKeyHash;
}

// ── Auth gate ────────────────────────────────────────────────────────────────

function unlock() {
  document.getElementById('gate-overlay').style.display = 'none';
  isAuthenticated = true;
}

// Auto-check URL key on page load
(async () => {
  const urlKey = new URLSearchParams(window.location.search).get('k');
  if (await verifyKey(urlKey)) {
    unlock();
    return;
  }
  // Show the gate overlay if URL key is absent or wrong
  document.getElementById('gate-overlay').style.display = 'flex';
})();

// Manual gate: Enter key or button click
document.getElementById('gate-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') attemptGateUnlock();
});

async function attemptGateUnlock() {
  const input    = document.getElementById('gate-input').value.trim();
  const $error   = document.getElementById('gate-error');

  if (await verifyKey(input)) {
    unlock();
  } else {
    $error.textContent = 'Incorrect key. Please try again.';
    document.getElementById('gate-input').value = '';
    setTimeout(() => { $error.textContent = ''; }, 3500);
  }
}

// Expose for onclick attribute
window.attemptGateUnlock = attemptGateUnlock;

// ── Image selection ───────────────────────────────────────────────────────────

const $imageInput   = document.getElementById('image-input');
const $uploadArea   = document.getElementById('upload-area');
const $imagePreview = document.getElementById('image-preview');
const $uploadHolder = document.getElementById('upload-placeholder');

$imageInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showMessage('Image must be under 5 MB.', 'error');
    return;
  }
  selectedFile = file;
  showImagePreview(URL.createObjectURL(file));
});

function showImagePreview(url) {
  $imagePreview.src           = url;
  $imagePreview.style.display = 'block';
  $uploadHolder.style.display = 'none';
  $uploadArea.classList.add('has-image');
}

// Drag & drop
$uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  $uploadArea.style.borderColor = 'var(--crimson)';
});
$uploadArea.addEventListener('dragleave', () => {
  $uploadArea.style.borderColor = '';
});
$uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  $uploadArea.style.borderColor = '';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    $imageInput.files = e.dataTransfer.files;
    $imageInput.dispatchEvent(new Event('change'));
  }
});

// ── UI helpers ────────────────────────────────────────────────────────────────

function showMessage(text, type) {
  const $el = document.getElementById('submit-message');
  $el.textContent  = text;
  $el.className    = `submit-message ${type} visible`;
}

function setSubmitting(loading) {
  const $btn      = document.getElementById('submit-btn');
  $btn.disabled   = loading;
  $btn.textContent = loading ? 'Publishing…' : 'Publish Story';
}

// ── Form submission ───────────────────────────────────────────────────────────

document.getElementById('story-form').addEventListener('submit', async e => {
  e.preventDefault();
  if (!isAuthenticated) { showMessage('Authentication required.', 'error'); return; }

  const title   = document.getElementById('story-title').value.trim();
  const content = document.getElementById('story-content').value.trim();

  if (!title || !content) {
    showMessage('Please fill in both the title and the story.', 'error');
    return;
  }

  setSubmitting(true);

  try {
    // 1. Upload image (if provided)
    let imageUrl = null;
    if (selectedFile) {
      const ext      = selectedFile.name.split('.').pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadErr } = await supabaseClient.storage
        .from(CONFIG.storageBucket)
        .upload(fileName, selectedFile, { contentType: selectedFile.type });

      if (uploadErr) throw new Error(`Image upload failed: ${uploadErr.message}`);

      const { data: urlData } = supabaseClient.storage
        .from(CONFIG.storageBucket)
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    // 2. Insert story row
    const { error: insertErr } = await supabaseClient
      .from('stories')
      .insert({ title, content, image_url: imageUrl, published: true });

    if (insertErr) throw new Error(`Could not save story: ${insertErr.message}`);

    // 3. Success
    showMessage('Story published! Taking you back to the collection…', 'success');
    e.target.reset();
    $imagePreview.style.display = 'none';
    $uploadHolder.style.display = 'block';
    $uploadArea.classList.remove('has-image');
    selectedFile = null;

    setTimeout(() => { window.location.href = 'index.html'; }, 2800);

  } catch (err) {
    showMessage(err.message || 'Something went wrong. Please try again.', 'error');
    console.error('[PatelTales] Submission error:', err);
  } finally {
    setSubmitting(false);
  }
});
