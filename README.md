# ONDA Studio

Независимая digital-студия и интерактивная витрина концептуальных сайтов.

## Публикация

Публичный сайт: **https://winchestersdc79-hub.github.io/onda-studio/**

GitHub Pages активирован. Сайт опубликован и доступен по этому адресу; публикация обновляется автоматически после отправки изменений в ветку `main`.

### Статус публикации

- GitHub Pages: включён, источник **GitHub Actions**.
- Workflow: [Build and deploy to GitHub Pages](https://github.com/winchestersdc79-hub/onda-studio/actions).
- Репозиторий: [winchestersdc79-hub/onda-studio](https://github.com/winchestersdc79-hub/onda-studio).
- Проверенный адрес: https://winchestersdc79-hub.github.io/onda-studio/.

Workflow `.github/workflows/deploy.yml` проверяет TypeScript, собирает сайт, формирует sitemap с адресом репозитория и публикует `dist/`. Для URL репозитория автоматически учитывается базовый путь `/onda-studio/`.

## Контактная форма

До публикации задайте GitHub Actions variables **Settings → Secrets and variables → Actions → Variables**:

- `VITE_CONTACT_EMAIL` — действующий адрес студии для отправки письма из почтового приложения; или
- `VITE_CONTACT_ENDPOINT` — HTTPS endpoint, принимающий JSON-заявку и отвечающий успешным HTTP-статусом.

Без этих настроек форма показывает, что канал отправки не подключён; она не имитирует успешную отправку. Не помещайте секретные ключи в переменные `VITE_*`: они будут включены в браузерную сборку.

## Технологии

React, TypeScript, Vite, React Router, Framer Motion, Lucide.

Все кейсы в портфолио — концептуальные демонстрации студии, а не подтверждённые клиентские заказы.
