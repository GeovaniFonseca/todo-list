# Função para exibir mensagens
function Show-Message {
    $Message = $args[0]
    Write-Host "-----------------------------------------"
    Write-Host $Message
    Write-Host "-----------------------------------------"
}

# Caminho para o executável do MariaDB (ajuste este caminho conforme necessário)
$MariaDBPath = "C:\Program Files\MariaDB 11.4\bin\mysql.exe"

# Verificar se o MariaDB está instalado e no PATH ou no caminho especificado
if (-not (Test-Path $MariaDBPath) -and -not (Get-Command "mysql" -ErrorAction SilentlyContinue)) {
    Show-Message "MariaDB não encontrado. Certifique-se de que o MariaDB está instalado e no PATH do sistema."
    exit 1
}

# Configurar variáveis
$DB_USER = "root"  # Certifique-se de que este usuário tem as permissões necessárias
$DB_PASSWORD = "123456"
$DB_NAME = "task_manager2"
$SchemaFilePath = ".\scripts\db_schema.sql"

# Função para conceder permissões ao usuário do MariaDB
function Grant-Permissions {
    & "$MariaDBPath" -u$DB_USER -p$DB_PASSWORD -e "GRANT ALL PRIVILEGES ON *.* TO '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD' WITH GRANT OPTION;"
}

# Instalar dependências do backend
$backendPath = ".\task-manager\backend"
if (-not (Test-Path $backendPath)) {
    Show-Message "Caminho do backend não encontrado: $backendPath"
    exit 1
}

Show-Message "Instalando dependências do backend"
Set-Location -Path $backendPath
npm install

# Configurar banco de dados (MariaDB)
Show-Message "Configurando banco de dados"
try {
    if (Test-Path $MariaDBPath) {
        & "$MariaDBPath" -u$DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
        & "$MariaDBPath" -u$DB_USER -p$DB_PASSWORD $DB_NAME -e (Get-Content -Raw $SchemaFilePath)
    } else {
        Invoke-Expression "mysql -u$DB_USER -p$DB_PASSWORD -e `"CREATE DATABASE IF NOT EXISTS $DB_NAME;`""
        Invoke-Expression "mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME -e `"$(Get-Content -Raw $SchemaFilePath)`""
    }
} catch {
    Show-Message "Erro ao configurar o banco de dados. Tentando conceder permissões..."
    Grant-Permissions
    & "$MariaDBPath" -u$DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
    & "$MariaDBPath" -u$DB_USER -p$DB_PASSWORD $DB_NAME -e (Get-Content -Raw $SchemaFilePath)
}

# Instalar dependências do frontend
$frontendPath = ".\task-manager\frontend"
if (-not (Test-Path $frontendPath)) {
    Show-Message "Caminho do frontend não encontrado: $frontendPath"
    exit 1
}

Show-Message "Instalando dependências do frontend"
Set-Location -Path $frontendPath
npm install

# Iniciar o backend
Show-Message "Iniciando o backend"
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c cd ../backend && node server.js"

# Iniciar o frontend
Show-Message "Iniciando o frontend"
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c cd ../frontend && npm start"

# Exibir mensagens de conclusão
Show-Message "Instalação concluída"
Write-Host "Backend rodando em http://localhost:3000"
Write-Host "Frontend rodando em http://localhost:3001"

# Manter o terminal aberto
cmd /k
