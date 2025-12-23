/* ==========================================================
   CONFIGURAÇÕES E SELETORES
   ========================================================== */
const formFJU = document.getElementById("formFJU");
const btnEnviar = document.getElementById("btnEnviar");
const btnMobile = document.getElementById('btn-mobile');
const nav = document.getElementById('menu');

// ID do Formspree (Troque se necessário)
const FORMSPREE_ID = "xqezydpd"; 

/* ==========================================================
   1. MENU MOBILE (ABRIR / FECHAR)
   ========================================================== */
function toggleMenu(event) {
    if (event.type === 'touchstart') event.preventDefault();
    
    nav.classList.toggle('active');
    
    // Acessibilidade: Indica se o menu está expandido
    const active = nav.classList.contains('active');
    event.currentTarget.setAttribute('aria-expanded', active);
}

if (btnMobile) {
    btnMobile.addEventListener('click', toggleMenu);
    btnMobile.addEventListener('touchstart', toggleMenu);
}

// Fechar menu automaticamente ao clicar em um link (Melhora UX no celular)
document.querySelectorAll('#menu a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

/* ==========================================================
   2. ENVIO DO FORMULÁRIO (FORMSPREE)
   ========================================================== */
async function handleSubmit(event) {
    event.preventDefault();
    
    // Feedback visual de carregamento
    if(btnEnviar) {
        btnEnviar.innerText = "A Enviar...";
        btnEnviar.disabled = true;
    }

    const data = new FormData(event.target);
    
    try {
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Sucesso: Redireciona para página de agradecimento
            window.location.href = "obrigado.html"; 
        } else {
            // Erro de resposta do servidor
            throw new Error("Erro no servidor");
        }
    } catch (error) {
        alert("Ocorreu um erro. Verifique sua conexão e tente novamente.");
        if(btnEnviar) {
            btnEnviar.innerText = "Enviar Dados";
            btnEnviar.disabled = false;
        }
    }
}

if (formFJU) {
    formFJU.addEventListener("submit", handleSubmit);
}

/* ==========================================================
   3. EFEITOS DE ROLAGEM (SCROLL)
   ========================================================== */
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    
    // Encolher o menu ao rolar para baixo
    if (window.scrollY > 50) {
        header.style.padding = "5px 5%"; // Reduz altura
        header.style.background = "rgba(0, 45, 91, 0.95)"; // Fica levemente transparente
    } else {
        header.style.padding = "1rem 5%"; // Volta ao normal
        header.style.background = "#002d5b"; // Cor sólida
    }
});

// Rolagem Suave (Smooth Scroll) para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});