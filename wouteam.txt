usuario{
nombre
correo: unico*
profesion:
avatar:
status
register:date,
amigos
}

proyectos:{
nombre:
status:
descripción:
creator:
team:[]
date:date
startDate:date
endDate:date
progress,
}

Tareas:{
title:
description:
Project:
creator:
prioridad:
encargado:[]
status:boolean
date:date
startDate:date
endDate:date
progress,
}


Wouteam

api: https://apiwouteam.herokuapp.com/api/v1/ 

Register: 
POST: /user/new

fields:
name : string
email : email
password : password

Login
POST: /auth/

fields:
email : email
password : password

*Solicitud de recuperacion de contraseña*

endpoint: /reset-password/

fields:
email

esto retorna un token, la idea es que llegue al correo del solicitante, pero todavia no está hecha la parte de correos :$

*Recuperacion de contraseña*

el token generado por el anterior endpoint se pasa como parametro en la urlpara recuperar la contraseña

endpoint: /reset-password/:token

fields:
password


*Crear nuevo proyecto*

headers: x-auth-token: (Debes pasar el token por header)

endpoint: (POST): /projects/

fields:
name


*Listar proyectos del usuario*

headers: x-auth-token: (Debes pasar el token por header)

endpoint: (GET): /projects/


*Detalle del proyecto*

headers: x-auth-token: (Debes pasar el token por header)

endpoint: (GET): /projects/:projectID


*Eliminar proyecto proyecto*

headers: x-auth-token: (Debes pasar el token por header)

endpoint: (DELETE): /projects/

fields:
project : (id)


Tareas

Crear tarea

headers: x-auth-token: (Debes pasar el token por header)

IDProyect: el id del proyecto para el que se crea la tarea

endpoint: (POST): /task/:IDProyect/

fields:
title
description
