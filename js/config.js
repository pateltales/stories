/**
 * PatelTales Stories — Configuration
 * ====================================
 * Fill in your Supabase credentials below.
 * See SETUP.md for step-by-step instructions.
 *
 * ⚠️  If your GitHub repo is PUBLIC, do NOT commit your real adminKeyHash
 *     in a way that reveals your plain-text key. The hash is safe to commit;
 *     your actual passphrase never appears here.
 */
const CONFIG = {

  // ── Supabase ─────────────────────────────────────────────────────────────
  // Find these at: https://app.supabase.com → Your Project → Settings → API
  supabaseUrl: 'https://gxipfqrambbherezbcnj.supabase.co',
  supabaseKey: 'sb_publishable_FqoeSj6g9jNmKhNlGS6AWQ_fNtYxJfX',

  // ── Storage ───────────────────────────────────────────────────────────────
  // Name of the Supabase Storage bucket you created for story images
  storageBucket: 'story-images',

  // ── Admin Key (SHA-256 hash of your secret passphrase) ───────────────────
  // Your private submission link will be:
  //   https://stories.pateltales.github.io/submit.html?k=YOUR_PASSPHRASE
  //
  // To generate this hash, open your browser console and run:
  //   crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-passphrase'))
  //     .then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
  //
  // Then paste the result below. The passphrase itself is never stored here.
  adminKeyHash: '0b60d00d7cdccd7c11d7254d640511435422258e26d682e2a1da607b612bd0fc',

};

