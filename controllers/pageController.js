// Контроллеры HTML-страниц: данные из хранилища передаются в EJS-шаблоны.
const store = require('../models/diagramStore');
const logStore = require('../models/logStore');

const emptyForm = { title: '', type: 'flowchart', dsl: '' };

exports.index = (req, res) => {
  res.render('index', { title: 'Список диаграмм', items: store.getAll() });
};

exports.item = (req, res) => {
  const item = /^\d+$/.test(req.params.id) ? store.getById(parseInt(req.params.id, 10)) : null;
  if (!item) return res.status(404).render('404', { title: 'Ошибка 404' });
  res.render('item', { title: item.title, item });
};

exports.addForm = (req, res) => {
  res.render('add', { 
    title: 'Новая диаграмма', 
    form: emptyForm, 
    errors: [], 
    types: store.DIAGRAM_TYPES 
  });
};

exports.addSubmit = (req, res) => {
  const { title = '', type = 'flowchart', dsl = '', createdAt = '' } = req.body || {};
  const errors = [];

  // ✅ Валидация: непустое название
  if (!title.trim()) {
    errors.push('❌ Введите название диаграммы');
  }

  // ✅ Валидация: минимальная длина названия
  if (title.trim() && title.trim().length < 2) {
    errors.push('❌ Название должно содержать минимум 2 символа');
  }

  // ✅ Валидация: максимальная длина названия
  if (title.length > 100) {
    errors.push('❌ Название не может быть больше 100 символов');
  }

  // ✅ Валидация: непустой DSL-код
  if (!dsl.trim()) {
    errors.push('❌ Введите DSL-код диаграммы');
  }

  // ✅ Валидация: минимальная длина DSL-кода
  if (dsl.trim() && dsl.trim().length < 5) {
    errors.push('❌ DSL-код должен содержать минимум 5 символов');
  }

  // ✅ Валидация: максимальная длина DSL-кода
  if (dsl.length > 5000) {
    errors.push('❌ DSL-код не может быть больше 5000 символов');
  }

  // ✅ Валидация: тип диаграммы
  if (!store.DIAGRAM_TYPES.includes(type)) {
    errors.push('❌ Выбран неизвестный тип диаграммы');
  }

  // ✅ Валидация: пробелы в начале/конце
  if (title !== title.trim()) {
    errors.push('❌ Название не должно начинаться или заканчиваться пробелом');
  }

  // Если есть ошибки — вернуть форму с ошибками
  if (errors.length) {
    return res.status(400).render('add', {
      title: 'Новая диаграмма',
      form: { title, type, dsl, createdAt },
      errors,
      types: store.DIAGRAM_TYPES
    });
  }

  // ✅ Создать диаграмму с временем создания
  const createdAtValue = createdAt || new Date().toISOString();
  store.create({ title: title.trim(), type, dsl: dsl.trim(), createdAt: createdAtValue });
  
  res.redirect('/' + res.locals.authQuery);
};

const METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
const EVENTS = ['Успешный запрос', 'Перенаправление', 'Ошибка клиента', 'Ошибка сервера'];

// 📊 Страница-таблица журнала запросов (время, событие, метод, URL, статус и др.)
// Логи читаются из SQLite БД, а не из памяти
exports.logs = (req, res) => {
  const method = METHODS.includes(req.query.method) ? req.query.method : '';
  const event = EVENTS.includes(req.query.event) ? req.query.event : '';

  // ✅ Читать логи из БД вместо памяти
  logStore.getAllFromDB({ method, event }, (entries) => {
    res.render('logs', {
      title: 'Журнал запросов',
      entries: entries || [],
      filter: { method, event },
      methods: METHODS,
      events: EVENTS
    });
  });
};

exports.login = (req, res) => {
  res.render('login', { title: 'Авторизация' });
};

// 🔴 Маршрут для демонстрации страницы 500 (только вне production)
// Генерирует тестовую ошибку и отправляет на страницу 500.ejs
exports.crash = () => {
  throw new Error('Тестовая ошибка для демонстрации страницы 500');
};