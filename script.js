const formFJU = document.getElementById("formFJU");
const btnEnviar = document.getElementById("btnEnviar");

// ID do Formspree (Troca pelo teu código se for diferente do Cultura)
const FORMSPREE_ID = "xqezydpd"; 

async function handleSubmit(event) {
    event.preventDefault();
    
    if(btnEnviar) {
        btnEnviar.innerText = "A Enviar...";
        btnEnviar.disabled = true;
    }

    const data = new FormData(event.target);
    
    fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
    }).then(response => {
        if (response.ok) {
            window.location.href = "obrigado.html"; 
        } else {
            alert("Ocorreu um erro. Tenta novamente mais tarde.");
            btnEnviar.innerText = "Enviar Dados";
            btnEnviar.disabled = false;
        }
    }).catch(error => {
        alert("Erro de rede. Verifica a tua ligação.");
        btnEnviar.innerText = "Enviar Dados";
        btnEnviar.disabled = false;
    });
}

if (formFJU) {
    formFJU.addEventListener("submit", handleSubmit);
}

// Efeito de encolher o menu ao rolar
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.style.padding = "5px 10%";
    } else {
        header.style.padding = "10px 10%";
    }
});