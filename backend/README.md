This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Import Incubator API → Base de données

Un utilitaire et une route API permettent d’importer les données de l’API "JEB Incubator" (voir `openapi.json`) vers la base (via Supabase REST).

### Variables d’environnement à configurer

- INCUBATOR_API_BASE_URL: URL de base de l’API distante (ex: `https://example.com`)
- INCUBATOR_API_KEY: clé API pour le header `X-Group-Authorization` (si requis)
- SUPABASE_URL: URL de votre instance Supabase
- SUPABASE_ANON_KEY: clé anonyme (requise par le client)
- SUPABASE_SERVICE_ROLE_KEY: clé service role (requise pour `sendRequest`)

Placez-les dans `.env.local` à la racine du dossier `backend/`.

### Endpoint pour déclencher l’import

- POST `/api/db/import` → importe toutes les entités (events, investors, partners, news, startups (+ détails + founders), users)
- POST `/api/db/import?only=events`
- POST `/api/db/import?only=investors`
- POST `/api/db/import?only=partners`
- POST `/api/db/import?only=news`
- POST `/api/db/import?only=startups` (importe la liste, puis enrichit chaque startup par son détail et upsert les fondateurs)
- POST `/api/db/import?only=users`

Réponse JSON: `{ ok: boolean, result: ... }`

### Exemples (cURL)

```bash
# Import complet
curl -X POST http://localhost:3000/api/db/import

# Import ciblé
curl -X POST "http://localhost:3000/api/db/import?only=startups"
```

### Notes d’implémentation

- Le client Incubator (`src/lib/incubatorApi.js`) gère la pagination `skip/limit` selon l’OpenAPI.
- L’import réalise des upserts via PostgREST (header `Prefer: resolution=merge-duplicates` et `on_conflict=id`).
- Tables attendues côté DB: `event`, `investor`, `partner`, `news`, `startup`, `founder`, `user` (colonnes alignées sur `openapi.json`).
- Les détails des startups sont appelés un par un; vous pouvez augmenter les perfs plus tard en parallélisant avec une limite de concurrence.
