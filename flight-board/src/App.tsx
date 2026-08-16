import { useEffect, useState } from 'react'

type Flight = {
  flight: string
  from: string
  to: string
  status: string
}

const COLUMNS: { key: keyof Flight; label: string }[] = [
  { key: 'flight', label: 'Flight' },
  { key: 'from', label: 'From' },
  { key: 'to', label: 'To' },
  { key: 'status', label: 'Status' },
]

// Relative by default so the Vite dev proxy handles it (same-origin, no CORS).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const STATUS_COLORS: Record<string, string> = {
  'ON TIME': '#1a7f37',
  BOARDING: '#0969da',
  DELAYED: '#bc4c00',
  CANCELLED: '#cf222e',
}

function App() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${API_BASE_URL}/flights`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`)
        return res.json()
      })
      .then((data: Flight[]) => {
        setFlights(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>Flight Board</h1>

      {loading && <p style={styles.muted}>Loading flights…</p>}

      {error && (
        <p style={styles.error} role="alert">
          Could not load flights — {error}
        </p>
      )}

      {!loading && !error && flights.length === 0 && (
        <p style={styles.muted}>No flights scheduled.</p>
      )}

      {!loading && !error && flights.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} style={styles.th}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.flight}>
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    style={
                      col.key === 'status'
                        ? { ...styles.td, color: STATUS_COLORS[flight.status] ?? 'inherit', fontWeight: 600 }
                        : styles.td
                    }
                  >
                    {flight[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '2rem 1rem',
    textAlign: 'left',
    fontFamily: 'system-ui, sans-serif',
  },
  heading: { fontSize: '1.75rem', marginBottom: '1.25rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    padding: '0.6rem 0.75rem',
    borderBottom: '2px solid #d0d7de',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    opacity: 0.7,
  },
  td: { padding: '0.6rem 0.75rem', borderBottom: '1px solid #d0d7de' },
  muted: { opacity: 0.7 },
  error: { color: '#cf222e' },
}

export default App
