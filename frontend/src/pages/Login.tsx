import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

function CreatePlayer() {
  const [username, setUsername] = useState('')
  const { createPlayer, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (!username.trim()) {
      return
    }

    try {
      await createPlayer(username.trim())
      navigate('/')
    } catch (error) {
      console.error('Failed to create player:', error)
    }
  }

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            Vibeton Game
          </Link>
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
            maxWidth: '400px', 
            margin: '0 auto' 
          }}>
            <h2 style={{ 
              textAlign: 'center', 
              marginBottom: '2rem',
              color: 'var(--primary-color)',
              fontSize: '2rem'
            }}>
              Вход в игру
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Имя игрока:</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите ваше имя"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !username.trim()}
                className="btn"
                style={{ width: '100%', fontSize: '1.1rem' }}
              >
                {isLoading ? 'Подключение...' : 'Войти в игру'}
              </button>
            </form>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '1.5rem' 
            }}>
              <Link to="/" style={{ 
                color: 'var(--primary-color)',
                textDecoration: 'none'
              }}>
                ← Назад
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreatePlayer 