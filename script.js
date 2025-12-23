/* ==========================================================
   1. CONFIGURAÇÕES E SELETORES
   ========================================================== */
const FORMSPREE_ID = "xqezydpd"; 
const forms = document.querySelectorAll('form[id^="form"]');

/* ==========================================================
   2. INICIALIZAÇÃO DO CARROSSEL (SPLIDE.JS + VÍDEO)
   ========================================================== */
document.addEventListener('DOMContentLoaded', function () {
    const splideElement = document.querySelector('.splide');
    
    if (splideElement) {
        // Verifica se estamos na página principal (pelo ID da seção #horarios)
        const isMainPage = document.querySelector('#horarios'); 

        if (isMainPage) {
            // CONFIGURAÇÃO RESPONSIVA PARA VÍDEO (Página Principal)
            var splide = new Splide('.splide', {
                heightRatio: 0.5625, // Proporção 16:9 no PC
                cover      : true,
                video      : {
                    loop: true,
                    mute: true,
                    hideControls: false
                },
                breakpoints: {
                    768: {
                        heightRatio: 0.70, // No celular o vídeo fica um pouco mais alto para melhor ajuste
                    }
                }
            });
            // Monta obrigatoriamente com a extensão de vídeo carregada no window
            splide.mount( window.splide.Extensions );
        } else {
            // CONFIGURAÇÃO PARA FOTOS (Página Esporte / Projetos)
            var splide = new Splide('.splide', {
                type    : 'loop',
                perPage : 3,
                autoplay: true,
                interval: 3000,
                gap     : '20px',
                arrows  : true,
                pagination: true,
                breakpoints: {
                    1024: {
                        perPage: 2,
                    },
                    768: {
                        perPage: 1,
                    }
                }
            });
            splide.mount();
        }
    }
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
    const sidebar = document.querySelector('.sidebar');
    
    const isEsporte = document.body.classList.contains('page-esporte');
    const corSolida = isEsporte ? "#004d2a" : "#002d5b";
    const corTransparente = isEsporte ? "rgba(0, 77, 42, 0.95)" : "rgba(0, 45, 91, 0.95)";

    if (header) {
        if (window.scrollY > 50) {
            header.style.background = corTransparente;
            header.style.padding = "10px 5%";
        } else {
            header.style.background = corSolida;
            header.style.padding = "1rem 5%";
        }
    }

    if (sidebar && window.innerWidth <= 768) {
        if (window.scrollY > 20) {
            sidebar.style.boxShadow = "0 -4px 10px rgba(0,0,0,0.3)";
        } else {
            sidebar.style.boxShadow = "none";
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
            target.scrollIntoView({
                behavior: 'smooth'
            });
            
            document.querySelectorAll('.sidebar-nav a').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        }
    });
});