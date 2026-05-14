// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
    // MODO DE PRUEBA: Cambia a true para probar sin esperar 24 horas
    TEST_MODE: false, // ⚠️ Cambiar a true para pruebas, false para producción
    
    // TEMA: Cambia el tema según la temporada (solo para desarrollador)
    THEME_MODE: 'oriental', // Opciones: 'oriental', 'navidad', 'halloween', 'valentine'
    
    // Duración del bloqueo
    LOCK_DURATION: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
    TEST_DURATION: 10 * 1000, // 10 segundos para pruebas
    
    STORAGE_KEY: 'fortuneCookieData',
    THEME_KEY: 'fortuneCookieTheme'
};

// ===== ESTADO DE LA APLICACIÓN =====
let appState = {
    lastOpened: null,
    currentTheme: 'oriental',
    phrases: null,
    zodiacData: null,
    isUnlocked: false
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    loadState();
    initThemeSelector();
    updateUI();
    startTimer();
    requestNotificationPermission();
    
    // Event Listeners
    document.getElementById('cookie').addEventListener('click', handleCookieClick);
    document.getElementById('close-fortune').addEventListener('click', closeFortune);
    document.getElementById('view-history').addEventListener('click', showHistory);
    document.getElementById('close-history').addEventListener('click', closeHistory);
    
    // Botones de compartir
    document.getElementById('share-instagram').addEventListener('click', () => shareToSocial('instagram'));
    document.getElementById('share-twitter').addEventListener('click', () => shareToSocial('twitter'));
    document.getElementById('share-facebook').addEventListener('click', () => shareToSocial('facebook'));
});

// ===== CARGA DE DATOS =====
async function loadData() {
    // Datos embebidos directamente en el código para funcionar sin servidor
    appState.phrases = {
        "superacion": [
            "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
            "No cuentes los días, haz que los días cuenten.",
            "La única forma de hacer un gran trabajo es amar lo que haces.",
            "El fracaso es solo la oportunidad de comenzar de nuevo con más inteligencia.",
            "Tu única limitación es la que te impones a ti mismo.",
            "Los sueños no funcionan a menos que tú lo hagas.",
            "Cada día es una nueva oportunidad para cambiar tu vida.",
            "La perseverancia es la clave del éxito.",
            "No esperes el momento perfecto, toma el momento y hazlo perfecto.",
            "El camino hacia el éxito está siempre en construcción.",
            "Cree en ti mismo y todo será posible.",
            "La motivación te impulsa a comenzar, el hábito te mantiene en marcha.",
            "No te rindas, el comienzo es siempre el más difícil.",
            "Tu potencial es infinito, solo necesitas creer en él.",
            "Cada logro comienza con la decisión de intentarlo."
        ],
        "amor": [
            "El amor verdadero comienza cuando no esperas nada a cambio.",
            "Amar es encontrar en la felicidad de otro tu propia felicidad.",
            "El amor no se busca, se encuentra cuando menos lo esperas.",
            "Un corazón que ama es siempre joven.",
            "El amor es la única fuerza capaz de transformar un enemigo en amigo.",
            "Donde hay amor, hay vida.",
            "El amor no tiene edad, siempre está naciendo.",
            "Amar no es mirarse el uno al otro, sino mirar juntos en la misma dirección.",
            "El amor es la poesía de los sentidos.",
            "Un alma gemela es alguien que te entiende sin palabras.",
            "El amor verdadero no tiene final feliz, porque no tiene final.",
            "Amar es dar sin esperar recibir.",
            "El amor es el puente entre dos corazones.",
            "En el amor, la distancia no importa cuando los corazones están unidos.",
            "El amor es la respuesta, sin importar cuál sea la pregunta."
        ],
        "fortuna": [
            "La fortuna favorece a los valientes.",
            "La suerte es lo que sucede cuando la preparación se encuentra con la oportunidad.",
            "Hoy es tu día de suerte, aprovecha cada momento.",
            "La prosperidad está en camino hacia ti.",
            "Una gran oportunidad tocará tu puerta muy pronto.",
            "Tu esfuerzo será recompensado generosamente.",
            "El universo conspira a tu favor.",
            "La abundancia fluye hacia ti desde todas direcciones.",
            "Tus finanzas mejorarán significativamente este mes.",
            "Un encuentro fortuito cambiará tu destino.",
            "La riqueza no solo es dinero, es paz mental y felicidad.",
            "Estás en el lugar correcto en el momento correcto.",
            "Las puertas de la oportunidad se abren ante ti.",
            "Tu intuición te guiará hacia la prosperidad.",
            "La fortuna sonríe a quien trabaja con pasión."
        ],
        "sabiduria": [
            "La paciencia es la clave de la felicidad.",
            "El conocimiento habla, pero la sabiduría escucha.",
            "No es más rico quien más tiene, sino quien menos necesita.",
            "La vida es 10% lo que te sucede y 90% cómo reaccionas ante ello.",
            "El silencio es a veces la mejor respuesta.",
            "Aprende de ayer, vive el hoy, espera el mañana.",
            "La verdadera sabiduría está en reconocer la propia ignorancia.",
            "No juzgues cada día por la cosecha que recoges, sino por las semillas que plantas.",
            "El tiempo es el recurso más valioso que tienes.",
            "La felicidad no es hacer lo que uno quiere, sino querer lo que uno hace.",
            "El que pregunta es tonto por cinco minutos, el que no pregunta es tonto para siempre.",
            "La mejor inversión es en ti mismo.",
            "No cuentes los años, cuenta los momentos.",
            "La gratitud convierte lo que tenemos en suficiente.",
            "El cambio es la única constante en la vida."
        ]
    };
    
    appState.zodiacData = getCompleteZodiacData();
}

