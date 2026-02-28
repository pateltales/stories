# Managing Your Stories

## Publish a New Story

1. Open your private link in a browser:
   ```
   https://pateltales.github.io/stories/submit.html?k=your-passphrase
   ```
2. Fill in the **Story Title**
3. Write your **story** in the text box — separate paragraphs with a blank line
4. Optionally click the image area to attach a **photo** (JPG, PNG, or WebP, max 5 MB)
5. Click **Publish Story**
6. You'll be redirected to the homepage where your story appears immediately

---

## Edit a Story

1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project → **Table Editor** (left sidebar) → **stories**
3. Click the row for the story you want to edit
4. Update the **title** or **content** fields directly in the table
5. Click **Save** — changes are live instantly, no redeploy needed

---

## Delete a Story

1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project → **Table Editor** (left sidebar) → **stories**
3. Find the story row → click the **checkbox** on the left to select it
4. Click **Delete row** (the trash icon in the toolbar)
5. Confirm — the story is removed from the site immediately

---

## Unpublish (Hide Without Deleting)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project → **Table Editor** → **stories**
3. Find the story row → click the **published** cell
4. Change the value to `false`
5. Click **Save** — the story disappears from the site but is kept in the database

---

## Replace a Story Image

1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project → **Storage** (left sidebar) → **story-images** bucket
3. Upload the new image file
4. Copy its **public URL** from the file details panel
5. Go to **Table Editor → stories**, find the story row, paste the new URL into the **image_url** column
6. Click **Save**
