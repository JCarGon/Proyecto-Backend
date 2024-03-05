# Proyecto Fin de Ciclo - Frikilevel API -

Esta API está diseñada para consultar, crear, modificar y/o eliminar usuarios y figuras de anime mediante peticiones en un servidor creado con express. Dichos usuarios y figuras se crearán en una base de datos mongo desplegada en mongoDB Atlas.

Unida al front hecho con React y CSS, tenemos la aplicación web de 'Frikilevel', la cual es una simulación de tienda online a través de la cual se pueden realizar pedidos o compras de figuras de diferentes animes mediante una interfaz para el usuario.

> [!CAUTION]
> Para utilizar esta API se necesitará crear un archvo .env con variables de entorno, las cuales deberás contactar con el administrador de esta API, ya que encontrarás las variables necesarias en el archivo '.env.template', pero no encontrarás el contenido de las variables.

> [!IMPORTANT]
> Lo primero que se debe realizar antes de arrancar el proyecto para evitar problemas es instalar las dependencias necesarias, ejecutando el comando:
> ~~~
> npm install
> ~~~
>Hay veces que no las instala todas y hay que instalar alguna de manera concreta con:
> ~~~
> npm install 'dependency-name'
> ~~~

## Routes

- Las diferentes rutas de la API las podrás encontrar en './src/routes/index.js'.
- En el mismo directorio, encontrarás:
  - un archivo 'admin-router.js' que contiene peticiones para gestionar usuarios y figuras como admin a diferentes endpoints, pasando primero por '/admin'.
  - un archivo 'figure-router.js' que contiene peticiones GET para listar varias figuras o una sola figura, realizando peticiones a los endpoints '/figures'.
  - un archivo 'misc-router.js' que contiene una petición a '/ping' que sirve para comprobar si está recibiendo y respondiendo peticiones.
  - un archivo 'user-router' que contiene peticiones para gestionar al usuario activo, pasando primero por '/users'.

> [!NOTE]
> Encontrarás ciertos métodos que requieren de autorización/autenticación.

Esta autorización/autenticación ha sido generada con JsonWebToken (JWT), utilizando también 'bcrypt' para encriptar y comparar contraseña entrante de la petición con contraseña encriptada.

## Middlewares

> [!NOTE]
> Los encontrarás en el directorio './src/middlewares/'.

Se han utilizado middlewares para:
- 'admin-middleware.js': comprobar si quien está haciendo la petición es admin (para las peticiones que necesitan esta autenticación).
- 'auth-middleware.js': autenticar el token con JWT (comprobar si ha sido generado correctamente y si no ha expirado).
- 'error-middleware.js': control de error genérico para los Internal Server Error (status code 500).

## Peticiones

En esta API se podrá realizar las siguientes peticiones:
- Login para registrarte y obtener autenticación para ciertas peticiones.
- Logout para cerrar sesión y eliminar el token.
- Listar todos los usuarios.
- Listar un usuario con todos sus atributos.
- Crear, modificar o eliminar un usuario (haciendo diferencia entre user y admin):
  - Si eres user solo podrás modificar o eliminar tu usuario.
  - Si eres admin, podrás modificar o eliminar cualquier usuario, además de crear otro usuario 'admin'.
- Listar las figuras existentes.
- Listar una sola figura con todos sus atributos.
- Crear, modificar o eliminar una figura (solo si eres admin).

La información sobre cada una de las peticiones que se pueden hacer a la API la encontrarás en el **swagger**, el cual:
- Está ubicado en './src/openapi/openapi.yml'.
- Una vez arrancado el servidor en local, deberás entrar a 'localhost:PORT/api-docs' (indicado en './src/loaders/express-loader.js').
> [!IMPORTANT]
> El Swagger aún está en proceso

## Lógica de peticiones

> [!NOTE]
> Los encontrarás en el directorio './src/services/'.

Previamente, cada ruta pasa por su controlador ('en el directorio './src/controllers/'), quien las deriva al servicio correspondiente. Estos, se encuentran en './src/services/', donde hay:
- '/admin/admin-service.js': contiene la lógica de todas las peticiones que puede realizar un usuario admin.
- '/figures/figures-service.js': contiene la lógica de las peticiones GET para obtener información de las figuras.
- '/users/user-db-service.js': contiene la lógica para las peticiones que pueden realizarse sobre el usuario que tiene una sesión activa.

## Postman

Encontrarás los archivos necesarios para importar, tanto la colección de postman con las peticiones creadas y listas para ejecutarse ('Frikilevel-API.postman_collection.json'), como el archivo que contiene el entorno ('Frikilevel-API.postman_environment') en './Postman/'.
