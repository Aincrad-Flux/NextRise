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
  const onlyParam = (url.searchParams.get('only') || '').toLowerCase();
  const dataParam = (url.searchParams.get('data') || '').toLowerCase();

    // If both provided and different -> 400
    if (onlyParam && dataParam && onlyParam !== dataParam) {
      return NextResponse.json(
        { error: "Les paramètres 'only' et 'data' sont différents" },
        { status: 400 }
      );
    }

    const scopeRaw = dataParam || onlyParam; // data takes precedence if present
    // Accept singular aliases (e.g., user => users, event => events, etc.)
    const aliases = {
      user: 'users',
      event: 'events',
      investor: 'investors',
      partner: 'partners',
      startup: 'startups',
      new: 'news',
    };
    const scope = aliases[scopeRaw] || scopeRaw;
    let result;
    switch (scope) {
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
        return NextResponse.json({ error: "Paramètre 'data' (ou 'only') invalide" }, { status: 400 });
    }
    return NextResponse.json({ ok: true, mode: scope || 'all', result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Erreur inconnue' },
      { status: 500 }
    );
  }
}

