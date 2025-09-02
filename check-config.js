#!/usr/bin/env node

console.log('🔍 Verificando configuração do ambiente...\n');

// Verificar variáveis de ambiente
const envVars = {
  'NODE_ENV': process.env.NODE_ENV || 'não definido',
  'NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL || 'não definido',
  'NEXT_PUBLIC_FILES_URL': process.env.NEXT_PUBLIC_FILES_URL || 'não definido',
  'PORT': process.env.PORT || '3001 (padrão)'
};

console.log('📋 Variáveis de ambiente:');
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

console.log('\n📁 Arquivos de configuração:');
const fs = require('fs');
const path = require('path');

const configFiles = [
  '.env.local',
  '.env.production',
  'next.config.mjs',
  'package.json'
];

configFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${file}`);
});

console.log('\n🚀 Para iniciar o desenvolvimento:');
console.log('  1. Copie env.local.example para .env.local');
console.log('  2. Configure as URLs da API no .env.local');
console.log('  3. Execute: npm run dev');
console.log('\n🌐 O site estará disponível em: http://localhost:3001');
console.log('📡 Certifique-se de que a API está rodando na porta 4000');
