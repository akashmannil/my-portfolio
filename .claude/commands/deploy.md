# /project:deploy

Build and prepare the portfolio for production deployment.

## Steps

1. **Check environment** — confirm `.env` is present and all `VITE_APP_EMAILJS_*` vars are set
2. **Lint** — `npm run lint` must pass with zero errors
3. **Build** — `npm run build`
4. **Preview** — `npm run preview` and manually verify:
   - Hero 3D model loads
   - Scroll animations trigger correctly
   - Contact form submits without console errors
   - All section links in the navbar resolve
5. **Deploy `dist/`** — upload to your hosting provider (Vercel / Netlify / GitHub Pages)

## Vercel (recommended)

```bash
npx vercel --prod
```

Set the following in the Vercel dashboard under Project → Settings → Environment Variables:

```
VITE_APP_EMAILJS_SERVICE_ID
VITE_APP_EMAILJS_TEMPLATE_ID
VITE_APP_EMAILJS_PUBLIC_KEY
```

## Netlify

Drag and drop the `dist/` folder into the Netlify dashboard, or use:

```bash
npx netlify deploy --prod --dir=dist
```

## Post-deploy checklist

- [ ] Hero section 3D model renders on mobile
- [ ] Contact form sends a test email
- [ ] Resume download link works
- [ ] All external project links open correctly
