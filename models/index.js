var path =require('path');

//Cargar modelo ORM
var Sequelize = require('sequelize');
//Usar BBDD SQlite
// DATABASE_URL =sqlite:///
// DATABASE_STORAGE =quiz.squlite
//Usar BDD Postgres:
//	DATABASE_URL0 postgres://user:passwd@host:port/database

var url,storage;
if(!process.env.DATABASE_URL){
	url = "sqlite:///";
	storage = "quiz.sqlite";
}else{
	url = process.env.DATABASE_URL;
	storage = process.env.DATABASE_STORAGE || "";
}
var sequelize = new Sequelize(url,
	{storage: storage,
	omitNull: true	

});
//Importar la definición de la tabla Quiz de quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//sequelize.sync() crea e inicializa tabla de preguntas
sequelize
.sync()
.then(function(){
	return Quiz.count()
		.then(function (c) {
			if(c === 0){
				return Quiz.create({question: 'Capital de Italia', answer: 'Roma'})
					.then(function(){
						console.log('Base de datos inicializada con datos');
					});
			}
			else{console.log('La base de datos no está vacía');}
		});
}).catch(function(error){
	console.log("Error Sincronizando las tablas de la BBDD:",error);
	process.exit(1);
});
exports.Quiz = Quiz;