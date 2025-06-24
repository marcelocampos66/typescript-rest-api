<h1 align="center">TypeScript REST Api <h1>

[![Generic badge](https://img.shields.io/badge/Develop-TypeScript-blue?style=for-the-badge&logo=appveyor)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Develop-NodeJs-green?style=for-the-badge&logo=appveyor)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Develop-Express-yellow?style=for-the-badge&logo=appveyor)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Develop-MongoDB-green?style=for-the-badge&logo=appveyor)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Develop-REST%20RESTful-red?style=for-the-badge&logo=appveyor)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/Develop-POO-pink?style=for-the-badge&logo=appveyor)](https://shields.io/)

<br/> 
<h3>Uma API desenvolvida em TypeScript utilizando os padrões REST.</h3>

<br/>
<h3>Rodando o app via Docker</h3>

<p>Para rodar o projeto via docker, basta executar dois comandos. Os comandos devem ser executados a partir da raiz do projeto, sendo o primeiro para buildar a imagem:</p>

    docker build -t rest-api .

<p>Na sequencia basta executar o comando que vai levantar o container a partir da imagem criada:</p>

    docker run -e PORT=3001 -e JWT_SECRET=secret -e MONGO_DB_HOST=127.0.0.1:27017 -e MONGO_DB=users-api -d -p 3001:3001 rest-api

