import { useMemo, useState, useEffect } from 'react'
import TopBar from '../components/TopBar.jsx'
import { logger } from '../utils/logger.js'
import Footer from '../components/Footer.jsx'
import './Home.css'
import './Events.css'
// NOTE: Utilisation du proxy Vite: appels directs sur '/api/...'. Suppression API_BASE pour éviter HTTPS/CORS en dev.

function formatISO(date) {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

function monthMatrix(year, month /* 0-based */) {
    // Monday-first calendar grid (6 weeks x 7 days)
    const firstOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const prevMonthDays = new Date(year, month, 0).getDate()

    // 0=Sunday..6=Saturday -> Monday-first index
    const weekdayOfFirst = (firstOfMonth.getDay() + 6) % 7

    const cells = []
    // Leading days from previous month
    for (let i = 0; i < weekdayOfFirst; i++) {
        const day = prevMonthDays - weekdayOfFirst + 1 + i
        const date = new Date(year, month - 1, day)
        cells.push({ date, currentMonth: false })
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d)
        cells.push({ date, currentMonth: true })
    }
    // Trailing days for next month to reach 42 cells
    const total = 42
    let nextDay = 1
    while (cells.length < total) {
        const date = new Date(year, month + 1, nextDay++)
        cells.push({ date, currentMonth: false })
    }
    return cells
}

function EventsListCard({ date, eventsByDate, loading, error }) {
    const iso = formatISO(date)
    const items = eventsByDate[iso] || []
    const readable = date.toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
    })

    return (
        <aside className="events-card">
            <header>
                <h3>Events — {readable}</h3>
            </header>
            {loading && <p className="event-empty">Loading…</p>}
            {!loading && error && <p className="event-empty" style={{color:'var(--danger,crimson)'}}>Error: {error}</p>}
            {!loading && !error && items.length === 0 && (
                <p className="event-empty">No events today.</p>
            )}
            {!loading && !error && items.length > 0 && (
                <div className="events-list">
                    {items.map(ev => (
                        <div key={ev.id} className="event-item">
                            <h4>{ev.name}</h4>
                            <div className="meta">
                                <span>{new Date(ev.dates).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</span>
                                <span>{ev.location}</span>
                            </div>
                            <div style={{ marginTop: '.35rem' }}>
                                {ev.event_type && <span className="event-chip">{ev.event_type}</span>}
                                {ev.target_audience && <span className="event-chip">{ev.target_audience}</span>}
                            </div>
                            {ev.description && <p style={{marginTop:'.4rem', fontSize:'.8rem', lineHeight:1.3}}>{ev.description}</p>}
                        </div>
                    ))}
                </div>
            )}
        </aside>
    )
}

export default function Events() {
    const today = useMemo(() => new Date(), [])
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
    const [selectedDate, setSelectedDate] = useState(today)
    const [eventsByDate, setEventsByDate] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(viewDate)
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const cells = useMemo(() => monthMatrix(year, month), [year, month])

    const goPrev = () => setViewDate(new Date(year, month - 1, 1))
    const goNext = () => setViewDate(new Date(year, month + 1, 1))
    const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))

    useEffect(() => {
        const controller = new AbortController()
        async function load() {
            setLoading(true)
            setError(null)
            try {
                const url = '/api/db/events?select=*'
                logger.info('[Events] Fetch start', { url })
                const res = await fetch(url, { signal: controller.signal })
                if (!res.ok) {
                    const text = await res.text().catch(() => '')
                    throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`.trim())
                }
                const data = await res.json()
                logger.debug('[Events] Raw response', data)
                const table = data.tables || []
                logger.info(`[Events] Fetched events count=${table.length}`)
                const map = {}
                for (const ev of table) {
                    // Normalise any date/time string to YYYY-MM-DD (assumes ev.dates or ev.date)
                    const raw = ev.dates || ev.date || ev.event_date
                    if (!raw) continue
                    const dt = new Date(raw)
                    if (isNaN(dt)) continue
                    const key = formatISO(dt)
                    if (!map[key]) map[key] = []
                    map[key].push(ev)
                }
                logger.debug('[Events] Date keys', Object.keys(map))
                if (table.length) logger.debug('[Events] Sample event', table[0])
                setEventsByDate(map)
            } catch (e) {
                if (e.name !== 'AbortError') {
                    logger.error('[Events] Fetch error', { message: e.message, stack: e.stack })
                    setError(e.message === 'Failed to fetch' ? 'Network connection failed. Check that the backend is running.' : e.message)
                }
            } finally {
                setLoading(false)
                logger.info('[Events] Fetch end')
            }
        }
        load()
        return () => controller.abort()
    }, [])

        return (
            <div className="home-container events-rose">
                <TopBar />
                <main className="home-main constrained" style={{ padding: '2rem' }}>
                    <div className="events-layout">
                        <section className="calendar-card">
                            <div className="calendar-container">
                                <div className="calendar-header">
                                    <div className="nav">
                                        <button className="button" onClick={goPrev} aria-label="Previous month">◀</button>
                                        <button className="button" onClick={goToday}>Today</button>
                                        <button className="button" onClick={goNext} aria-label="Next month">▶</button>
                                    </div>
                                    <h2>{monthLabel}</h2>
                                    <div style={{ width: 100 }} />
                                </div>

                                <div className="calendar-grid">
                                    {weekdays.map((w) => (
                                        <div key={w} className="weekday">{w}</div>
                                    ))}
                                    {cells.map(({ date, currentMonth }, idx) => {
                                        const iso = formatISO(date)
                                        const dayEvents = eventsByDate[iso] || []
                                        const isToday = formatISO(date) === formatISO(today)
                                        return (
                                            <button
                                                key={idx}
                                                className={`day-cell ${currentMonth ? '' : 'outside'}`}
                                                onClick={() => { setSelectedDate(date) }}
                                                title={dayEvents.length ? `${dayEvents.length} event(s)` : 'No event'}
                                            >
                                                <div className="day-number" style={{ fontWeight: isToday ? 700 : 500 }}>
                                                    {date.getDate()}
                                                </div>
                                                {isToday && <span className="today-ring" />}
                                                {dayEvents.length > 0 && <span className="event-dot" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </section>

                        <EventsListCard date={selectedDate} eventsByDate={eventsByDate} loading={loading} error={error} />
                    </div>
                </main>
                <Footer />
            </div>
        )
}
