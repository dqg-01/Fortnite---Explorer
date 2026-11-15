# Fortnite Explorer | Catálogo de Skins

Aplicación web interactiva desarrollada con **React y JavaScript**, que permite explorar skins de Fortnite utilizando una API pública.

## Funcionalidades

- Visualizar skins con imágenes, nombres y rarezas.
- Buscar personajes por nombre.
- Filtrar por rareza o serie.
- Agregar y eliminar skins de favoritos.
- Guardar favoritos en el navegador mediante `localStorage`.
- Consultar detalles de cada personaje.
- Cargar más skins y utilizar la página en dispositivos móviles.

## Tecnologías utilizadas

- **React:** construcción de la interfaz web.
- **JavaScript:** lógica, filtros e interactividad.
- **HTML y CSS:** estructura y diseño visual.
- **Vite:** servidor de desarrollo y compilación.
- **Node.js y npm:** herramientas para ejecutar e instalar dependencias.
- **Fortnite-API:** fuente de información de los personajes.

## API y módulos de JavaScript

Utilizamos [Fortnite-API](https://fortnite-api.com/) mediante el siguiente endpoint:

https://fortnite-api.com/v2/cosmetics/br

La aplicación consulta este endpoint mediante `fetch()`, recibe los datos en formato JSON y filtra los personajes de tipo `outfit`.

El código se organiza utilizando módulos:

- `src/services/fortniteApi.js`: consulta la API y exporta la función `obtenerSkins()`.
- `src/App.jsx`: importa esa función, procesa los datos y construye la interfaz.
- `src/App.css`: contiene los estilos de la página.
- `src/main.jsx`: inicia la aplicación React.

La comunicación entre archivos se realiza mediante `import` y `export`.

## Instalación y ejecución

**Requisitos:** Node.js, npm y conexión a internet.

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto en VS Code.
3. Abrir una terminal dentro de esa carpeta.
4. Instalar las dependencias:

```bash
npm install
```

5. Iniciar el servidor:

```bash
npm run dev
```

6. Abrir la dirección indicada por Vite, normalmente:

```text
http://localhost:5173/
```

Para detener el servidor, presionar `Ctrl + C`.

**Nota para Windows:** si PowerShell bloquea `npm.ps1`, utilizar `npm.cmd install` y `npm.cmd run dev`.

Para comprobar la compilación:

```bash
npm run build
```

## Funcionamiento general

1. React carga la página.
2. El módulo `fortniteApi.js` solicita los datos a Fortnite-API.
3. La API devuelve información en formato JSON.
4. JavaScript filtra los personajes y React los muestra en tarjetas.
5. El usuario puede buscar, filtrar y guardar favoritos.

Los favoritos se almacenan localmente en el navegador. No se utiliza una base de datos propia.

Proyecto académico desarrollado para demostrar el consumo de una API, el uso de React y la implementación de módulos de JavaScript.
