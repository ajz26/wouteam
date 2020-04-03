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



<!-- friend request -->

# crear una solicitud de amistad

endpoint (post) : /friend-request/

fields:
{
    friend: objectID('id del usuario a invitar')
}
*cuando un usuario haya sido invitado exitosamente*
{
    "response": "success",
    "msg": "solicitud de amistad creada con exito"
}

*cuando un usuario ya haya sido invitado*
{
    "response": "error",
    "msg": "ya has invitado a este usuario"
}


# obtiene una lista de todas las solicitudes pendientes

endpoint (GET) : /friend-request/

{
    "response": "success",
    "msg": "Solicitudes de amistad cargadas con exito",
    "request": {
        "_id": "5e87ba33df1c6530702114e0",
        "sender": {
            "_id": "5e8504ab559b741d78640bf4",
            "name": "tony",
            "email": "hola@obser.co"
        },
        "receptor": {
            "_id": "5e8103a520bfb956d813772c",
            "name": "tony",
            "email": "zambranoantoo@gmail.com",
            "lastName": "Zambrano"
        },
        "date": "2020-04-03T22:35:31.407Z",
        "__v": 0
    }
}

*cuando un usuario ya haya sido invitado*
{
    "response": "error",
    "msg": "ha ocurrido un error"
}


# obtiene una lista de todas las solicitudes pendientes

endpoint (GET) : /friend-request?all=true

{
    "response": "success",
    "msg": "Solicitudes de amistad cargadas con exito",
    "request": [
        {
            "_id": "5e87a2d1f8078d3bc89ec128",
            "sender": {
                "_id": "5e8504ab559b741d78640bf4",
                "name": "tony",
                "email": "hola@obser.co"
            },
            "receptor": {
                "_id": "5e8103a520bfb956d813772c",
                "name": "tony",
                "email": "zambranoantoo@gmail.com",
                "lastName": "Zambrano"
            },
            "date": "2020-04-03T20:55:45.932Z",
            "__v": 0,
            "is_accepted": {
                "date": "2020-04-03T21:39:32.000Z",
                "response": false
            }
        },
        {
            "_id": "5e87ba33df1c6530702114e0",
            "sender": {
                "_id": "5e8504ab559b741d78640bf4",
                "name": "tony",
                "email": "hola@obser.co"
            },
            "receptor": {
                "_id": "5e8103a520bfb956d813772c",
                "name": "tony",
                "email": "zambranoantoo@gmail.com",
                "lastName": "Zambrano"
            },
            "date": "2020-04-03T22:35:31.407Z",
            "__v": 0
        }
    ]
}

*cuando un usuario ya haya sido invitado*
{
    "response": "error",
    "msg": "ha ocurrido un error"
}





# Aceptar invitación

endpoint (post) : /accept/:invitation

params{
    invitation: objectID('id de la invitación')
}

fields:
{
    response: Boolean
}

*response*
success:

{
    "response": "success",
    "msg": "Invitación respondida exitosamente",
    "request": {
        "_id": "5e87ba33df1c6530702114e0",
        "sender": {
            "_id": "5e8504ab559b741d78640bf4",
            "name": "tony",
            "email": "hola@obser.co"
        },
        "receptor": {
            "_id": "5e8103a520bfb956d813772c",
            "name": "tony",
            "email": "zambranoantoo@gmail.com",
            "lastName": "Zambrano"
        },
        "date": "2020-04-03T22:35:31.407Z",
        "__v": 0,
        "is_accepted": {
            "date": "2020-04-03T23:06:05.000Z",
            "response": true
        }
    }
}


error:
{
    "response": "error",
    "msg": "esta solicitud ya fue aceptada"
}

*cuando un usuario haya sido invitado exitosamente*