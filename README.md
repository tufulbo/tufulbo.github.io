
# ⚽ Soccer Lineup Maker (Organizador de Formaciones) ⚽

Una aplicación web para crear y compartir alineaciones de partidos de fútbol, con un campo interactivo y controles sencillos.  
**Desplegada en:** [https://juancruzdal.github.io](https://juancruzdal.github.io)


![image](https://github.com/user-attachments/assets/955c46aa-2f35-4e57-b6b0-a1fd657a1b3b)

---

## ✨ Características

- **Configura el partido:** Ajusta hora, costo y formación (5v5, 6v6, 7v7).
- **Organiza equipos:** Ingresa nombres de jugadores y genera dos equipos automáticamente.
- **Campo interactivo:** Intercambia posiciones de jugadores con clics.
- **Comparte fácilmente:**
  - Copia alineaciones como texto.
  - Genera imágenes (720x1080 px, optimizadas para WhatsApp).
- **Diseño responsivo:** Funciona en móviles, tabletas y escritorios.
- **Favicon SVG:** Ícono de página definido en el HTML.

---

## 🛠 Tecnologías

- **HTML:** Estructura (`index.html`)
- **CSS:** Estilos responsivos (`styles.css`)
- **JavaScript:** Interactividad y generación de imágenes con [html2canvas](https://html2canvas.hertzen.com/) (`script.js`)
- **GitHub Pages:** Hospedaje

---

## 🚀 Cómo Usar

### En GitHub Pages

1. Visita: [https://juancruzdal.github.io](https://juancruzdal.github.io)  
2. Los cambios en la rama `main` se reflejan en 1 a 10 minutos.

### Localmente

```bash
git clone https://github.com/juancruzdal/juancruzdal.github.io.git
cd juancruzdal.github.io
npx http-server
```

Accede a: [http://localhost:8080](http://localhost:8080)

---

## 📋 Instrucciones

1. Ajusta hora, costo y formación.
2. Ingresa nombres de jugadores (uno por línea) y haz clic en **Generar Equipos**.
3. Intercambia jugadores en el campo con clics.
4. Usa los botones **Compartir**, **Copiar Imagen** o **Copiar Texto** para compartir.

---

## 📂 Estructura del Proyecto

```
juancruzdal.github.io/
├── index.html      # Página principal
├── styles.css      # Estilos
├── script.js       # Lógica JavaScript
└── README.md       # Documentación
```

---

## 📝 Notas

- **WhatsApp:** Las imágenes generadas (720x1080 px) están optimizadas para vistas previas.
- **Compatibilidad:** El favicon SVG funciona en navegadores modernos.

### 🚧 Mejoras futuras

- Guardar alineaciones localmente.
- Personalizar colores del campo.

---

## 🤝 Contribuir

1. Haz un **fork** del repositorio.
2. Crea una nueva rama:
   ```bash
   git checkout -b mi-funcionalidad
   ```
3. Realiza tus cambios y haz commit:
   ```bash
   git commit -m "Nueva funcionalidad"
   ```
4. Sube tu rama:
   ```bash
   git push origin mi-funcionalidad
   ```
5. Crea un **Pull Request**.

---

## 📜 Licencia

Distribuido bajo la licencia **MIT**.

---

## 📬 Contacto

Creado por [juancruzdal](https://github.com/juancruzdal).  
¿Sugerencias o problemas? ¡[Abre un issue](https://github.com/juancruzdal/juancruzdal.github.io/issues)!