// ===== GESTIÓN DE ESTADO =====
function loadState() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        appState.lastOpened = data.lastOpened;
    }
    
    // Aplicar tema desde CONFIG.THEME_MODE (controlado por desarrollador)
    appState.currentTheme = CONFIG.THEME_MODE;
    applyTheme(CONFIG.THEME_MODE);
}

function saveState() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
        lastOpened: appState.lastOpened
    }));
}

// ===== TEMPORIZADOR =====
function startTimer() {
    updateTimer();
    setInterval(updateTimer, 1000);
}

function updateTimer() {
    const now = Date.now();
    
    if (!appState.lastOpened) {
        unlockCookie();
        return;
    }
    
    const timeSinceLastOpen = now - appState.lastOpened;
    // Usar duración de prueba si TEST_MODE está activado
    const duration = CONFIG.TEST_MODE ? CONFIG.TEST_DURATION : CONFIG.LOCK_DURATION;
    const timeRemaining = duration - timeSinceLastOpen;
    
    if (timeRemaining <= 0) {
        unlockCookie();
        sendNotification();
    } else {
        lockCookie();
        displayTimeRemaining(timeRemaining);
    }
}

function displayTimeRemaining(milliseconds) {
    // Calcular tiempo transcurrido desde el inicio (0) hasta 24 horas
    const totalDuration = CONFIG.TEST_MODE ? CONFIG.TEST_DURATION : CONFIG.LOCK_DURATION;
    const timeElapsed = totalDuration - milliseconds;
    
    // Mostrar en formato de cuenta regresiva desde 24:00:00 hasta 00:00:00
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// ===== CONTROL DE LA GALLETA =====
function unlockCookie() {
    appState.isUnlocked = true;
    const cookie = document.getElementById('cookie');
    const status = document.getElementById('cookie-status');
    
    cookie.classList.remove('locked');
    cookie.classList.add('unlocked');
    status.textContent = '¡Disponible! Haz clic para abrir';
    
    document.getElementById('timer-section').style.display = 'none';
}

function lockCookie() {
    appState.isUnlocked = false;
    const cookie = document.getElementById('cookie');
    const status = document.getElementById('cookie-status');
    
    cookie.classList.add('locked');
    cookie.classList.remove('unlocked');
    status.textContent = 'Bloqueada';
    
    document.getElementById('timer-section').style.display = 'block';
}

function handleCookieClick() {
    if (!appState.isUnlocked) {
        shakeCookie();
        return;
    }
    
    openCookie();
}

function shakeCookie() {
    const cookie = document.getElementById('cookie');
    cookie.style.animation = 'none';
    setTimeout(() => {
        cookie.style.animation = '';
        cookie.classList.add('shake');
        setTimeout(() => cookie.classList.remove('shake'), 500);
    }, 10);
}

function openCookie() {
    const cookie = document.getElementById('cookie');
    
    // FASE 1: Temblor (0-800ms)
    cookie.classList.add('shake');
    
    setTimeout(() => {
        cookie.classList.remove('shake');
        
        // FASE 2: Luz brillante (800-1600ms)
        createLightBurst();
        
        setTimeout(() => {
            // FASE 3: Apertura de la galleta (1600-2900ms)
            cookie.classList.add('opening');
            createConfetti();
            
            setTimeout(() => {
                // FASE 4: Mostrar fortuna con fade in (2900ms)
                showFortune();
                appState.lastOpened = Date.now();
                saveState();
                
                // Reset cookie
                cookie.classList.remove('opening', 'unlocked');
                cookie.classList.add('locked');
                
                updateTimer();
            }, 1300);
        }, 800);
    }, 800);
}

// ===== MOSTRAR FORTUNA =====
function showFortune() {
    const fortune = generateFortune();
    
    // No mostrar categoría, solo la frase
    document.getElementById('fortune-text').textContent = fortune.phrase;
    document.getElementById('zodiac-sign').textContent = fortune.zodiac.sign;
    document.getElementById('zodiac-decan').textContent = fortune.zodiac.decan;
    
    fortune.luckyNumbers.forEach((num, index) => {
        document.getElementById(`num${index + 1}`).textContent = num;
    });
    
    document.getElementById('fortune-message').classList.remove('hidden');
}

function closeFortune() {
    document.getElementById('fortune-message').classList.add('hidden');
}

function generateFortune() {
    // Seleccionar categoría aleatoria
    const categories = Object.keys(appState.phrases);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const phrases = appState.phrases[category];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    // Obtener signo zodiacal del día
    const zodiac = getZodiacSign(new Date());
    
    // Generar números de la suerte
    const luckyNumbers = generateLuckyNumbers();
    
    return {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        phrase,
        zodiac,
        luckyNumbers
    };
}

// ===== ZODIACO =====
function getZodiacSign(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    for (const sign of appState.zodiacData.signs) {
        if (isDateInRange(month, day, sign.start, sign.end)) {
            const decan = getDecan(day, sign);
            return {
                sign: `${sign.symbol} ${sign.name}`,
                decan: `${decan.number} - ${decan.description}`
            };
        }
    }
    
    return { sign: '♈ Aries', decan: 'Primer Decanato' };
}

function isDateInRange(month, day, start, end) {
    const current = month * 100 + day;
    const startDate = start.month * 100 + start.day;
    const endDate = end.month * 100 + end.day;
    
    if (startDate <= endDate) {
        return current >= startDate && current <= endDate;
    } else {
        return current >= startDate || current <= endDate;
    }
}

function getDecan(day, sign) {
    const startDay = sign.start.day;
    const endDay = sign.end.day;
    const totalDays = sign.start.month === sign.end.month 
        ? endDay - startDay + 1 
        : (30 - startDay) + endDay + 1;
    
    const decanSize = Math.floor(totalDays / 3);
    
    if (day <= startDay + decanSize) {
        return sign.decans[0];
    } else if (day <= startDay + (decanSize * 2)) {
        return sign.decans[1];
    } else {
        return sign.decans[2];
    }
}

function getCompleteZodiacData() {
    return {
        signs: [
            {
                name: "Aries",
                symbol: "♈",
                start: { month: 3, day: 21 },
                end: { month: 4, day: 19 },
                decans: [
                    { number: "Primer Decanato", description: "Energía y liderazgo natural" },
                    { number: "Segundo Decanato", description: "Pasión y determinación" },
                    { number: "Tercer Decanato", description: "Valentía y espíritu aventurero" }
                ]
            },
            {
                name: "Tauro",
                symbol: "♉",
                start: { month: 4, day: 20 },
                end: { month: 5, day: 20 },
                decans: [
                    { number: "Primer Decanato", description: "Estabilidad y perseverancia" },
                    { number: "Segundo Decanato", description: "Sensualidad y apreciación de la belleza" },
                    { number: "Tercer Decanato", description: "Determinación y lealtad" }
                ]
            },
            {
                name: "Géminis",
                symbol: "♊",
                start: { month: 5, day: 21 },
                end: { month: 6, day: 20 },
                decans: [
                    { number: "Primer Decanato", description: "Comunicación y versatilidad" },
                    { number: "Segundo Decanato", description: "Curiosidad intelectual" },
                    { number: "Tercer Decanato", description: "Adaptabilidad y ingenio" }
                ]
            },
            {
                name: "Cáncer",
                symbol: "♋",
                start: { month: 6, day: 21 },
                end: { month: 7, day: 22 },
                decans: [
                    { number: "Primer Decanato", description: "Intuición y sensibilidad emocional" },
                    { number: "Segundo Decanato", description: "Protección y cuidado familiar" },
                    { number: "Tercer Decanato", description: "Empatía y conexión profunda" }
                ]
            },
            {
                name: "Leo",
                symbol: "♌",
                start: { month: 7, day: 23 },
                end: { month: 8, day: 22 },
                decans: [
                    { number: "Primer Decanato", description: "Carisma y liderazgo natural" },
                    { number: "Segundo Decanato", description: "Creatividad y expresión artística" },
                    { number: "Tercer Decanato", description: "Generosidad y nobleza de espíritu" }
                ]
            },
            {
                name: "Virgo",
                symbol: "♍",
                start: { month: 8, day: 23 },
                end: { month: 9, day: 22 },
                decans: [
                    { number: "Primer Decanato", description: "Perfeccionismo y atención al detalle" },
                    { number: "Segundo Decanato", description: "Análisis y pensamiento crítico" },
                    { number: "Tercer Decanato", description: "Servicio y dedicación" }
                ]
            },
            {
                name: "Libra",
                symbol: "♎",
                start: { month: 9, day: 23 },
                end: { month: 10, day: 22 },
                decans: [
                    { number: "Primer Decanato", description: "Equilibrio y armonía" },
                    { number: "Segundo Decanato", description: "Diplomacia y justicia" },
                    { number: "Tercer Decanato", description: "Sociabilidad y encanto" }
                ]
            },
            {
                name: "Escorpio",
                symbol: "♏",
                start: { month: 10, day: 23 },
                end: { month: 11, day: 21 },
                decans: [
                    { number: "Primer Decanato", description: "Intensidad y transformación" },
                    { number: "Segundo Decanato", description: "Pasión y magnetismo" },
                    { number: "Tercer Decanato", description: "Profundidad emocional y misterio" }
                ]
            },
            {
                name: "Sagitario",
                symbol: "♐",
                start: { month: 11, day: 22 },
                end: { month: 12, day: 21 },
                decans: [
                    { number: "Primer Decanato", description: "Optimismo y aventura" },
                    { number: "Segundo Decanato", description: "Filosofía y búsqueda de verdad" },
                    { number: "Tercer Decanato", description: "Libertad y expansión" }
                ]
            },
            {
                name: "Capricornio",
                symbol: "♑",
                start: { month: 12, day: 22 },
                end: { month: 1, day: 19 },
                decans: [
                    { number: "Primer Decanato", description: "Ambición y disciplina" },
                    { number: "Segundo Decanato", description: "Responsabilidad y madurez" },
                    { number: "Tercer Decanato", description: "Perseverancia y logro" }
                ]
            },
            {
                name: "Acuario",
                symbol: "♒",
                start: { month: 1, day: 20 },
                end: { month: 2, day: 18 },
                decans: [
                    { number: "Primer Decanato", description: "Innovación y originalidad" },
                    { number: "Segundo Decanato", description: "Humanitarismo y visión futurista" },
                    { number: "Tercer Decanato", description: "Independencia y rebeldía creativa" }
                ]
            },
            {
                name: "Piscis",
                symbol: "♓",
                start: { month: 2, day: 19 },
                end: { month: 3, day: 20 },
                decans: [
                    { number: "Primer Decanato", description: "Intuición y espiritualidad" },
                    { number: "Segundo Decanato", description: "Compasión y empatía" },
                    { number: "Tercer Decanato", description: "Imaginación y creatividad artística" }
                ]
            }
        ]
    };
}

// ===== NÚMEROS DE LA SUERTE =====
function generateLuckyNumbers() {
    const numbers = [];
    for (let i = 0; i < 3; i++) { // Cambiado a 3 números para pirámide
        numbers.push(Math.floor(Math.random() * 10));
    }
    return numbers;
}

// ===== CONFETI =====
function createConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    
    const colors = ['#D4AF37', '#FFD700', '#FFA500', '#FF6347', '#FF1493', '#00CED1'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);
    }
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 4000);
}

