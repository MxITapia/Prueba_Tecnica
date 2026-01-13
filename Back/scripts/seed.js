const BASE_URL = process.env.SEED_BASE_URL || "http://app:3000/api";
const PING_URL = process.env.SEED_PING_URL || BASE_URL.replace(/\/api\/?$/, "");

const ADMIN_USER = process.env.SEED_ADMIN_USER || "admin@vector.cl";
const ADMIN_PASS = process.env.SEED_ADMIN_PASS || "Admin10.01";

const CATEGORIES = ["Deporte", "Electrodomesticos", "Aseo"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function req(url, { method = "GET", token, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg = typeof data === "string" ? data : JSON.stringify(data);
    const err = new Error(`[${method}] ${url} -> ${res.status} ${msg}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

async function api(path, opts) {
  return req(`${BASE_URL}${path}`, opts);
}

async function waitForApi(timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await req(`${PING_URL}/`, { method: "GET" }); 
      return;
    } catch {
      await sleep(2000);
    }
  }
  throw new Error("API no respondió a tiempo (timeout).");
}

async function ensureAdmin() {
  try {
    await api("/auth/register", {
      method: "POST",
      body: { username: ADMIN_USER, password: ADMIN_PASS },
    });
    console.log("Admin creado:", ADMIN_USER);
  } catch {
    console.log("Admin ya existe o no se pudo registrar (continuando)...");
  }

  const login = await api("/auth/login", {
    method: "POST",
    body: { username: ADMIN_USER, password: ADMIN_PASS },
  });

  if (!login?.token) throw new Error("No se obtuvo token en login.");
  console.log("Token OK");
  return login.token;
}

async function ensureCategories(token) {
  for (const nombre of CATEGORIES) {
    try {
      await api("/categorias", { method: "POST", token, body: { nombre } });
      console.log("Categoría creada:", nombre);
    } catch {
      console.log("Categoría ya existe o no se pudo crear:", nombre);
    }
  }

  try {
    const list = await api("/categorias", { method: "GET", token }); 
    console.log(
      "Categorías actuales:",
      Array.isArray(list) ? list.map((c) => c.nombre) : list
    );
  } catch {}
}

(async () => {
  console.log("Esperando API en:", PING_URL);
  await waitForApi();

  const token = await ensureAdmin();
  await ensureCategories(token);

  console.log("Seed terminado");
  process.exit(0);
})().catch((err) => {
  console.error("Seed falló:", err.message);
  process.exit(1);
});
