// Smooth scroll para navegação
        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });

        // Highlight da seção ativa
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('nav a');

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    atualizarMenu();
                    ticking = false;
                });
                ticking = true;
            }
        });

        function atualizarMenu() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - 150) {
                    current = section.id;
                }
            });

            navLinks.forEach(link => {
                link.style.background = '#f0f0f0';
                link.style.color = '#667eea';

                if (link.getAttribute('href') === `#${current}`) {
                link.style.background = '#667eea';
                link.style.color = 'white';
                }
            });
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
        }, {
        threshold: 0.2
        });

        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });

        function animarNumero(elemento, final, duracao = 2000, casasDecimais = 0) {
            const inicioTempo = performance.now();

            function atualizarNumero(tempoAtual) {
                const progresso = (tempoAtual - inicioTempo) / duracao;
                const progressoSuave = Math.min(progresso, 1);

                const valorAtual = progressoSuave * final;
                elemento.innerText = valorAtual.toLocaleString('pt-BR', {
                    minimumFractionDigits: casasDecimais,
                    maximumFractionDigits: casasDecimais
                });

                if (progresso < 1) {
                    requestAnimationFrame(atualizarNumero);
                } else {
                    // --- CÓDIGO DA MARCAÇÃO ---
                    elemento.classList.add('finalizado'); // Ativa o efeito
            
                    setTimeout(() => {
                        elemento.classList.remove('finalizado'); // Remove após 800ms
                    }, 800);
                    // ---------------------------
                }
            };

            requestAnimationFrame(atualizarNumero);
        }

        const numeros = document.querySelectorAll('.contador');

        const observerNumeros = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const valor = Number(el.getAttribute('data-valor'));
                    const tempoDesejado = Number(el.getAttribute('data-duracao')) || 2000; // 2000 é o padrão caso esqueça o atributo

                animarNumero(el, valor, tempoDesejado);
                observerNumeros.unobserve(el); // roda só uma vez
            }
        });
    });

        numeros.forEach(num => observerNumeros.observe(num));