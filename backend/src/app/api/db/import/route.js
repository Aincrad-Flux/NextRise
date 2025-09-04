// filepath: /Users/pandorian/Delivery/NextRise/backend/src/app/api/db/import/route.js
import { NextResponse } from 'next/server';
import {
  importAll,
  importEvents,
  importInvestors,
  importPartners,
  importNews,
  importStartups,
  importUsers,
} from '@/lib/importIncubator';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const only = (url.searchParams.get('only') || '').toLowerCase();

    let result;
    switch (only) {
      case 'events':
        result = await importEvents();
        break;
      case 'investors':
        result = await importInvestors();
        break;
      case 'partners':
        result = await importPartners();
        break;
      case 'news':
        result = await importNews();
        break;
      case 'startups':
        result = await importStartups();
        break;
      case 'users':
        result = await importUsers();
        break;
      case '':
        result = await importAll();
        break;
      default:
        return NextResponse.json({ error: 'Paramètre only invalide' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Erreur inconnue' },
      { status: 500 }
    );
  }
}