// ===== NOTIFICACIONES =====
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function sendNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🥠 Galleta de la Suerte', {
            body: '¡Tu galleta de la suerte está lista! Ábrela ahora.',
            icon: 'assets/icons/icon-192x192.png',
            badge: 'assets/icons/icon-72x72.png',
            tag: 'fortune-cookie',
            requireInteraction: false
        });
    }
}

// ===== SELECTOR DE TEMAS =====
function initThemeSelector() {
    const themeBtn = document.getElementById('theme-btn');
    const themeMenu = document.getElementById('theme-menu');
    const themeButtons = themeMenu.querySelectorAll('button');
    
    themeBtn.addEventListener('click', () => {
        themeMenu.classList.toggle('hidden');
    });
    
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            applyTheme(theme);
            appState.currentTheme = theme;
            localStorage.setItem(CONFIG.THEME_KEY, theme);
            themeMenu.classList.add('hidden');
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!themeBtn.contains(e.target) && !themeMenu.contains(e.target)) {
            themeMenu.classList.add('hidden');
        }
    });
}

function applyTheme(theme) {
    const themeLink = document.getElementById('theme-link');
    themeLink.href = `themes/${theme}.css`;
}

// ===== ACTUALIZAR UI =====
function updateUI() {
    if (appState.isUnlocked) {
        unlockCookie();
    } else {
        lockCookie();
    }
}

