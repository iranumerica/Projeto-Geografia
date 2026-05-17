// ── Mapa de países: id da section → classe CSS + nome do badge ─────
const PAISES = {
    'alemanha':   { classe: 'pais-alemanha',   nome: '🇩🇪 Alemanha' },
    'franca':     { classe: 'pais-franca',     nome: '🇫🇷 França' },
    'reino-unido':{ classe: 'pais-reino-unido',nome: '🇬🇧 Reino Unido' },
    'italia':     { classe: 'pais-italia',     nome: '🇮🇹 Itália' },
    'espanha':    { classe: 'pais-espanha',    nome: '🇪🇸 Espanha' },
    'russia':     { classe: 'pais-russia',     nome: '🇷🇺 Rússia' },
    'portugal':   { classe: 'pais-portugal',   nome: '🇵🇹 Portugal' },
};

// ── Elementos ─────────────────────────────────────────────────────
const body       = document.body;
const badge      = document.getElementById('badge-pais');
const btnTopo    = document.getElementById('btn-topo');
const sections   = document.querySelectorAll('.section');
const navLinks   = document.querySelectorAll('nav a');

let paisAtual = null;
let ticking   = false;

// ── Troca de tema do país ─────────────────────────────────────────
function aplicarPais(id) {
    if (paisAtual === id) return;
    paisAtual = id;

    // Remove todas as classes de país
    Object.values(PAISES).forEach(p => body.classList.remove(p.classe));

    const pais = PAISES[id];
    if (pais) {
        body.classList.add(pais.classe);
        badge.textContent = pais.nome;
        badge.classList.add('visivel');
    } else {
        // Europa geral: sem classe de país, esconde badge
        badge.classList.remove('visivel');
    }
}

// ── Scroll: detecta seção ativa ───────────────────────────────────
function atualizarTudo() {
    const scrollY = window.scrollY;
    let secaoAtiva = '';

    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 200) {
            secaoAtiva = section.id;
        }
    });

    // Background dinâmico por país
    aplicarPais(secaoAtiva);

    // Highlight do nav
    navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === secaoAtiva) {
            link.classList.add('ativo');
        } else {
            link.classList.remove('ativo');
            link.style.background = '';
            link.style.color = '';
        }
    });

    // Botão voltar ao topo
    if (scrollY > 400) {
        btnTopo.classList.add('visivel');
    } else {
        btnTopo.classList.remove('visivel');
    }
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
            atualizarTudo();
            ticking = false;
        });
    }
});

// ── Smooth scroll ─────────────────────────────────────────────────
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ── IntersectionObserver: timeline ───────────────────────────────
const observerTimeline = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
    });
}, { threshold: 0.15 });

document.querySelectorAll('.timeline-item').forEach(item => {
    observerTimeline.observe(item);
});

// ── Contadores animados ───────────────────────────────────────────
function animarNumero(elemento, final, duracao = 2000, casasDecimais = 0) {
    const inicioTempo = performance.now();

    function atualizarNumero(tempoAtual) {
        const progresso   = (tempoAtual - inicioTempo) / duracao;
        const suave       = Math.min(progresso, 1);
        const valorAtual  = suave * final;

        elemento.innerText = valorAtual.toLocaleString('pt-BR', {
            minimumFractionDigits: casasDecimais,
            maximumFractionDigits: casasDecimais
        });

        if (progresso < 1) {
            requestAnimationFrame(atualizarNumero);
        } else {
            elemento.classList.add('finalizado');
            setTimeout(() => elemento.classList.remove('finalizado'), 800);
        }
    }

    requestAnimationFrame(atualizarNumero);
}

const observerNumeros = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const valor = Number(el.getAttribute('data-valor'));
        const tempo = Number(el.getAttribute('data-duracao')) || 2000;
        if (isNaN(valor) || valor === 0) return;
        animarNumero(el, valor, tempo);
        observerNumeros.unobserve(el);
    });
});

document.querySelectorAll('.contador').forEach(num => observerNumeros.observe(num));

// ── Botão voltar ao topo ──────────────────────────────────────────
btnTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Rodar uma vez no carregamento
atualizarTudo();