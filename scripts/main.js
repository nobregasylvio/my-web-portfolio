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

document.addEventListener('DOMContentLoaded', () => {
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
});
