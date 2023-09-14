# Backend de la Prueba Técnica

Este repositorio contiene el código y los archivos relacionados con la parte del backend de la prueba técnica para el Grupo Penna.

## Ejecución del Backend

Para ejecutar el backend en tu máquina local, sigue estos pasos:

### Requisitos Previos

- [Node.js](https://nodejs.org/) instalado en tu sistema.
- Este repositorio clonado en tu máquina local.

### Pasos

1. Abre una terminal y navega hasta la carpeta "backend" del repositorio:

    ```bash
    cd backend
    ```

2. Instalar dependencias

    ```bash
    npm install
    ```

3. Una vez que todo esté configurado, inicia el servidor con el siguiente comando:
    ```bash
    npm start
    ```

4. El servidor estará en funcionamiento en http://localhost:3001. (Puedes configurar el puerto en el archivo `server.js` )

## Ejecución de pruebas

- Para ejecutar las pruebas, utiliza el siguiente comando:

    ```bash
    npm run test:routes
    ```

- Este comando ejecutará las pruebas automatizadas relacionadas con las rutas y endpoints de la aplicación backend.
