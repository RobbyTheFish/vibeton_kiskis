import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

function Home() {
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
              <>
                <span style={{ marginRight: '1rem' }}>Игрок: {user.username}</span>
                <Link to="/game" className="btn">
                  Играть
                </Link>
              </>
            ) : (
              <Link to="/create-player" className="btn">
                Войти в игру
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '2rem 0'
      }}>
        <div className="container">
          <div className="card" style={{ 
            textAlign: 'center', 
            maxWidth: '500px', 
            margin: '0 auto' 
          }}>
            {user ? (
              <div>
                <h1 style={{ 
                  fontSize: '2.5rem', 
                  marginBottom: '1rem', 
                  color: 'var(--primary-color)' 
                }}>
                  Добро пожаловать, {user.username}!
                </h1>
                <p style={{ 
                  fontSize: '1.1rem', 
                  marginBottom: '2rem', 
                  color: '#666' 
                }}>
                  Готовы к игре?
                </p>
                <Link 
                  to="/game" 
                  className="btn" 
                  style={{ 
                    fontSize: '1.3rem', 
                    padding: '16px 32px',
                    marginBottom: '2rem',
                    display: 'inline-block'
                  }}
                >
                  Начать игру
                </Link>
                <div style={{ 
                  marginTop: '2rem',
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <p><strong>Уровень:</strong> {user.level}</p>
                  <p><strong>Очки:</strong> {user.score}</p>
                </div>
              </div>
            ) : (
              <div>
                <h1 style={{ 
                  fontSize: '2.5rem', 
                  marginBottom: '1rem', 
                  color: 'var(--primary-color)' 
                }}>
                  Vibeton Game
                </h1>
                <p style={{ 
                  fontSize: '1.1rem', 
                  marginBottom: '2rem', 
                  color: '#666' 
                }}>
                  Введите имя игрока для начала
                </p>
                <Link 
                  to="/create-player" 
                  className="btn" 
                  style={{ 
                    fontSize: '1.3rem', 
                    padding: '16px 32px' 
                  }}
                >
                  Войти в игру
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home 