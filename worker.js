import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const SUPER_ADMINS = [
  738795572
];

const SECTIONS = [
  ["identification", "1. Идентификация объекта"],
  ["owners", "2. Информация о собственниках"],
  ["infrastructure", "3. Инфраструктура"],
  ["layout", "4. Общая планировка"],
  ["building", "5. Дом, входная группа"],
  ["floor_neighbors", "6. Этаж, соседи"],
  ["view_noise", "7. Вид, свет, шум"],
  ["kitchen", "8. Кухонная зона"],
  ["engineering", "9. Окна, двери, инженерия"],
  ["bathroom", "10. Санузел"],
  ["furniture", "11. Мебель и комплектация"],
  ["condition", "12. Состояние квартиры"],
  ["pros_cons", "13. Преимущества и ограничения"],
  ["prelaunch", "14. Что сделать до запуска"],
  ["rental_stats", "15. Статистика сдачи"]
];

const QUESTIONS = {
  identification: [
    textQ("listing_url", "Ссылка на объявление"),
    textQ("address", "Адрес"),
    textQ("complex", "ЖК"),
    textQ("price", "Стоимость"),
    textQ("total_area", "Общая площадь"),
    singleQ("object_type", "Тип объекта", ["квартира", "апартаменты", "другое"]),
    singleQ("rooms", "Комнатность", ["студия", "1-комнатная", "2-комнатная", "3-комнатная", "4-комнатная", "евроформат"]),
    textQ("floor", "Этаж"),
    textQ("floors_total", "Этажность"),
    singleQ("transport", "Метро / транспорт", ["до 10 минут пешком", "10–20 минут пешком", "более 20 минут"]),
    singleQ("tenant_terms", "Условия по арендаторам", ["можно с детьми / животными", "можно с животными", "можно с детьми", "без детей и животных", "не курящие"]),
    singleQ("registration", "Регистрация", ["возможна", "не возможна"]),
    singleQ("tenant_type", "Готовы к арендаторам", ["только ФЛ", "можно ЮЛ"]),
    singleQ("status", "Статус", ["свободна", "пока живут"])
  ],
  owners: [
    textQ("owner_name", "ФИО собственника(ов)"),
    textQ("owner_contact", "Контакт собственника"),
    singleQ("owners_count", "Количество собственников", ["1", "2", "более 2"])
  ],
  infrastructure: [
    textQ("education", "Образовательные учреждения"),
    textQ("medical", "Медицинские учреждения"),
    textQ("shopping", "Торговые центры"),
    textQ("sport", "Спортивные объекты"),
    textQ("recreation", "Зоны отдыха")
  ],
  layout: [
    singleQ("layout_type", "Общая планировка", ["студийная планировка", "классическая планировка", "европланировка"]),
    singleQ("wardrobe", "Гардеробная", ["да", "нет"])
  ],
  building: [
    textQ("year_built", "Год постройки"),
    singleQ("entrance", "Входная группа", ["ухоженная", "есть визуальный износ"]),
    singleQ("facade", "Фасад", ["ухоженный", "есть визуальный износ"]),
    singleQ("elevator", "Лифт", ["есть", "нет"]),
    singleQ("elevator_quality", "Качество лифтовой группы", ["лифты современные", "есть визуальный износ"]),
    singleQ("security", "Охрана / консьерж", ["есть охрана/консьерж", "отсутствует"]),
    singleQ("parking", "Парковка", ["стихийная", "отсутствует", "подземная", "за шлагбаумом", "в соседнем дворе"])
  ],
  floor_neighbors: [
    singleQ("floor_state", "Этаж", ["этаж чистый", "есть текущие ремонты у соседей"])
  ],
  view_noise: [
    singleQ("view", "Вид из окна", ["на водное пространство / набережную", "на парк", "на дорогу/инфраструктуру", "на соседний корпус", "во двор ухоженный", "во двор неухоженный/стройка", "на улицу и во двор", "на город"]),
    singleQ("noise", "Уровень шума", ["приемлем", "шум при открытых окнах"]),
    singleQ("air", "Запахи / духота", ["есть запахи/духота", "воздух комфортный"])
  ],
  kitchen: [
    singleQ("kitchen_type", "Тип кухни", ["кухня-гостиная", "отдельная кухня"]),
    singleQ("kitchen_appliances", "Техника", ["полная комплектация", "не хватает существенных позиций"]),
    singleQ("kitchen_visual", "Визуальное состояние", ["кухня визуально сильная", "кухня визуально слабая"])
  ],
  engineering: [
    singleQ("lighting", "Освещение", ["освещение достаточное", "свет можно усилить"]),
    singleQ("windows", "Окна", ["в хорошем состоянии", "наличие дефектов"]),
    singleQ("engineering_state", "Инженерия", ["в хорошем состоянии", "требует ремонта"])
  ],
  bathroom: [
    singleQ("bathroom_count", "Количество", ["1 совмещенный", "2 совмещенных", "1 совмещенный, 1 раздельный"]),
    singleQ("bathroom_visual", "Визуальное состояние", ["в хорошем состоянии", "есть визуальный износ"])
  ],
  furniture: [
    singleQ("furniture_state", "Состояние", ["мебель современная", "мебель устарела"]),
    singleQ("move_in_ready", "Готовность к въезду", ["квартира готова к въезду", "требуется дополнительная мебель"])
  ],
  condition: [
    singleQ("apartment_state", "Состояние", ["состояние отличное", "состояние среднее", "требуется частичный ремонт"])
  ],
  pros_cons: [
    textQ("advantages", "Преимущества"),
    textQ("limitations", "Ограничения")
  ],
  prelaunch: [
    multiQ("prelaunch_tasks", "Требуется сделать", ["ничего критичного не требуется", "генеральная уборка", "химчистка", "убрать визуальный шум", "доукомплектовать техникой", "доукомплектовать мебелью", "обновить текстиль", "мелкий ремонт", "убрать личные вещи", "улучшить свет"])
  ],
  rental_stats: [
    textQ("exposure_start", "Старт экспозиции"),
    textQ("exposure_period", "Срок экспозиции"),
    textQ("rental_count", "Сколько раз сдавалась в аренду"),
    textQ("between_rentals", "Период между сдачами")
  ]
};

