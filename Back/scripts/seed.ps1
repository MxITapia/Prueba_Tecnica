$baseUrl = "http://localhost:3000/api"

# 1. Registrar y Loguear Usuario Admin
try {
    Write-Host "Registrando usuario admin..."
    $regBody = @{
        username = "admin_seed"
        password = "password123"
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $regBody -ContentType "application/json" -ErrorAction SilentlyContinue
} catch {
    Write-Host "Usuario ya existe o error al registrar (continuando...)"
}

Write-Host "Logueando..."
$loginBody = @{
    username = "admin_seed"
    password = "password123"
} | ConvertTo-Json
$authResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $authResponse.token
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

if (-not $token) {
    Write-Error "No se pudo obtener el token. Abortando."
    exit 1
}
Write-Host "Token obtenido exitosamente."

# 2. Crear Categorías
$categorias = @("Deporte", "Electrodomestico", "Aseo")
$catIds = @{}

foreach ($cat in $categorias) {
    Write-Host "Creando Categoría: $cat"
    $body = @{ nombre = $cat } | ConvertTo-Json
    try {
        $res = Invoke-RestMethod -Uri "$baseUrl/categorias" -Method Post -Headers $headers -Body $body
        $catIds[$cat] = $res.id
    } catch {
        Write-Warning "Error creando $cat (¿Ya existe?)"
        # Intentar obtener ID si falla (opcional, simplificado aquí asumimos éxito o ignoramos)
    }
}

# 3. Crear Productos
$user_defined_products = @{
    "Deporte" = @(
        @{ nombre = "Pelota de Futbol"; precio = 20000 },
        @{ nombre = "Raqueta de Tenis"; precio = 80000 },
        @{ nombre = "Pesas 10kg"; precio = 45000 }
    )
    "Electrodomestico" = @(
        @{ nombre = "Licuadora"; precio = 35000 },
        @{ nombre = "Microondas"; precio = 60000 },
        @{ nombre = "Batidora"; precio = 25000 }
    )
    "Aseo" = @(
        @{ nombre = "Jabon Liquido"; precio = 3000 },
        @{ nombre = "Cloro Gel"; precio = 2500 },
        @{ nombre = "Escoba"; precio = 5000 }
    )
}

foreach ($catName in $catIds.Keys) {
    $catId = $catIds[$catName]
    $prods = $user_defined_products[$catName]
    
    foreach ($p in $prods) {
        Write-Host "Creando Producto: $($p.nombre) en $catName"
        $pBody = @{
            nombre = $p.nombre
            precio = $p.precio
            id_categoria = $catId
        } | ConvertTo-Json
        
        try {
            Invoke-RestMethod -Uri "$baseUrl/productos" -Method Post -Headers $headers -Body $pBody
        } catch {
            Write-Warning "Error creando $($p.nombre)"
        }
    }
}

Write-Host "¡Datos cargados exitosamente!"
