# boilerplate-formacion-node-react

Este es un PET project que simula las características de un eccommerce, y que se ha realizado con el objetivo de mejorar y desarrollar las competencias de backend. Se ha realizado partiendo de un proyecto base proporcionado por la empresa de formación y progresivamente se le han ido añadiendo funcionales por módulo y ejercicio desarrolladas por ramas. 


## Estructura ##
Este proyecto posee dos ramas:

• **main:** contiene el proyecto base sin las funcionales/ejercicios añadidos.  
• **módulo-4-ejercicio-3:** rama final en la que se encuentran todos los ejercicios añadidos
## Requisitos no funcionales ## 

• Docker  
• NodeJS con Express  
• Javascript  
• Sequelize  
• MySQL

## Instalación y ejecución ##

**Primero:** se clona el repositorio con: `git clone https://github.com/ana-valdemoro/app1-node-backend.git`   
**Segundo:** Dentro del proyecto, se accede a la carpeta `src/docker` y ejecutamos el archivo `build-docker-compose.sh` para construir e iniciar los contenedores de docker. También disponemos de los archivos `start-docker-compose.sh` y `stop-docker-compose.sh` para iniciar y parar los contenedores.  
**Tercero:** instalamos las dependecias del proyecto para tener acceso a sequelize y poder migrar y poblar las tablas. Ejecutamos `npm install`.  
**Cuarto:** Nos situamos en el directorio `src/src` y ejecutamos el comando `npx sequelize-cli db:migrate` y  `npx sequelize-cli db:seed:all`. Sino tenemos `npx` previamente lo instalamos con `npm install px`.

## Notas ##
Este proyecto posee una parte de front que se encuentra en el repositorio: app1-frontend
