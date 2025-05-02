Editor de Alineaciones de Fútbol
Este proyecto es una aplicación web que permite crear y gestionar alineaciones de partidos de fútbol, con opciones para configurar el horario, costo, formación de equipos y compartir los resultados. Está diseñada para ser intuitiva y visual, con un campo de fútbol interactivo y controles para organizar jugadores.
La aplicación está alojada en GitHub Pages y puede accederse en: https://juancruzdal.github.io.
Características

Configuración del partido:
Establece el horario (hora y minutos) con botones o entrada manual.
Define el costo del partido.
Selecciona formaciones (5 vs 5, 6 vs 6, 7 vs 7).


Gestión de jugadores:
Ingresa nombres de jugadores en un área de texto (uno por línea).
Genera equipos automáticamente dividiendo a los jugadores en dos grupos (Equipo Claro y Equipo Oscuro).
Intercambia posiciones de jugadores en el campo haciendo clic.


Visualización:
Campo de fútbol con líneas, áreas de gol y círculo central.
Jugadores representados como botones posicionados según la formación.
Información del partido (hora y costo) mostrada en el centro del campo.


Compartir:
Copia las alineaciones como texto para compartir en aplicaciones como WhatsApp.
Genera y copia una imagen del campo (720x1080 px, optimizada para vistas previas de WhatsApp).


Diseño responsivo:
Adaptado para dispositivos móviles, tabletas y escritorios.


Favicon SVG:
Ícono de página definido como SVG inline en el HTML.



Tecnologías Utilizadas

HTML: Estructura de la aplicación (index.html).
CSS: Estilos personalizados y responsivos (styles.css).
JavaScript: Lógica interactiva, incluyendo gestión de jugadores y generación de imágenes con html2canvas (script.js).
GitHub Pages: Hospedaje de la aplicación web.
SVG: Favicon definido como data URL en el HTML.

Instalación y Uso
Prerrequisitos

Un navegador web moderno (Chrome, Firefox, Edge, Safari).
Acceso a GitHub para clonar o modificar el repositorio.

Configuración Local

Clona el repositorio:git clone https://github.com/juancruzdal/juancruzdal.github.io.git


Navega al directorio del proyecto:cd juancruzdal.github.io


Abre index.html en un navegador:
Usa un servidor local (recomendado) para evitar problemas de CORS con html2canvas:npx http-server

Luego, accede a http://localhost:8080.
O abre directamente index.html con doble clic (algunas funciones, como copiar imágenes, podrían no funcionar correctamente).



Uso en GitHub Pages

La aplicación está desplegada en https://juancruzdal.github.io.
Accede a la URL para usar la aplicación directamente.
Los cambios subidos a la rama main del repositorio se reflejan en GitHub Pages en 1-10 minutos.

Instrucciones de Uso

Configura el partido:
Ajusta la hora y minutos con los botones (+/-) o escribe manualmente.
Define el costo del partido.
Selecciona una formación (5 vs 5, 6 vs 6, o 7 vs 7).


Ingresa jugadores:
Escribe los nombres de los jugadores en el área de texto, uno por línea.
Haz clic en "Generar Equipos" para dividirlos en Equipo Claro y Equipo Oscuro.


Organiza alineaciones:
Haz clic en un jugador en el campo para seleccionarlo, luego en otro para intercambiar sus posiciones.
Los jugadores se posicionan automáticamente según la formación seleccionada.


Comparte:
Usa el botón "Compartir" para enviar las alineaciones como texto.
Usa "Copiar Imagen" para generar una imagen del campo (720x1080 px, optimizada para WhatsApp).
Usa "Copiar Texto" para copiar las alineaciones en formato de texto.



Estructura del Proyecto
juancruzdal.github.io/
├── index.html        # Página principal con la estructura HTML
├── styles.css        # Estilos CSS responsivos
├── script.js         # Lógica JavaScript para interactividad
└── README.md         # Documentación del proyecto

Notas Adicionales

Optimización para WhatsApp:
La imagen generada por "Copiar Imagen" tiene dimensiones de 720x1080 px, cercanas al aspecto 1.91:1 recomendado para vistas previas de WhatsApp.
Asegúrate de que los nombres de los jugadores sean cortos para que se muestren completos en los botones del campo.


Compatibilidad:
El favicon SVG funciona en navegadores modernos, pero puede no mostrarse en navegadores antiguos.
La función de copiar imágenes requiere cargar html2canvas dinámicamente desde un CDN.


Mejoras futuras:
Agregar soporte para guardar alineaciones localmente.
Permitir personalización de colores del campo o jugadores.
Mejorar el manejo de emojis y reservas en la lista de jugadores.



Contribuir

Haz un fork del repositorio.
Crea una rama para tus cambios:git checkout -b mi-nueva-funcionalidad


Realiza los cambios y haz commit:git commit -m "Añadir nueva funcionalidad"


Sube los cambios a tu fork:git push origin mi-nueva-funcionalidad


Crea un Pull Request en el repositorio original.

Licencia
Este proyecto está bajo la Licencia MIT. Siéntete libre de usar, modificar y distribuir el código según los términos de la licencia.
Contacto
Creado por juancruzdal. Para sugerencias o problemas, abre un issue en el repositorio.
