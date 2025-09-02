#!/bin/bash

echo "🚀 Iniciando build de produção..."

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf .next
rm -rf out

# Instalar dependências se necessário
echo "📦 Verificando dependências..."
npm ci --only=production

# Build de produção
echo "🔨 Fazendo build de produção..."
NODE_ENV=production npm run build

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build de produção concluído com sucesso!"
    echo "📁 Arquivos gerados em: .next/"
    echo "🚀 Para iniciar em produção: npm run start:prod"
else
    echo "❌ Erro no build de produção!"
    exit 1
fi
