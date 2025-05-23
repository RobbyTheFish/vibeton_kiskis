# Vibeton Game - Веб-игра

Полнофункциональный шаблон веб-игры с современным технологическим стеком.

## Технологический стек

### Backend
- **FastAPI** - современный веб-фреймворк для Python
- **MongoDB** - NoSQL база данных
- **WebSockets** - для real-time коммуникации
- **JWT** - аутентификация
- **Pydantic** - валидация данных

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - типизированный JavaScript
- **Vite** - быстрый сборщик
- **PixiJS** - 2D WebGL рендеринг для игр
- **Zustand** - управление состоянием
- **React Router** - маршрутизация

### Инфраструктура
- **Docker Compose** - оркестрация контейнеров
- **Nginx** - reverse proxy и load balancer
- **MongoDB** - база данных с репликацией

## Структура проекта

```
vibeton_kiskis/
├── backend/                 # FastAPI backend
│   ├── models/             # Pydantic модели
│   ├── routers/            # API роутеры
│   ├── services/           # Бизнес-логика
│   ├── main.py             # Точка входа
│   ├── database.py         # Подключение к БД
│   ├── requirements.txt    # Python зависимости
│   └── Dockerfile          # Docker образ
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы приложения
│   │   ├── stores/         # Zustand stores
│   │   ├── services/       # API сервисы
│   │   └── game/           # PixiJS игровой движок
│   ├── package.json        # Node.js зависимости
│   └── Dockerfile          # Docker образ
├── nginx/                  # Nginx конфигурация
│   ├── nginx.conf          # Основная конфигурация
│   └── default.conf        # Виртуальный хост
└── docker-compose.yml      # Оркестрация сервисов
```

## Быстрый старт

### Предварительные требования
- Docker и Docker Compose
- Git

### Запуск проекта

1. **Клонируйте репозиторий:**
```bash
git clone <repository-url>
cd vibeton_kiskis
```

2. **Запустите все сервисы:**
```bash
docker-compose up --build
```

3. **Откройте браузер:**
- Приложение: http://localhost
- API документация: http://localhost/api/docs
- MongoDB: localhost:27017

### Первый запуск

При первом запуске:
1. Перейдите на http://localhost
2. Нажмите "Register" для создания аккаунта
3. Заполните форму регистрации
4. После входа нажмите "Start Playing"

## Разработка

### Backend разработка

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend разработка

```bash
cd frontend
npm install
npm run dev
```

### База данных

MongoDB доступна на порту 27017:
- Пользователь: `admin`
- Пароль: `password123`
- База данных: `vibeton_game`

## API Endpoints

### Аутентификация
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход
- `GET /auth/me` - Текущий пользователь

### Игроки
- `GET /players/` - Список игроков
- `GET /players/{id}` - Игрок по ID
- `PUT /players/{id}` - Обновить игрока
- `GET /players/leaderboard/top` - Топ игроков

### Игры
- `POST /game/` - Создать игру
- `GET /game/` - Список игр
- `GET /game/{id}` - Игра по ID
- `POST /game/{id}/join` - Присоединиться к игре
- `POST /game/{id}/start` - Начать игру

### WebSocket
- `WS /ws/{player_id}` - Real-time соединение

## Игровые возможности

### Управление
- **WASD** - движение персонажа
- **Пробел** - действие
- **Мышь** - взаимодействие с объектами

### Функции
- Регистрация и аутентификация игроков
- Real-time мультиплеер через WebSocket
- Система очков и уровней
- Интерактивные игровые объекты
- Таблица лидеров

## Конфигурация

### Переменные окружения

Backend (`backend/.env`):
```env
MONGODB_URL=mongodb://admin:password123@mongodb:27017/vibeton_game?authSource=admin
SECRET_KEY=your-secret-key-change-in-production
DEBUG=true
```

Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

### Настройка производства

1. Измените пароли в `docker-compose.yml`
2. Установите надежный `SECRET_KEY`
3. Настройте SSL сертификаты для Nginx
4. Включите логирование и мониторинг

## Расширение функциональности

### Добавление новых игровых объектов

1. Создайте класс в `frontend/src/game/`
2. Добавьте логику в `GameEngine.ts`
3. Обновите WebSocket обработчики

### Добавление новых API endpoints

1. Создайте роутер в `backend/routers/`
2. Добавьте модели в `backend/models/`
3. Подключите роутер в `main.py`

### Добавление новых страниц

1. Создайте компонент в `frontend/src/pages/`
2. Добавьте роут в `App.tsx`
3. Обновите навигацию

## Производительность

### Оптимизация PixiJS
- Используйте спрайт-атласы для текстур
- Группируйте объекты в контейнеры
- Оптимизируйте количество draw calls

### Оптимизация MongoDB
- Создавайте индексы для часто запрашиваемых полей
- Используйте агрегационные пайплайны
- Настройте репликацию для высокой доступности

## Безопасность

- JWT токены с ограниченным временем жизни
- Валидация всех входных данных
- CORS настройки
- Rate limiting (рекомендуется добавить)
- Шифрование паролей с bcrypt

## Мониторинг

Рекомендуется добавить:
- Логирование (ELK stack)
- Метрики (Prometheus + Grafana)
- Трейсинг (Jaeger)
- Health checks

## Лицензия

MIT License

## Поддержка

Для вопросов и предложений создавайте issues в репозитории.