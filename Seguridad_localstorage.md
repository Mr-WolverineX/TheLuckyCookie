# 🔒 Seguridad y Validación de LocalStorage

## 📋 Descripción

Este documento describe las vulnerabilidades actuales del sistema de almacenamiento local y las soluciones propuestas para mejorar la seguridad de la aplicación **Galleta de la Suerte**.

---

## ⚠️ VULNERABILIDADES ACTUALES

### 1. **Manipulación del Timestamp**
**Problema:** Un usuario puede modificar el valor de `lastOpened` en localStorage para desbloquear la galleta antes de tiempo.

```javascript
// Usuario puede ejecutar en consola:
localStorage.setItem('fortuneCookieData', JSON.stringify({
    lastOpened: 0  // Esto desbloquea la galleta inmediatamente
}));
```

**Impacto:** El usuario puede abrir galletas ilimitadas sin esperar 24 horas.

---

### 2. **Datos No Validados**
**Problema:** No hay validación de que los datos en localStorage sean válidos o no estén corruptos.

```javascript
// Datos corruptos pueden causar errores:
localStorage.setItem('fortuneCookieData', 'datos-invalidos');
```

**Impacto:** La aplicación puede fallar o comportarse de manera inesperada.

---

### 3. **Sin Protección contra Timestamps Futuros**
**Problema:** Un usuario puede establecer un timestamp en el futuro.

```javascript
localStorage.setItem('fortuneCookieData', JSON.stringify({
    lastOpened: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 año en el futuro
}));
```

**Impacto:** La galleta quedará bloqueada por mucho tiempo.

---

## ✅ SOLUCIONES PROPUESTAS

### Solución 1: **Validación de Datos con Try-Catch**

```javascript
function loadState() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        
        if (!saved) {
            return; // No hay datos guardados
        }
        
        const data = JSON.parse(saved);
        
        // Validar que lastOpened sea un número válido
        if (typeof data.lastOpened !== 'number' || isNaN(data.lastOpened)) {
            console.warn('⚠️ Datos inválidos detectados. Limpiando localStorage...');
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            return;
        }
        
        // Validar que el timestamp no sea negativo
        if (data.lastOpened < 0) {
            console.warn('⚠️ Timestamp negativo detectado. Limpiando...');
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            return;
        }
        
        // Validar que el timestamp no sea del futuro
        const now = Date.now();
        if (data.lastOpened > now) {
            console.warn('⚠️ Timestamp del futuro detectado. Ajustando a ahora...');
            data.lastOpened = now;
        }
        
        appState.lastOpened = data.lastOpened;
        
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        localStorage.removeItem(CONFIG.STORAGE_KEY);
    }
    
    // Aplicar tema
    appState.currentTheme = CONFIG.THEME_MODE;
    applyTheme(CONFIG.THEME_MODE);
}
```

**Qué resuelve:**
- ✅ Protege contra datos corruptos
- ✅ Valida que el timestamp sea un número válido
- ✅ Previene timestamps negativos
- ✅ Ajusta timestamps del futuro
- ✅ Limpia automáticamente datos inválidos

---

### Solución 2: **Hash de Verificación (Avanzado)**

```javascript
// Función para generar hash simple
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir a 32bit integer
    }
    return hash.toString(36);
}

// Guardar con hash
function saveState() {
    const data = {
        lastOpened: appState.lastOpened,
        timestamp: Date.now()
    };
    
    const dataString = JSON.stringify(data);
    const hash = simpleHash(dataString + 'SECRET_KEY_123'); // Clave secreta
    
    localStorage.setItem(CONFIG.STORAGE_KEY, dataString);
    localStorage.setItem(CONFIG.STORAGE_KEY + '_hash', hash);
}

// Cargar con verificación de hash
function loadState() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        const savedHash = localStorage.getItem(CONFIG.STORAGE_KEY + '_hash');
        
        if (!saved || !savedHash) {
            return;
        }
        
        // Verificar integridad
        const expectedHash = simpleHash(saved + 'SECRET_KEY_123');
        if (expectedHash !== savedHash) {
            console.warn('⚠️ Datos manipulados detectados. Limpiando...');
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            localStorage.removeItem(CONFIG.STORAGE_KEY + '_hash');
            return;
        }
        
        const data = JSON.parse(saved);
        appState.lastOpened = data.lastOpened;
        
    } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        localStorage.clear();
    }
}
```

**Qué resuelve:**
- ✅ Detecta si los datos fueron modificados manualmente
- ✅ Invalida datos manipulados automáticamente
- ✅ Agrega una capa extra de seguridad

---

### Solución 3: **Límite de Intentos Sospechosos**

```javascript
const SUSPICIOUS_KEY = 'suspiciousAttempts';
const MAX_SUSPICIOUS = 5;

function detectSuspiciousActivity() {
    const now = Date.now();
    const lastOpened = appState.lastOpened || 0;
    const timeSinceLastOpen = now - lastOpened;
    const duration = CONFIG.TEST_MODE ? CONFIG.TEST_DURATION : CONFIG.LOCK_DURATION;
    
    // Si el tiempo restante es negativo pero muy pequeño (manipulación)
    if (timeSinceLastOpen > duration && timeSinceLastOpen < duration + 1000) {
        let attempts = parseInt(localStorage.getItem(SUSPICIOUS_KEY) || '0');
        attempts++;
        
        localStorage.setItem(SUSPICIOUS_KEY, attempts.toString());
        
        if (attempts >= MAX_SUSPICIOUS) {
            console.warn('🚨 Actividad sospechosa detectada. Bloqueando por 1 hora extra.');
            appState.lastOpened = now; // Resetear el tiempo
            localStorage.setItem(SUSPICIOUS_KEY, '0');
        }
    }
}
```

**Qué resuelve:**
- ✅ Detecta intentos repetidos de manipulación
- ✅ Penaliza comportamiento sospechoso
- ✅ Disuade a usuarios de hacer trampa

---

## 🎯 RECOMENDACIÓN DE IMPLEMENTACIÓN

### **Nivel Básico (Recomendado para esta app):**
Implementar **Solución 1** - Es suficiente para una app de entretenimiento y no afecta la experiencia del usuario.

### **Nivel Intermedio:**
Implementar **Solución 1 + Solución 3** - Agrega detección de comportamiento sospechoso.

### **Nivel Avanzado:**
Implementar **Todas las soluciones** - Máxima seguridad, pero puede ser excesivo para una app simple.

---

## 📝 NOTAS IMPORTANTES

1. **LocalStorage NO es seguro:** Cualquier usuario con conocimientos técnicos puede modificarlo. Estas soluciones solo dificultan la manipulación, no la previenen al 100%.

2. **Para seguridad real:** Se necesitaría un backend que valide los timestamps en el servidor.

3. **Balance:** Para una app de entretenimiento como esta, la **Solución 1** es suficiente. No vale la pena complicar demasiado.

---

## 🔧 IMPLEMENTACIÓN RÁPIDA

Para implementar la validación básica, reemplaza la función `loadState()` en `app.js` con el código de la **Solución 1**.

**Tiempo estimado:** 5 minutos  
**Dificultad:** Baja  
**Impacto:** Alto

---

**Creado por:** atack  
**Fecha:** 2024  
**Versión:** 1.0
