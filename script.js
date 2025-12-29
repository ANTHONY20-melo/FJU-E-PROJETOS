/* ==========================================================
    1. CONFIGURAÇÕES E SELETORES
   ========================================================== */
const FORMSPREE_ID = "xqezydpd"; 
const forms = document.querySelectorAll('form[id^="form"]');

/* ==========================================================
    2. INICIALIZAÇÃO DOS CARROSSEIS (SPLIDE.JS + VÍDEO)
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
    
    // Carrossel Principal e Projetos
    const splideElement = document.querySelector('.splide:not(#splide-help)');
    if (splideElement) {
        const isMainPage = document.querySelector('#horarios') || document.querySelector('#localizacao'); 

        if (isMainPage) {
            const splideMain = new Splide('.splide', {
                heightRatio: 0.5,
                cover      : true,
                video      : { loop: true, mute: true, hideControls: false },
                breakpoints: { 768: { heightRatio: 0.70 } }
            });
            splideMain.mount( window.splide.Extensions );
        } else {
            const splideProjetos = new Splide('.splide', {
                type    : 'loop',
                perPage : 3,
                autoplay: true,
                interval: 3000,
                gap     : '20px',
                breakpoints: {
                    1024: { perPage: 2 },
                    768: { perPage: 1 }
                }
            });
            splideProjetos.mount();
        }
    }

    // Carrossel Página Help
    const splideHelpElement = document.querySelector('#splide-help');
    if (splideHelpElement) {
        const splideHelp = new Splide('#splide-help', {
            type        : 'loop',
            perPage     : 3, 
            gap         : '20px',
            heightRatio : 0.5,     
            cover       : true,
            video       : { loop: true, mute: true, hideControls: false },
            breakpoints : {
                1024: { perPage: 2 },
                768 : { perPage: 1, heightRatio: 0.7 } 
            }
        });
        splideHelp.mount( window.splide.Extensions );
    }

    initMapaFJU();
});

/* ==========================================================
    3. ENVIO E REDIRECIONAMENTO INSTANTÂNEO (ULTRA-RÁPIDO)
   ========================================================== */
async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    
    btn.innerText = "Enviado...";
    btn.disabled = true;

    const data = new FormData(form);
    const bodyClass = document.body.className.toLowerCase().trim();

    // 1. Define o destino com base na classe do body
    let projeto = "geral";
    if (bodyClass.includes('esporte')) projeto = "esporte";
    else if (bodyClass.includes('midia')) projeto = "midia";
    else if (bodyClass.includes('uniforca')) projeto = "uniforca";
    else if (bodyClass.includes('atalaia')) projeto = "atalaia";
    else if (bodyClass.includes('arcanjos')) projeto = "arcanjos";
    else if (bodyClass.includes('universitarios')) projeto = "universitarios";
    else if (bodyClass.includes('assistentes')) projeto = "assistentes";
    else if (bodyClass.includes('cultura')) projeto = "cultura";

    const destino = `./obrigado.html?p=${projeto}`;

    // 2. Dispara o envio para o Formspree (Sem esperar o await)
    fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
    }).catch(err => console.log("Erro silencioso de envio:", err));

    // 3. REDIRECIONAMENTO FORÇADO (Após 500ms para garantir o disparo do fetch)
    // Isso ignora se a internet está lenta ou se o Formspree demorar
    setTimeout(() => {
        window.location.replace(destino);
    }, 500);
}

forms.forEach(form => {
    form.addEventListener("submit", handleSubmit);
});

/* ==========================================================
    4. ROLAGEM SUAVE (SMOOTH SCROLL)
   ========================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#") return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            
            document.querySelectorAll('.sidebar-nav a').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

/* ==========================================================
    5. LÓGICA DO MAPA (UNIFICADA)
   ========================================================== */
function initMapaFJU() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const map = L.map('map').setView([-14.235, -51.925], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setView([lat, lng], 15); 

            L.marker([lat, lng]).addTo(map)
                .bindPopup('<b>Você está aqui!</b><br><a href="https://www.google.com/maps/search/Igreja+Universal/@' + lat + ',' + lng + ',15z" target="_blank">Ver igrejas próximas</a>')
                .openPopup();
        }, () => {
            console.log("Localização negada.");
        });
    }
}