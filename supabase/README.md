# Enabling AI answers for the Academic Assistant

Without this step, the assistant still runs in **search mode** (showing material excerpts).
With this step, the assistant replies like an AI chat, but **only from the materials in the `knowledge/` folder**.

## A. Fill the knowledge base (no server)
1. Put PDF / PPTX / MD / TXT files in the `knowledge/` folder.
   Name each file **the same as the material id** in `data/resources.js` (e.g. `smartapp-teachers.pdf`)
   so the answers can link back to the material.
2. Run `npm run knowledge`. The result is `data/knowledge.js` (committed too).
3. Scanned PDFs (images) can't be read — they need a text version.

## B. Set up the AI server (one time only)
What you need: a Supabase account, and an **API key** from the AI provider of your choice
(OpenAI, Gemini, etc. — anything that supports the *chat/completions* format).

1. Install the Supabase CLI, then `supabase login` and `supabase link --project-ref <project-ref>`.
2. Store the secrets (type them yourself in the terminal; don't paste them in chat or in the code):
   ```
   supabase secrets set LLM_API_KEY=<api-key> LLM_MODEL=<model-name> \
     LLM_BASE_URL=<provider-api-url> ALLOWED_ORIGIN=https://agnesgocode.github.io
   ```
   `LLM_BASE_URL` can be left empty for OpenAI. For other providers, see their
   "OpenAI-compatible" documentation.
3. Deploy: `supabase functions deploy ask`
   (add `--no-verify-jwt` if the site doesn't use Supabase login yet).
4. Fill in the `endpoint` in `assets/assistant.js`:
   `https://<project-ref>.supabase.co/functions/v1/ask`

## Security — read this
- The AI server address is public. Anyone who knows it can use your AI quota.
  So: **set a monthly cost limit with your AI provider**, and this function already limits
  20 questions / 5 minutes per IP (rough, not a substitute for login).
- Real protection = Supabase login (planned for the next phase): once login exists,
  deploy without `--no-verify-jwt` and fill the `key` in `ASSISTANT_CONFIG` with the user's token.
- The API key only lives in Supabase secrets, never on the web.