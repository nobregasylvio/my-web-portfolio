// ========== Menu Hamburguer ========== //
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const menuLinks = document.getElementById('menu-links');
  // Fecha o menu ao clicar em um link (mobile UX)
  function closeMenu() {
    menuLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  if (menuToggle && menuLinks) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = menuLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Fecha ao clicar fora do menu
    document.addEventListener('click', function (e) {
      if (menuLinks.classList.contains('open') && !menuLinks.contains(e.target) && e.target !== menuToggle) {
        closeMenu();
      }
    });
    // Fecha ao clicar em um link
    menuLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }
});
// Carrega e exibe os títulos dos certificados com link e mostra HardSkills ao passar o mouse

const softSkillsPadrao = [
  'Comunicação',
  'Trabalho em equipe',
  'Adaptabilidade',
  'Resolução de problemas',
  'Gerenciamento de tempo',
  'Empatia',
  'Paciência'
];

let softSkillTimeout = null;
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

function renderSkills(skills, tipo) {
  let skillsList = document.getElementById('skills-list');
  const skillsDisplay = document.getElementById('skills-display');
  const skillsTitle = skillsDisplay ? skillsDisplay.querySelector('h3') : null;

  // Se não existe a lista, cria dinamicamente
  if (!skillsList && skillsDisplay) {
    skillsList = document.createElement('ul');
    skillsList.id = 'skills-list';
    skillsDisplay.appendChild(skillsList);
  }
  if (!skillsList || !skillsTitle) return;

  skillsList.innerHTML = '';
  skills.forEach(skill => {
    const li = document.createElement('li');
    li.textContent = skill;
    skillsList.appendChild(li);
  });
  skillsTitle.textContent = tipo === 'hard' ? 'Hard Skills' : 'Soft Skills';
}
let projetoCards = [];
// Carrega e exibe os projetos dinamicamente
function renderProjetos() {
  fetch('data/projects.json')
    .then(response => response.json())
    .then(projetos => {
      const projetosContainer = document.getElementById('projetos-container');
      if (!projetosContainer) return;
      projetosContainer.innerHTML = '';
      projetos.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'projeto-card-item';

        // Overlay de bloqueio se não estiver completed
        let lockedOverlay = '';
        if (proj.status !== 'completed') {
          lockedOverlay = `
            <div class="projeto-locked-overlay">
              <img src="assets/icons/locked.svg" alt="Projeto bloqueado" class="projeto-locked-icon">
            </div>
          `;
        }

        // Imagem do projeto (se houver)
        let imgHTML = '';
        if (proj.image) {
          imgHTML = `<div class="projeto-img-wrapper"><img src="${proj.image}" alt="Imagem do projeto ${proj.title}" class="projeto-img"></div>`;
        }

        // Tecnologias (se houver)
        let techHTML = '';
        if (proj.technologies && proj.technologies.length > 0) {
          techHTML = `<ul class="projeto-tech-list">${proj.technologies.map(tech => `<li>${tech}</li>`).join('')}</ul>`;
        }

        // Link do projeto (se houver)
        let linkHTML = '';
        if (proj.url && proj.status === 'completed') {
          linkHTML = `<a href="${proj.url}" target="_blank" rel="noopener" class="projeto-link">Ver projeto</a>`;
        }

        card.innerHTML = `
          ${lockedOverlay}
          ${imgHTML}
          <div class="projeto-card-content">
            <h3 class="projeto-titulo">${proj.title || ''}</h3>
            <p class="projeto-descricao">${proj.description || ''}</p>
            ${linkHTML}
            ${techHTML}
          </div>
        `;
        if (proj.status !== 'completed') {
          card.classList.add('projeto-card-locked');
        }
        projetosContainer.appendChild(card);
      });
    }) 
    .catch(error => {
      console.error('Erro ao carregar projetos:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  // MENU HAMBURGUER RESPONSIVO
  const menu = document.getElementById('menu');
  const menuToggle = document.getElementById('menu-toggle');
  const menuLinks = menu.querySelectorAll('a');

  function closeMenu() {
    menu.classList.remove('open');
    menu.classList.add('closed');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    menu.classList.add('open');
    menu.classList.remove('closed');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  // Estado inicial
  closeMenu();

  menuToggle.addEventListener('click', () => {
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Fecha o menu ao clicar em um link (mobile)
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        closeMenu();
      }
    });
  });

  // Fecha o menu ao redimensionar para desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      menu.classList.remove('closed');
      menu.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    } else {
      closeMenu();
    }
  });

  // --- RESTANTE DO CÓDIGO ORIGINAL ---
  fetch('data/certifications.json')
    .then(response => response.json())
    .then(certificacoes => {
      const certContainer = document.getElementById('cert-container');
      if (!certContainer) return;

      const ul = document.createElement('ul');
      ul.className = 'cert-lista-links';

      certificacoes.forEach((cert, idx) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = cert.urlCertificado;
        a.textContent = cert.Titulo;
        a.target = '_blank';
        li.appendChild(a);

        // Eventos para mostrar HardSkills e mudar título
        li.addEventListener('mouseenter', () => {
          if (softSkillTimeout) {
            clearTimeout(softSkillTimeout);
            softSkillTimeout = null;
          }
          renderSkills(cert.HardSkills || [], 'hard');
        });
        li.addEventListener('mouseleave', () => {
          softSkillTimeout = setTimeout(() => {
            renderSkills(softSkillsPadrao, 'soft');
            softSkillTimeout = null;
          }, 250); // atraso de 250ms
        });

        ul.appendChild(li);
      });

      certContainer.innerHTML = '';
      certContainer.appendChild(ul);

      // Garante que as soft skills padrão aparecem ao carregar
      renderSkills(softSkillsPadrao, 'soft');
    })
    .catch(error => {
      console.error('Erro ao carregar certificações:', error);
    });

  renderProjetos();
});

// Adiciona evento de clique para scroll suave
const projectsContainer = document.getElementById('projetos-container');

const scrollStep = 270; // Quantidade de pixels para rolar a cada clique

btnPrev.addEventListener('click', () => {
  projectsContainer.scrollBy({
    left: -scrollStep,
    behavior: 'smooth'
  });
});

btnNext.addEventListener('click', () => {
  projectsContainer.scrollBy({
    left: scrollStep,
    behavior: 'smooth'
  });
});
