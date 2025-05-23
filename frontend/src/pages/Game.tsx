import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

function Game() {
  const { user } = useAuthStore()

  // Если пользователь не авторизован, перенаправляем на вход
  if (!user) {
    return (
      <div className="App">
        <header className="header">
          <div className="container">
            <Link to="/" className="logo">
              Vibeton Game
            </Link>
          </div>
        </header>
        <div className="game-container">
          <div className="game-placeholder">
            <h2>Требуется вход</h2>
            <p>Для игры необходимо войти в систему</p>
            <Link to="/create-player" className="btn" style={{ fontSize: '1.2rem' }}>
              Войти в игру
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            Vibeton Game
          </Link>
          <nav className="nav">
            <span style={{ marginRight: '1rem' }}>Игрок: {user.username}</span>
            <Link to="/" className="btn btn-secondary">
              Главная
            </Link>
          </nav>
        </div>
      </header>

      <div className="game-container">
        <div className="game-placeholder">
          <h2>🎮 Игра готовится к запуску</h2>
          <p>
            Добро пожаловать в Vibeton Game, {user.username}!
          </p>
          
          <div style={{
            background: 'var(--card-bg)',
            border: '3px dashed var(--primary-color)',
            borderRadius: '12px',
            padding: '6rem 2rem',
            margin: '2rem 0',
            color: 'var(--primary-color)',
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            <div>🚧 ИГРОВАЯ ЗОНА 🚧</div>
            <div style={{ fontSize: '1.1rem', marginTop: '1rem', color: '#666', fontWeight: 'normal' }}>
              Здесь будет располагаться PixiJS игра
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Link to="/" className="btn" style={{ fontSize: '1.1rem' }}>
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game 