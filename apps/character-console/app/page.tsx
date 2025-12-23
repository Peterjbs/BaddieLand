export default function Home() {
  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>Welcome to BaddieLand Character Console</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        This admin console allows you to manage characters, generate sprites, and create assets for the BaddieLand RPG.
      </p>
      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Available Tools</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li>
            <a href="/character-editor" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
              → Character Editor
            </a>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Create and edit character data, generate sprites and avatars
            </p>
          </li>
        </ul>
      </div>
    </div>
  )
}
