#!/bin/bash

# Função para exibir mensagens
function echo_msg() {
  echo "-----------------------------------------"
  echo "$1"
  echo "-----------------------------------------"
}

# Clonar o repositório (opcional)
# echo_msg "Clonando repositório"
# git clone https://github.com/seu-usuario/seu-repositorio.git
# cd seu-repositorio

# Instalar dependências do backend
echo_msg "Instalando dependências do backend"
cd backend
npm install

# Configurar banco de dados (MySQL/MariaDB)
echo_msg "Configurando banco de dados"
DB_USER="root"
DB_PASSWORD="123456"
DB_NAME="task_manager"

mysql -u$DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME < ../scripts/db_schema.sql

# Instalar dependências do frontend
echo_msg "Instalando dependências do frontend"
cd ../frontend
npm install

# Iniciar o backend
echo_msg "Iniciando o backend"
cd ../backend
nohup npm start &

# Iniciar o frontend
echo_msg "Iniciando o frontend"
cd ../frontend
nohup npm start &

# Exibir mensagens de conclusão
echo_msg "Instalação concluída"
echo "Backend rodando em http://localhost:3000"
echo "Frontend rodando em http://localhost:3001"

# Manter o terminal aberto
exec $SHELL