// ===== EFECTOS MÁGICOS ESTILO DISNEY =====

// Ondas de energía mágica
function createMagicWaves() {
    const container = document.getElementById('confetti-container');
    
    for (let i = 0; i < 3; i++) {
        const wave = document.createElement('div');
        wave.className = 'magic-wave';
        wave.style.animationDelay = `${i * 0.2}s`;
        container.appendChild(wave);
        
        setTimeout(() => wave.remove(), 2000);
    }
}

// Destellos brillantes (sparkles)
function createSparkles() {
    const container = document.getElementById('confetti-container');
    const colors = ['#FFD700', '#FFF', '#FFE4B5', '#FFFF00', '#F0E68C'];
    
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = '✨';
        sparkle.style.left = (Math.random() * 100) + '%';
        sparkle.style.top = (Math.random() * 100) + '%';
        sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.fontSize = (Math.random() * 20 + 10) + 'px';
        sparkle.style.animationDelay = (Math.random() * 0.5) + 's';
        sparkle.style.animationDuration = (Math.random() * 1 + 1) + 's';
        
        container.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
    }
}

// Estrellas mágicas
function createMagicStars() {
    const container = document.getElementById('confetti-container');
    const starShapes = ['⭐', '✨', '💫', '🌟'];
    
    for (let i = 0; i < 15; i++) {
        const star = document.createElement('div');
        star.className = 'magic-star';
        star.textContent = starShapes[Math.floor(Math.random() * starShapes.length)];
        star.style.left = (Math.random() * 100) + '%';
        star.style.top = (Math.random() * 100) + '%';
        star.style.fontSize = (Math.random() * 30 + 20) + 'px';
        star.style.animationDelay = (Math.random() * 0.3) + 's';
        
        container.appendChild(star);
        
        setTimeout(() => star.remove(), 3000);
    }
}

