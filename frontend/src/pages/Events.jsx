import { useMemo, useState } from 'react'
import TopBar from '../components/TopBar.jsx'
import './Home.css'
import './Events.css'
import eventsByDate from '../data/eventsData.js'

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

function EventsListCard({ date }) {
    const iso = formatISO(date)
    const items = eventsByDate[iso] || []
    const readable = date.toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
    })

    return (
        <aside className="events-card">
            <header>
                <h3>Événements — {readable}</h3>
            </header>
            {items.length === 0 ? (
                <p className="event-empty">Aucun événement ce jour.</p>
            ) : (
                <div className="events-list">
                    {items.map(ev => (
                        <div key={ev.id} className="event-item">
                            <h4>{ev.title}</h4>
                            <div className="meta">
                                <span>{ev.time}</span>
                                <span>{ev.location}</span>
                            </div>
                            {ev.tags?.length > 0 && (
                                <div style={{ marginTop: '.35rem' }}>
                                    {ev.tags.map(t => (
                                        <span key={t} className="event-chip">{t}</span>
                                    ))}
                                </div>
                            )}
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

    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(viewDate)
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const cells = useMemo(() => monthMatrix(year, month), [year, month])

    const goPrev = () => setViewDate(new Date(year, month - 1, 1))
    const goNext = () => setViewDate(new Date(year, month + 1, 1))
    const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))

        return (
            <div className="home-container events-rose">
                <TopBar />
                <main className="home-main constrained" style={{ padding: '2rem' }}>
                    <div className="events-layout">
                        <section className="calendar-card">
                            <div className="calendar-container">
                                <div className="calendar-header">
                                    <div className="nav">
                                        <button className="button" onClick={goPrev} aria-label="Mois précédent">◀</button>
                                        <button className="button" onClick={goToday}>Aujourd'hui</button>
                                        <button className="button" onClick={goNext} aria-label="Mois suivant">▶</button>
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
                                                title={dayEvents.length ? `${dayEvents.length} événement(s)` : 'Aucun événement'}
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

                        <EventsListCard date={selectedDate} />
                    </div>
                </main>
            </div>
        )
}
