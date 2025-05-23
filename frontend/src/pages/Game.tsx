import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import BuildingSlider from '../components/BuildingSlider'

function Game() {
  const { user } = useAuthStore()

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            Vibeton Game
          </Link>
          <nav className="nav">
            {user ? (
              <span style={{ marginRight: '1rem' }}>Игрок: {user.username}</span>
            ) : (
              <span style={{ marginRight: '1rem', opacity: 0.7 }}>Гостевой режим</span>
            )}
            <Link 
              to="/" 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              ← Главная
            </Link>
          </nav>
        </div>
      </header>

      <div style={{
        flex: 1,
        width: '100%',
        height: 'calc(100vh - 80px)', // Высота минус header
        overflow: 'hidden'
      }}>
        <BuildingSlider />
      </div>
    </div>
  )
}

export default Game 