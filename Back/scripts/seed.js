const BASE_URL = process.env.SEED_BASE_URL || "http://localhost:3000/api";
const ADMIN_USER = process.env.SEED_ADMIN_USER || "admin@vector.cl";
const ADMIN_PASS = process.env.SEED_ADMIN_PASS || "Admin10.01";

const CATEGORIES = ["Deporte", "Electrodomesticos", "Aseo"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function req(path, { method = "GET", token, body } = {}) {
  const url = `${BASE_URL}${path}`;
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
    const err = new Error(`[${method}] ${path} -> ${res.status} ${msg}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

async function waitForApi(timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await req("/", { method: "GET" });
      return;
    } catch {
      await sleep(2000);
    }
  }
  throw new Error("API no respondió a tiempo (timeout).");
}

async function ensureAdmin() {
  try {
    await req("/auth/register", {
      method: "POST",
      body: { username: ADMIN_USER, password: ADMIN_PASS },
    });
    console.log("Admin creado:", ADMIN_USER);
  } catch (e) {
    console.log(" Admin ya existe o no se pudo registrar (continuando)...");
  }

  const login = await req("/auth/login", {
    method: "POST",
    body: { username: ADMIN_USER, password: ADMIN_PASS },
  });
  if (!login?.token) throw new Error("No se obtuvo token en login.");
  console.log(" Token OK");
  return login.token;
}

async function ensureCategories(token) {
  for (const nombre of CATEGORIES) {
    try {
      await req("/categorias", { method: "POST", token, body: { nombre } });
      console.log(" Categoría creada:", nombre);
    } catch (e) {
      console.log("categoría ya existe o no se pudo crear:", nombre);
    }
  }

  try {
    const list = await req("/ctegorias", { method: "GET", token });
    console.log(" Categorías actuales:", Array.isArray(list) ? list.map(c => c.nombre) : list);
  } catch {
  }
}

(async () => {
  console.log("Esperando API en:", BASE_URL);
  await waitForApi();

  const token = await ensureAdmin();
  await ensureCategories(token);

  console.log(" Seed terminado");
  process.exit(0);
})().catch((err) => {
  console.error(" Seed falló:", err.message);
  process.exit(1);
});