function textQ(id, title) { return { id, title, type: "text" }; }
function singleQ(id, title, options) { return { id, title, type: "single", options }; }
function multiQ(id, title, options) { return { id, title, type: "multi", options }; }

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("OK");

    const update = await request.json();

    if (update.message) await handleMessage(update.message, env);
    if (update.callback_query) await handleCallback(update.callback_query, env);

    return new Response("ok");
  }
};

async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const text = (message.text || "").trim();

if (text.startsWith("/start")) {
  await clearState(env, chatId);

  if (!(await isAdmin(env, chatId))) {
    const broker = await getCurrentBroker(env, chatId);

    if (!broker) {
      await sendBrokerLinkMenu(env, chatId);
      return;
    }
  }

  await sendMainMenu(env.BOT_TOKEN, chatId);
  return;
}

  const state = await getState(env, chatId);

  if (state?.state === "waiting_title") {
    await updateObjectTitle(env, state.objectId, text);
    await clearState(env, chatId);
    await sendObjectMenu(env, chatId, state.objectId);
    return;
  }

  if (state?.state === "waiting_answer") {
    const q = getQuestion(state.sectionId, state.questionId);
    await saveAnswer(env, state.objectId, state.sectionId, state.questionId, q.title, text);
    await clearState(env, chatId);
    await sendSectionMenu(env, chatId, state.objectId, state.sectionId);
    return;
  }

  await sendMessage(env.BOT_TOKEN, chatId, "Напишите /start");
}

