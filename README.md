# pdv_dialogflow_server
Este é o projeto do servidor, desenvolvido em Node e Express, que cria a conexão entre o Dialogflow e o banco de dados do Pontos de Vida.

<h2>Dependencias</h2>

- Node.JS
- Banco de dados SQL

<h2>Como instalar</h2>

- Faça o clone do repositório.
- Dentro da pasta do repositório, use o comando npm init para baixar os módulos que são dependencias do projeto

<h2>Variáveis de Ambiente</h2>

Se estiver utilizando um ambiente de desenvolvimento, crie um arquivo .env na raiz do projeto e insira as seguintes variáveis:

- PORT=NUMERO_DA_PORTA_DO_SERVIDOR 
- DB=NOME_DO_BANCO_DE_DADOS
- USER=USUÁRIO_DO_BANCO_DE_DADOS
- PASS=SENHA_DO_USUARIO

Se estiver ulilizando um ambiente de produção, configurar as variáveis de ambiente conforme especificações do servidor.

<h2>Banco de Dados</h2>

Este projeto utiliza o Sequelize como ORM gerenciador do banco de dados. Qualquer banco de dados SQL pode ser utilizado.
O projeto foi pensado em rodar um banco de dados MYSQL, e está configurado com esta opção. Caso queira utilizar outro
tipo de banco de dados, modifique o parâmetro <strong>"dialect"</strong> no arquivo "<strong>db-connection.js</strong>", dentro da pasta <strong>config/</strong> do projeto.

<h3>Modelos</h3>

Os modelos utilizados no projeto encontram-se no diretório <strong>./models</strong>. O arquivo que faz a sincronização com o banco de dados é
o arquivo "<strong>./config/set-database.js</strong>".