// Explosión de luz central
function createLightBurst() {
    const container = document.getElementById('confetti-container');
    
    const burst = document.createElement('div');
    burst.className = 'light-burst';
    container.appendChild(burst);
    
    setTimeout(() => burst.remove(), 1500);
}

// ===== HISTORIAL DE FORTUNAS =====
const HISTORY_KEY = 'fortuneHistory';
const MAX_HISTORY = 3;

function saveToHistory(fortune) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    
    // Agregar nueva fortuna al inicio
    history.unshift({
        phrase: fortune.phrase,
        date: new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        timestamp: Date.now()
    });
    
    // Mantener solo las últimas 3
    history = history.slice(0, MAX_HISTORY);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function showHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const historyList = document.getElementById('history-list');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Aún no tienes fortunas en tu historial.<br>¡Abre tu primera galleta!</p>';
    } else {
        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-item-date">${item.date}</div>
                <div class="history-item-text">"${item.phrase}"</div>
            </div>
        `).join('');
    }
    
    document.getElementById('history-modal').classList.remove('hidden');
}

function closeHistory() {
    document.getElementById('history-modal').classList.add('hidden');
}

// ===== COMPARTIR EN REDES SOCIALES =====
function shareToSocial(platform) {
    const fortuneText = document.getElementById('fortune-text').textContent;
    const appUrl = window.location.href;
    const shareText = `🥠 Mi fortuna del día:\n\n"${fortuneText}"\n\n`;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'instagram':
            // Instagram no permite compartir texto directamente desde web
            // Copiar al portapapeles y mostrar mensaje
            copyToClipboard(shareText + appUrl);
            alert('📋 ¡Texto copiado!\n\nPega tu fortuna en Instagram Stories o en tu publicación.');
            break;
            
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
            
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback para navegadores antiguos
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// ===== SONIDO MÁGICO =====
function playMagicSound() {
    // Crear sonido usando Web Audio API (no requiere archivo externo)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Sonido mágico: secuencia de notas ascendentes
    const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do (octava alta)
    const duration = 0.15;
    
    notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        const startTime = audioContext.currentTime + (index * duration);
        const endTime = startTime + duration;
        
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
        
        oscillator.start(startTime);
        oscillator.stop(endTime);
    });
}

// ===== MODIFICAR showFortune PARA INCLUIR HISTORIAL Y SONIDO =====
const originalShowFortune = showFortune;
showFortune = function() {
    const fortune = generateFortune();
    
    // Reproducir sonido mágico
    playMagicSound();
    
    // Guardar en historial
    saveToHistory(fortune);
    
    // Mostrar fortuna
    document.getElementById('fortune-text').textContent = fortune.phrase;
    document.getElementById('zodiac-sign').textContent = fortune.zodiac.sign;
    document.getElementById('zodiac-decan').textContent = fortune.zodiac.decan;
    
    fortune.luckyNumbers.forEach((num, index) => {
        document.getElementById(`num${index + 1}`).textContent = num;
    });
    
    document.getElementById('fortune-message').classList.remove('hidden');
};

// ===== REGISTRO DEL SERVICE WORKER =====
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker registrado', reg))
        .catch(err => console.log('Error al registrar Service Worker', err));
}