async function handleCallback(callback, env) {
  const chatId = callback.message.chat.id;
  const data = callback.data;

  await answerCallback(env.BOT_TOKEN, callback.id);

if (data === "create_object") {
  let broker = await getCurrentBroker(env, chatId);

  if (!(await isAdmin(env, chatId)) && !broker) {
    return sendBrokerLinkMenu(env, chatId);
  }

  if ((await isAdmin(env, chatId)) && !broker) {
    broker = {
      id: "admin",
      name: "Тест"
    };
  }

  const object = await createObject(env, chatId, broker);
  await setState(env, chatId, "waiting_title", object.number, "", "");

  return sendMessage(
    env.BOT_TOKEN,
    chatId,
    `✅ Объект создан\n\n${object.number}\nБрокер: ${broker.name}\nВведите название объекта сообщением.\nНапример: ЖК Символ, 2-комн., аренда`
  );
}
  if (data === "main_menu") { await clearState(env, chatId); return sendMainMenu(env.BOT_TOKEN, chatId); }

if (data.startsWith("link_broker:")) {
  const brokerId = data.split(":")[1];

  await assignTelegramIdToBroker(env, brokerId, chatId);

  const broker = await getCurrentBroker(env, chatId);

  await sendMessage(
    env.BOT_TOKEN,
    chatId,
    `Готово ✅\nВы вошли как: ${broker?.name || "сотрудник"}.\n\nВ дальнейшем бот будет узнавать вас автоматически.`
  );

  return sendMainMenu(env.BOT_TOKEN, chatId);
}

  if (data === "my_objects") {
  const objects = await getObjects(env, chatId);

  if (!objects.length) {
    return sendMessage(env.BOT_TOKEN, chatId, "У вас пока нет объектов.");
  }

  const keyboard = objects.map(o => [
    {
      text: `${o.number} — ${o.title}`,
      callback_data: `object_menu:${o.number}`
    }
  ]);

  keyboard.push([{ text: "Назад", callback_data: "main_menu" }]);

  return sendMessage(env.BOT_TOKEN, chatId, "Ваши объекты:", {
    inline_keyboard: keyboard
  });
}

if (data.startsWith("pdf:")) {
  const objectId = data.split(":")[1];

  if (!(await canAccessObject(env, chatId, objectId))) {
    return sendMessage(env.BOT_TOKEN, chatId, "❌ У вас нет доступа к этому объекту.");
  }

  await sendMessage(env.BOT_TOKEN, chatId, "Формирую PDF...");

  try {
    const pdfBuffer = await generatePdf(env, objectId);
    await sendPdf(env.BOT_TOKEN, chatId, pdfBuffer, `${objectId}.pdf`);
  } catch (error) {
    await sendMessage(env.BOT_TOKEN, chatId, "Ошибка PDF:\n" + error.message);
  }

  return;
}

if (data.startsWith("object_menu:")) {
  const objectId = data.split(":")[1];

  if (!(await canAccessObject(env, chatId, objectId))) {
    return sendMessage(env.BOT_TOKEN, chatId, "❌ У вас нет доступа к этому объекту.");
  }

  return sendObjectMenu(env, chatId, objectId);
}

if (data.startsWith("section:")) {
  const [, objectId, sectionId] = data.split(":");

  if (!(await canAccessObject(env, chatId, objectId))) {
    return sendMessage(env.BOT_TOKEN, chatId, "❌ У вас нет доступа к этому объекту.");
  }

  return sendSectionMenu(env, chatId, objectId, sectionId);
}

if (data.startsWith("q:")) {
  const [, objectId, sectionId, questionId] = data.split(":");

  if (!(await canAccessObject(env, chatId, objectId))) {
    return sendMessage(env.BOT_TOKEN, chatId, "❌ У вас нет доступа к этому объекту.");
  }

  return openQuestion(env, chatId, objectId, sectionId, questionId);
}

if (data.startsWith("a:")) {
  const [, objectId, sectionId, questionId, optionIndex] = data.split(":");

  if (!(await canAccessObject(env, chatId, objectId))) {
    return sendMessage(env.BOT_TOKEN, chatId, "❌ У вас нет доступа к этому объекту.");
  }

  const q = getQuestion(sectionId, questionId);
  const answer = q.options[Number(optionIndex)];

  await saveAnswer(env, objectId, sectionId, questionId, q.title, answer);

  return sendSectionMenu(env, chatId, objectId, sectionId);
}

if (data.startsWith("m:")) {
  const [, objectId, sectionId, questionId, optionIndex] = data.split(":");

  if (!(await canAccessObject(env, chatId, objectId))) {
    return sendMessage(env.BOT_TOKEN, chatId, "❌ У вас нет доступа к этому объекту.");
  }

  const q = getQuestion(sectionId, questionId);
  const option = q.options[Number(optionIndex)];

  const answers = await getAnswers(env, objectId);
  const key = `${sectionId}:${questionId}`;
  const current = answers[key]
    ? answers[key].split(", ").filter(Boolean)
    : [];

  const updated = current.includes(option)
    ? current.filter(x => x !== option)
    : [...current, option];

  await saveAnswer(
    env,
    objectId,
    sectionId,
    questionId,
    q.title,
    updated.join(", ")
  );

  return openQuestion(env, chatId, objectId, sectionId, questionId);
}
}

