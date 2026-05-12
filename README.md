# TheLuckyCookie
Galleta de la Suerte - Fortuna Diaria

# 🥠 Galleta de la Suerte

> Una Progressive Web App (PWA) interactiva que te brinda una fortuna diaria con mensajes inspiradores, números de la suerte y tu horóscopo del día.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PWA](https://img.shields.io/badge/PWA-Ready-blue.svg)](https://developers.google.com/web/progressive-web-apps)
[![Responsive](https://img.shields.io/badge/Responsive-Yes-green.svg)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

## 📱 Descripción

**Galleta de la Suerte** es una aplicación web progresiva que simula la experiencia de abrir una galleta de la fortuna china. Cada 24 horas, los usuarios pueden abrir una nueva galleta y recibir:

- 💬 **Mensaje inspirador** de 4 categorías (Superación, Amor, Fortuna, Sabiduría)
- 🔢 **3 números de la suerte** en forma de pirámide
- ⭐ **Signo zodiacal del día** con decanato personalizado
- 🎨 **4 temas visuales** (Oriental, Navidad, Halloween, San Valentín)
- 📜 **Historial** de las últimas 3 fortunas
- 🔊 **Sonido mágico** al abrir la galleta
- 📱 **Compartir** en redes sociales (Instagram, X, Facebook)

---

## ✨ Características Principales

### 🎯 Funcionalidades Core
- ⏰ **Sistema de bloqueo de 24 horas** - Una fortuna por día
- 🔄 **Funciona offline** - Service Worker implementado
- 📲 **Instalable** - Se puede agregar a la pantalla de inicio
- 🎨 **Temas dinámicos** - 4 temas visuales diferentes
- 🌐 **100% Responsive** - Funciona en todos los dispositivos

### 🎭 Experiencia de Usuario
- ✨ **Animaciones suaves** estilo Disney
- 🎆 **Efectos visuales** (confeti, luz brillante, temblor)
- 🔊 **Sonido mágico** generado con Web Audio API
- 📜 **Historial personal** de fortunas
- 🎨 **Diseño minimalista** y elegante

### 🔗 Funciones Sociales
- 📷 **Instagram** - Copia texto al portapapeles
- 𝕏 **X (Twitter)** - Comparte directamente
- 📘 **Facebook** - Comparte en tu muro

---

## 🚀 Demo en Vivo

🔗 **[Ver Demo](https://tu-usuario.github.io/galleta-suerte)** _(Próximamente)_

---

## 📸 Capturas de Pantalla

### Pantalla Principal
![Galleta Bloqueada](screenshots/locked.png)
_Temporizador de cuenta regresiva_

### Galleta Desbloqueada
![Galleta Lista](screenshots/unlocked.png)
_Lista para abrir_

### Mensaje de Fortuna
![Fortuna](screenshots/fortune.png)
_Mensaje inspirador con números de la suerte_

### Historial
![Historial](screenshots/history.png)
_Últimas 3 fortunas_

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Animaciones y diseño responsive
- **JavaScript ES6+** - Lógica de la aplicación

### PWA
- **Service Worker** - Funcionalidad offline
- **Web App Manifest** - Instalación en dispositivos
- **LocalStorage** - Persistencia de datos

### APIs
- **Web Audio API** - Generación de sonidos
- **Notification API** - Notificaciones push
- **Clipboard API** - Copiar al portapapeles

---

## 📦 Instalación y Uso

### Opción 1: Uso Directo (Recomendado)
```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/galleta-suerte.git

# 2. Navegar al directorio
cd galleta-suerte

# 3. Abrir index.html en tu navegador
# O usar Live Server en VS Code
```

### Opción 2: Instalar como PWA
1. Abre la app en Chrome/Edge
2. Haz clic en el icono de instalación en la barra de direcciones
3. Confirma la instalación
4. ¡Listo! Ahora funciona como app nativa

---

## ⚙️ Configuración

### Modo de Prueba
Por defecto, la app está en modo de prueba (10 segundos de espera):

```javascript
// En app.js línea 3
const CONFIG = {
    TEST_MODE: true,  // Cambiar a false para producción (24 horas)
    THEME_MODE: 'oriental', // Tema por defecto
    // ...
};
```

### Cambiar Tema
```javascript
// En app.js línea 6
THEME_MODE: 'oriental', // Opciones: 'oriental', 'navidad', 'halloween', 'valentine'
```

---

## 📁 Estructura del Proyecto

```
galleta-suerte/
├── index.html              # Página principal
├── app.js                  # Lógica de la aplicación
├── style.css               # Estilos base
├── manifest.json           # Configuración PWA
├── sw.js                   # Service Worker
├── themes/                 # Temas visuales
│   ├── oriental.css
│   ├── navidad.css
│   ├── halloween.css
│   └── valentine.css
├── assets/                 # Recursos
│   └── icons/              # Iconos PWA
├── .gitignore              # Archivos ignorados
├── .gitattributes          # Configuración Git
├── LICENSE                 # Licencia MIT
├── README.md               # Este archivo
├── CHANGELOG.md            # Registro de cambios
└── SEGURIDAD_LOCALSTORAGE.md  # Documentación de seguridad
```

---

## 🎨 Temas Disponibles

| Tema | Descripción | Colores |
|------|-------------|---------|
| 🥠 **Oriental** | Tema clásico dorado | Dorado, Rojo, Negro |
| 🎄 **Navidad** | Tema festivo navideño | Rojo, Verde, Blanco |
| 🎃 **Halloween** | Tema oscuro y misterioso | Naranja, Negro, Morado |
| 💝 **San Valentín** | Tema romántico | Rosa, Rojo, Blanco |

---

## 📊 Características Técnicas

### Performance
- ⚡ **Carga rápida** - Sin dependencias externas
- 💾 **Tamaño pequeño** - ~50KB total
- 🔄 **Cache inteligente** - Service Worker optimizado
- 📱 **Mobile-first** - Diseñado para móviles

### Compatibilidad
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Accesibilidad
- ♿ Semántica HTML5
- 🎨 Contraste de colores adecuado
- ⌨️ Navegación por teclado
- 📱 Touch-friendly

---

## 🔒 Seguridad

La app implementa validación de datos en localStorage. Para más información, consulta:
- 📄 [SEGURIDAD_LOCALSTORAGE.md](SEGURIDAD_LOCALSTORAGE.md)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si quieres mejorar la app:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Roadmap

### Versión 2.1 (Próximamente)
- [ ] Validación de localStorage con hash
- [ ] Estadísticas personales (galletas abiertas, racha)
- [ ] Modo oscuro/claro
- [ ] Más temas visuales

### Versión 3.0 (Futuro)
- [ ] Backend con Node.js
- [ ] Base de datos de usuarios
- [ ] Compartir fortunas con amigos
- [ ] Logros y recompensas
- [ ] Soporte multiidioma

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2024 atack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👨‍💻 Autor

**atack**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Portfolio: [tu-portfolio.com](https://tu-portfolio.com)

---

## 🙏 Agradecimientos

- Inspirado en las tradicionales galletas de la fortuna chinas
- Iconos de emojis nativos
- Animaciones inspiradas en Disney
- Comunidad de desarrolladores web

---

## 📞 Contacto

¿Tienes preguntas o sugerencias? 

- 📧 Email: tu-email@ejemplo.com
- 💬 Issues: [GitHub Issues](https://github.com/tu-usuario/galleta-suerte/issues)
- 🐦 Twitter: [@tu-usuario](https://twitter.com/tu-usuario)

---

## ⭐ Dale una Estrella

Si te gustó este proyecto, ¡dale una estrella! ⭐

---

<div align="center">

**Hecho con ❤️ por atack**

🥠 *"La fortuna favorece a los valientes"* 🥠

</div>
