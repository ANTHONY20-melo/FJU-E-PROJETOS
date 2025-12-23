/* ==========================================================
    1. CONFIGURAÇÕES E SELETORES
    ========================================================== */
const FORMSPREE_ID = "xqezydpd"; 
const forms = document.querySelectorAll('form[id^="form"]');

/* ==========================================================
    2. INICIALIZAÇÃO DOS CARROSSEIS (SPLIDE.JS + VÍDEO)
    ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
    
    // --- LÓGICA PARA A PÁGINA PRINCIPAL E PÁGINA DE ESPORTES ---
    const splideElement = document.querySelector('.splide:not(#splide-help)');
    if (splideElement) {
        const isMainPage = document.querySelector('#horarios') || document.querySelector('#localizacao'); 

        if (isMainPage) {
            const splideMain = new Splide('.splide', {
                heightRatio: 0.5, // Reduzido para não ficar gigante
                cover      : true,
                video      : { loop: true, mute: true, hideControls: false },
                breakpoints: { 768: { heightRatio: 0.70 } }
            });
            splideMain.mount( window.splide.Extensions );
        } else {
            const splideEsporte = new Splide('.splide', {
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
            splideEsporte.mount();
        }
    }

    // --- LÓGICA PARA A PÁGINA HELP (DIMINUÍDA CONFORME SOLICITADO) ---
    const splideHelpElement = document.querySelector('#splide-help');
    if (splideHelpElement) {
        const splideHelp = new Splide('#splide-help', {
            type        : 'loop',
            perPage     : 3,       // Mostra 3 vídeos menores em vez de 1 gigante
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

    // --- INICIALIZAR MAPA ---
    initMapaFJU();
});

/* ==========================================================
    3. ENVIO DINÂMICO DE FORMULÁRIOS (FORMSPREE)
    ========================================================== */
async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    btn.innerText = "A Enviar...";
    btn.disabled = true;

    const data = new FormData(form);
    
    try {
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            window.location.href = "obrigado.html"; 
        } else {
            throw new Error("Erro no servidor");
        }
    } catch (error) {
        alert("Ocorreu um erro. Verifique sua conexão e tente novamente.");
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

forms.forEach(form => {
    form.addEventListener("submit", handleSubmit);
});

/* ==========================================================
    4. CONTROLE DE SCROLL E CORES
    ========================================================== */
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    const isEsporte = document.body.classList.contains('page-esporte');
    const isHelp = document.body.classList.contains('page-help');

    let corSolida = "#002d5b"; 
    if (isEsporte) corSolida = "#004d2a"; 
    if (isHelp) corSolida = "#f1c40f"; 

    if (header) {
        if (window.scrollY > 50) {
            header.style.background = corSolida;
            header.style.opacity = "0.95";
            header.style.padding = "10px 5%";
        } else {
            header.style.background = corSolida;
            header.style.opacity = "1";
            header.style.padding = "1rem 5%";
        }
    }
});

/* ==========================================================
    5. ROLAGEM SUAVE (SMOOTH SCROLL)
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
    6. LÓGICA DO MAPA (LOCALIZAÇÃO IMEDIATA)
    ========================================================== */
function initMapaFJU() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Mapa base
    const map = L.map('map').setView([-14.235, -51.925], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Assim que o GPS liga, ele busca a Universal
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            map.setView([lat, lng], 15); 

            L.marker([lat, lng]).addTo(map)
                .bindPopup('<b>Você está aqui!</b><br><a href="https://www.google.com/maps/search/Igreja+Universal/@' + lat + ',' + lng + ',15z" target="_blank">Clique para ver as igrejas próximas</a>')
                .openPopup();
        }, () => {
            console.log("GPS desativado.");
        });
    }
}