async function sendMainMenu(token, chatId) {
  return sendMessage(token, chatId, "Главное меню", {
    inline_keyboard: [
      [{ text: "Создать объект", callback_data: "create_object" }],
      [{ text: "Мои объекты", callback_data: "my_objects" }]
    ]
  });
}

async function sendObjectMenu(env, chatId, objectId) {
  const object = await getObject(env, objectId);
  const answers = await getAnswers(env, objectId);

  const keyboard = SECTIONS.map(s => {
    const sectionId = s[0];
    const sectionTitle = s[1];
    const questions = QUESTIONS[sectionId] || [];

    const answeredCount = questions.filter(q => answers[`${sectionId}:${q.id}`]).length;
const totalCount = questions.length;

let prefix = "⚪";
if (answeredCount === totalCount && totalCount > 0) prefix = "🟢";
else if (answeredCount > 0) prefix = "🟡";

    return [
      {
        text: `${prefix} ${sectionTitle} (${answeredCount}/${totalCount})`,
        callback_data: `section:${objectId}:${sectionId}`
      }
    ];
  });

  keyboard.push([{ text: "Сформировать PDF", callback_data: `pdf:${objectId}` }]);
  keyboard.push([{ text: "Мои объекты", callback_data: "my_objects" }]);
  keyboard.push([{ text: "Главное меню", callback_data: "main_menu" }]);

  return sendMessage(
    env.BOT_TOKEN,
    chatId,
    `${object.number}\nНазвание: ${object.title}\nБрокер: ${object.broker}\nВыберите раздел:`,
    { inline_keyboard: keyboard }
  );
}

async function sendSectionMenu(env, chatId, objectId, sectionId) {
  const section = SECTIONS.find(s => s[0] === sectionId);
  const questions = QUESTIONS[sectionId] || [];

  const answers = await getAnswers(env, objectId);
  const keyboard = questions.map(q => {
    const done = answers[`${sectionId}:${q.id}`] ? " ✅" : "";
    return [{ text: q.title + done, callback_data: `q:${objectId}:${sectionId}:${q.id}` }];
  });

  keyboard.push([{ text: "Назад к объекту", callback_data: `object_menu:${objectId}` }]);
  keyboard.push([{ text: "Главное меню", callback_data: "main_menu" }]);

  return sendMessage(env.BOT_TOKEN, chatId, `${section[1]}\n\nВыберите вопрос:`, { inline_keyboard: keyboard });
}

