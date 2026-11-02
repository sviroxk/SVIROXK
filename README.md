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

Для получения заявок в настройках GitHub Actions задан endpoint FormSubmit AJAX для `winchestersdc79@gmail.com` через variable `VITE_CONTACT_ENDPOINT`. FormSubmit может потребовать подтверждения адреса при первом письме; успешный интерфейс показывается только после успешного HTTP-ответа. Если сервис отвечает ошибкой, посетитель увидит сообщение о неполученной заявке.

Форма содержит honeypot и минимальное время заполнения. Настроенный сторонний endpoint должен дополнительно ограничивать частоту запросов, проверять происхождение и блокировать злоупотребления. Администратор может заменить адрес сервиса в **Settings → Secrets and variables → Actions → Variables**. Не помещайте секретные ключи в `VITE_*`: они попадут в публичный браузерный bundle.

## Технологии

React, TypeScript, Vite, React Router, Framer Motion, Lucide.

Все кейсы в портфолио — концептуальные демонстрации студии, а не подтверждённые клиентские заказы.
