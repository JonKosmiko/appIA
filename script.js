const listaRespuestas = ["Kaixo, Maite. <br>Destaco el primero: El constructor Martín Soraluze fue saqueado el día de la boda por su prometida. Según fuentes familiares, la historia de amor comenzó cuando él, un importante hombre de negocios, la contrató como chica de companía toda una semana. Pero, durante el tiempo que pasaron juntos, surgió el amor. ¿Quieres saber más?"];

let indice = 0;
let escribiendo = false;
const chat = document.getElementById('chat-container');
const footer = document.getElementById('footer');
const waveBox = document.getElementById('wave-box');
const btn = document.getElementById('boton-micro');

// AÑADIR MARGEN ENTRE BOTÓN E INPUT
footer.style.display = "flex";
footer.style.alignItems = "center";
footer.style.gap = "20px"; // Ajusta este valor (15px, 20px, 25px...) según te guste

const total = 25;
for(let i=0; i < total; i++) {
    const bar = document.createElement('div');
    bar.className = 'wave-bar';
    const centro = (total - 1) / 2;
    const dist = Math.abs(i - centro) / centro;
    const ruido = Math.random() * 25;
    const h = (110 * (1 - Math.pow(dist, 2))) + ruido; 
    bar.style.setProperty('--h', `${h}px`);
    const dur = (0.4 + (Math.random() * 0.4)).toFixed(2);
    bar.style.setProperty('--duration', `${dur}s`);
    bar.style.animationDelay = `${dist * 0.2}s`;
    waveBox.appendChild(bar);
}

function resetearApp() {
    chat.innerHTML = '';

    indice = 0;
    escribiendo = false;

    btn.style.filter = "none";
    btn.style.pointerEvents = "auto";

    const bienvenida = document.createElement('div');
    bienvenida.className = 'mensaje ia';
    bienvenida.textContent = "HOLA. TE ESCUCHO ATENTAMENTE.";
    chat.appendChild(bienvenida);

    if (navigator.vibrate) navigator.vibrate([30, 30, 30]);
}

document.querySelector('.btn-icon').addEventListener('click', resetearApp);

function responder() {
    if (escribiendo) return;
    escribiendo = true;

    btn.style.filter = "grayscale(1) brightness(0.5)";
    btn.style.pointerEvents = "none";

    const u = document.createElement('div');
    u.className = 'mensaje user';
    u.textContent = "AUDIO ENVIADO";
    chat.appendChild(u);
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
        const ia = document.createElement('div');
        ia.className = 'mensaje ia';
        chat.appendChild(ia);
        
        const textoCompleto = listaRespuestas[indice];
        let i = 0;

        function escribirLetra() {
            if (i < textoCompleto.length) {
                if (textoCompleto.slice(i, i + 4) === "<br>") {
                    ia.innerHTML += "<br>";
                    i += 4;
                } else {
                    ia.innerHTML += textoCompleto.charAt(i);
                    i++;
                }
                
                chat.scrollTop = chat.scrollHeight;
                setTimeout(escribirLetra, 30);
            } else {
                indice = (indice + 1) % listaRespuestas.length;
                escribiendo = false;
                btn.style.filter = "none";
                btn.style.pointerEvents = "auto";
            }
        }

        escribirLetra();
    }, 800);
}

const pulsar = (e) => {
    if (escribiendo) return;
    if (e && e.cancelable) e.preventDefault();
    footer.classList.add('grabbing');
    if (navigator.vibrate) navigator.vibrate(50);
};

const soltar = (e) => {
    if (escribiendo) return;
    if (e && e.cancelable) e.preventDefault();
    if(footer.classList.contains('grabbing')){
        footer.classList.remove('grabbing');
        responder();
    }
};

btn.addEventListener('mousedown', pulsar);
btn.addEventListener('mouseup', soltar);
btn.addEventListener('touchstart', pulsar, { passive: false });
btn.addEventListener('touchend', soltar, { passive: false });