async function openQuestion(env, chatId, objectId, sectionId, questionId) {
  const q = getQuestion(sectionId, questionId);

  if (q.type === "text") {
    await setState(env, chatId, "waiting_answer", objectId, sectionId, questionId);
    return sendMessage(env.BOT_TOKEN, chatId, `${q.title}\n\nВведите значение сообщением:`);
  }

  if (q.type === "single") {
    const keyboard = q.options.map((opt, i) => [
      { text: opt, callback_data: `a:${objectId}:${sectionId}:${questionId}:${i}` }
    ]);

    keyboard.push([{ text: "Назад", callback_data: `section:${objectId}:${sectionId}` }]);

    return sendMessage(env.BOT_TOKEN, chatId, `${q.title}\n\nВыберите вариант:`, {
      inline_keyboard: keyboard
    });
  }

  if (q.type === "multi") {
    const answers = await getAnswers(env, objectId);
    const current = answers[`${sectionId}:${questionId}`]
      ? answers[`${sectionId}:${questionId}`].split(", ").filter(Boolean)
      : [];

    const keyboard = q.options.map((opt, i) => {
      const checked = current.includes(opt) ? "✅ " : "";
      return [{ text: checked + opt, callback_data: `m:${objectId}:${sectionId}:${questionId}:${i}` }];
    });

    keyboard.push([{ text: "Готово", callback_data: `section:${objectId}:${sectionId}` }]);
    keyboard.push([{ text: "Назад", callback_data: `section:${objectId}:${sectionId}` }]);

    return sendMessage(env.BOT_TOKEN, chatId, `${q.title}\n\nВыберите один или несколько вариантов:`, {
      inline_keyboard: keyboard
    });
  }
}

function getQuestion(sectionId, questionId) {
  return (QUESTIONS[sectionId] || []).find(q => q.id === questionId);
}

async function createObject(env, chatId, broker) {
  const token = await getAccessToken(env);
  const number = await getNextObjectNumber(env, token);
  const now = new Date().toISOString();

await appendRow(env, token, "objects!A:G", [
  number,
  String(chatId),
  broker.id,
  broker.name,
  "Без названия",
  now,
  now
]);

  return { number };
}

async function getBrokers(env) {
  const token = await getAccessToken(env);
  const rows = await getValues(env, token, "brokers!A2:E");

  return rows
    .filter(row => String(row[3]).toUpperCase() === "TRUE")
    .map(row => ({
      id: row[0],
      name: row[1],
      telegramId: row[2],
      active: String(row[3]).toUpperCase() === "TRUE",
      admin: String(row[4]).toUpperCase() === "TRUE"
    }));
}

async function getCurrentBroker(env, chatId) {
  const brokers = await getBrokers(env);
  return brokers.find(b => String(b.telegramId) === String(chatId)) || null;
}

async function isAdmin(env, chatId) {
  if (SUPER_ADMINS.includes(Number(chatId))) return true;

  let broker = await getCurrentBroker(env, chatId);
  return broker?.admin === true;
}

async function assignTelegramIdToBroker(env, brokerId, chatId) {
  const token = await getAccessToken(env);
  const rows = await getValues(env, token, "brokers!A2:E");

  const index = rows.findIndex(row => row[0] === brokerId);
  if (index === -1) return;

  const rowNumber = index + 2;

  await updateValues(env, token, `brokers!C${rowNumber}:C${rowNumber}`, [
    [String(chatId)]
  ]);
}

async function canAccessObject(env, chatId, objectId) {
  if (await isAdmin(env, chatId)) return true;

  const token = await getAccessToken(env);
  const rows = await getValues(env, token, "objects!A2:H");
  const row = rows.find(r => r[0] === objectId);

  if (!row) return false;

  return String(row[1]) === String(chatId);
}

