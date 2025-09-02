@echo off
echo 🚀 Iniciando build de produção...

REM Limpar builds anteriores
echo 🧹 Limpando builds anteriores...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out

REM Instalar dependências se necessário
echo 📦 Verificando dependências...
call npm ci --only=production

REM Build de produção
echo 🔨 Fazendo build de produção...
set NODE_ENV=production
call npm run build

REM Verificar se o build foi bem-sucedido
if %ERRORLEVEL% EQU 0 (
    echo ✅ Build de produção concluído com sucesso!
    echo 📁 Arquivos gerados em: .next/
    echo 🚀 Para iniciar em produção: npm run start:prod
) else (
    echo ❌ Erro no build de produção!
    pause
    exit /b 1
)
