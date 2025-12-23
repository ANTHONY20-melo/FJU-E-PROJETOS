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

    // Carrossel Página Help (Vídeos Menores)
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
    3. ENVIO DINÂMICO E REDIRECIONAMENTO INTELIGENTE
   ========================================================== */
async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    btn.innerText = "A Enviar...";
    btn.disabled = true;

    const data = new FormData(form);
    const bodyClass = document.body.className;

    try {
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Lógica Unificada: Redireciona para obrigado.html com o parâmetro do projeto (?p=)
            let projetoParam = "";

            if (bodyClass.includes('page-esporte')) projetoParam = "?p=esporte";
            else if (bodyClass.includes('page-midia')) projetoParam = "?p=midia";
            else if (bodyClass.includes('page-uniforca')) projetoParam = "?p=uniforca";
            else if (bodyClass.includes('page-atalaia')) projetoParam = "?p=atalaia";
            else if (bodyClass.includes('page-arcanjos')) projetoParam = "?p=arcanjos";
            else if (bodyClass.includes('page-universitarios')) projetoParam = "?p=universitarios";
            else if (bodyClass.includes('page-assistentes')) projetoParam = "?p=assistentes";
            else if (bodyClass.includes('page-cultura')) projetoParam = "?p=cultura";

            // Envia o usuário para a tela dinâmica
            window.location.href = "obrigado.html" + projetoParam;
            
        } else {
            const result = await response.json();
            alert(result.error || "Erro no envio. Verifique se o formulário foi ativado no Formspree.");
            btn.innerText = originalText;
            btn.disabled = false;
        }
    } catch (error) {
        alert("Ocorreu um erro ao enviar. Verifique sua conexão.");
        btn.innerText = originalText;
        btn.disabled = false;
    }
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
            console.log("Acesso à localização negado pelo usuário.");
        });
    }
}