async function sendBrokerLinkMenu(env, chatId) {
  const brokers = await getBrokers(env);

  const availableBrokers = brokers.filter(
    broker => !String(broker.telegramId || "").trim()
  );

  if (!availableBrokers.length) {
    return sendMessage(
      env.BOT_TOKEN,
      chatId,
      "Не удалось найти свободный профиль. Обратитесь к администратору."
    );
  }

  const keyboard = availableBrokers.map(broker => [
    {
      text: broker.name,
      callback_data: `link_broker:${broker.id}`
    }
  ]);

  return sendMessage(
    env.BOT_TOKEN,
    chatId,
    "Выберите себя из списка:",
    {
      inline_keyboard: keyboard
    }
  );
}

async function getObjects(env, chatId) {
  const token = await getAccessToken(env);
  const rows = await getValues(env, token, "objects!A2:H");

const admin = await isAdmin(env, chatId);

return rows
  .filter(r => admin || String(r[1]) === String(chatId))
  .map(r => ({
    number: r[0],
    broker: r[3],
    title: r[4],
  }));
  } 

async function getObject(env, objectId) {
  const token = await getAccessToken(env);
  const rows = await getValues(env, token, "objects!A2:H");
  const r = rows.find(row => row[0] === objectId);
  return { number: r[0], broker: r[3], title: r[4],};
}

async function updateObjectTitle(env, objectId, title) {
  const token = await getAccessToken(env);
  const rows = await getValues(env, token, "objects!A2:H");
  const i = rows.findIndex(r => r[0] === objectId);
  if (i === -1) return;
  const rowNumber = i + 2;
  await updateValues(env, token, `objects!E${rowNumber}:G${rowNumber}`, [[title, rows[i][5], new Date().toISOString()]]);
}

async function saveAnswer(env, objectId, sectionId, questionId, questionTitle, answerValue) {
  const token = await getAccessToken(env);
  const rows = await getValues(env, token, "answers!A2:F");
  const i = rows.findIndex(r => r[0] === objectId && r[1] === sectionId && r[2] === questionId);
  const values = [[objectId, sectionId, questionId, questionTitle, answerValue, new Date().toISOString()]];

  if (i === -1) await appendRow(env, token, "answers!A:F", values[0]);
  else await updateValues(env, token, `answers!A${i + 2}:F${i + 2}`, values);
}

async function getAnswers(env, objectId) {
  const token = await getAccessToken(env);
  const rows = await getValues(env, token, "answers!A2:F");
  const result = {};
  rows.filter(r => r[0] === objectId).forEach(r => result[`${r[1]}:${r[2]}`] = r[4]);
  return result;
}

async function setState(env, chatId, state, objectId, sectionId, questionId) {
  const token = await getAccessToken(env);
  const rows = await getValues(env, token, "states!A2:E");
  const i = rows.findIndex(r => String(r[0]) === String(chatId));
  const values = [[String(chatId), state, objectId, sectionId, questionId]];

  if (i === -1) await appendRow(env, token, "states!A:E", values[0]);
  else await updateValues(env, token, `states!A${i + 2}:E${i + 2}`, values);
}

async function getState(env, chatId) {
  const token = await getAccessToken(env);
  const rows = await getValues(env, token, "states!A2:E");
  const r = rows.find(row => String(row[0]) === String(chatId));
  if (!r) return null;
  return { state: r[1], objectId: r[2], sectionId: r[3], questionId: r[4] };
}

async function clearState(env, chatId) {
  return setState(env, chatId, "", "", "", "");
}

async function getNextObjectNumber(env, token) {
  const rows = await getValues(env, token, "objects!A2:A");
  let max = 0;
  rows.forEach(r => {
    const m = String(r[0] || "").match(/^OBJ-(\d+)$/);
    if (m) max = Math.max(max, Number(m[1]));
  });
  return `OBJ-${String(max + 1).padStart(6, "0")}`;
}

async function getValues(env, token, range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${env.SPREADSHEET_ID}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  return data.values || [];
}

async function appendRow(env, token, range, row) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${env.SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
  await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ values: [row] })
  });
}

async function updateValues(env, token, range, values) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${env.SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
  await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ values })
  });
}

