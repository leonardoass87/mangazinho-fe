# 🚀 Guia de Deploy e Configuração - Mangazinho Frontend

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- API backend rodando (porta 4000 para desenvolvimento)

## 🔧 Configuração de Desenvolvimento

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar ambiente local
```bash
# Copie o arquivo de exemplo
cp env.local.example .env.local

# Edite o arquivo .env.local com suas configurações
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_FILES_URL=http://localhost:4000
NODE_ENV=development
```

### 3. Verificar configuração
```bash
npm run check
```

### 4. Iniciar servidor de desenvolvimento
```bash
npm run dev
```

O site estará disponível em: http://localhost:3001

## 🚀 Deploy em Produção

### 1. Build de produção
```bash
npm run build
```

### 2. Configurar ambiente de produção
```bash
# Copie o arquivo de exemplo
cp env.production.example .env.production

# Edite o arquivo .env.production
NEXT_PUBLIC_API_URL=https://mangazinho.site/api
NEXT_PUBLIC_FILES_URL=https://mangazinho.site
NODE_ENV=production
```

### 3. Iniciar servidor de produção
```bash
npm run start
```

## 📁 Estrutura de Arquivos

```
mangazinho-fe/
├── .env.local              # Configurações locais (não commitado)
├── .env.production         # Configurações de produção (não commitado)
├── env.local.example       # Exemplo para configuração local
├── env.production.example  # Exemplo para configuração de produção
├── next.config.mjs         # Configuração do Next.js
├── package.json            # Dependências e scripts
├── check-config.js         # Script de verificação de configuração
├── build-prod.sh          # Script de build (Linux/Mac)
└── build-prod.bat         # Script de build (Windows)
```

## 🔄 Scripts Disponíveis

- `npm run dev` - Desenvolvimento local
- `npm run build` - Build de produção
- `npm run start` - Iniciar servidor de produção
- `npm run lint` - Verificar código
- `npm run lint:fix` - Corrigir problemas de linting
- `npm run check` - Verificar configuração do ambiente

## 🌐 Portas

- **Frontend**: 3001 (configurável via PORT)
- **API Backend**: 4000 (configurável via NEXT_PUBLIC_API_URL)

## 🚨 Solução de Problemas

### Site não carrega localmente
1. Execute `npm run check` para verificar a configuração
2. Verifique se a API está rodando na porta 4000
3. Confirme se o arquivo `.env.local` existe e está configurado
4. Verifique se não há conflitos de porta

### Erro de build
1. Limpe a pasta `.next`: `rm -rf .next`
2. Reinstale dependências: `npm install`
3. Tente o build novamente

### Problemas de CORS
1. Verifique se a API está configurada para aceitar requisições de localhost:3001
2. Confirme as configurações de CORS no backend

## 📝 Notas Importantes

- **NUNCA** commite arquivos `.env*` no git
- Sempre use variáveis de ambiente para configurações sensíveis
- O modo standalone do Next.js gera uma build otimizada para produção
- Para desenvolvimento local, certifique-se de que a API backend está rodando na porta 4000
- Use `npm run check` sempre que tiver problemas para verificar a configuração