async function getAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: env.GOOGLE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  };

  const unsigned = base64url(JSON.stringify(header)) + "." + base64url(JSON.stringify(payload));
  const signature = await signJwt(unsigned, env.GOOGLE_PRIVATE_KEY);
  const jwt = unsigned + "." + signature;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt })
  });

  return (await res.json()).access_token;
}

async function signJwt(input, privateKeyPem) {
  const pem = privateKeyPem.replace(/\\n/g, "\n");
  const keyData = pem.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replace(/\s/g, "");
  const binary = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));

  const key = await crypto.subtle.importKey("pkcs8", binary, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(input));
  return base64urlArrayBuffer(sig);
}

function base64url(v) {
  return btoa(v).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlArrayBuffer(buffer) {
  let binary = "";
  new Uint8Array(buffer).forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sendMessage(token, chatId, text, replyMarkup = null) {
  const payload = { chat_id: chatId, text };
  if (replyMarkup) payload.reply_markup = replyMarkup;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function answerCallback(token, callbackQueryId) {
  await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId })
  });
}

async function generatePdf(env, objectId) {
  const object = await getObject(env, objectId);
  const answers = await getAnswers(env, objectId);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontUrl = "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf";
  const fontBytes = await fetch(fontUrl).then(r => r.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);

  let page = pdfDoc.addPage([595, 842]); // A4
  const margin = 40;
  const width = page.getWidth() - margin * 2;
  let y = 800;

  function addRow(label, value) {
  if (y < 60) {
    page = pdfDoc.addPage([595, 842]);
    y = 800;
  }

  const labelX = margin;
  const valueX = 260;
  const labelWidth = 210;
  const valueWidth = page.getWidth() - valueX - margin;

  const labelLines = wrapText(String(label), font, 10, labelWidth);
  const valueLines = wrapText(String(value || "—"), font, 10, valueWidth);

  const maxLines = Math.max(labelLines.length, valueLines.length);

  for (let i = 0; i < maxLines; i++) {
    if (y < 60) {
      page = pdfDoc.addPage([595, 842]);
      y = 800;
    }

    if (labelLines[i]) {
      page.drawText(labelLines[i], {
        x: labelX,
        y,
        size: 10,
        font,
        color: rgb(0.25, 0.25, 0.25)
      });
    }

    if (valueLines[i]) {
      page.drawText(valueLines[i], {
        x: valueX,
        y,
        size: 10,
        font,
        color: rgb(0, 0, 0)
      });
    }

    y -= 15;
  }

  y -= 4;
}

  function addText(text, size = 10) {
    const lines = wrapText(text, font, size, width);

    for (const line of lines) {
      if (y < 50) {
        page = pdfDoc.addPage([595, 842]);
        y = 800;
      }

      page.drawText(line, {
        x: margin,
        y,
        size,
        font,
        color: rgb(0, 0, 0)
      });

      y -= size + 6;
    }
  }

  addText("ЛИСТ ОСМОТРА ОБЪЕКТА", 16);
  y -= 10;

  addText(`Номер: ${object.number}`);
  addText(`Название: ${object.title}`);
  addText(`Брокер: ${object.broker}`);
  y -= 12;

  for (const section of SECTIONS) {
    const sectionId = section[0];
    const sectionTitle = section[1];

    addText(sectionTitle, 13);
    y -= 4;

for (const q of QUESTIONS[sectionId] || []) {
  const answer = answers[`${sectionId}:${q.id}`] || "—";
  addRow(q.title, answer);
}

    y -= 10;
  }

  return await pdfDoc.save();
}

function wrapText(text, font, size, maxWidth) {
  const words = String(text).split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, size);

    if (testWidth > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }

  if (line) lines.push(line);
  return lines;
}

async function sendPdf(token, chatId, pdfBuffer, filename) {
  const form = new FormData();

  form.append("chat_id", String(chatId));
  form.append(
    "document",
    new Blob([pdfBuffer], { type: "application/pdf" }),
    filename
  );

  await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
    method: "POST",
    body: form
  });
}
