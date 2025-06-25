// Carrega e exibe os títulos dos certificados com link

document.addEventListener('DOMContentLoaded', () => {
  fetch('data/certifications.json')
    .then(response => response.json())
    .then(certificacoes => {
      const certContainer = document.getElementById('cert-container');
      if (!certContainer) return;

      const ul = document.createElement('ul');
      ul.className = 'cert-lista-links';

      certificacoes.forEach(cert => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = cert.urlCertificado;
        a.textContent = cert.Titulo;
        a.target = '_blank';
        li.appendChild(a);
        ul.appendChild(li);
      });

      certContainer.innerHTML = '';
      certContainer.appendChild(ul);
    })
    .catch(error => {
      console.error('Erro ao carregar certificações:', error);
    });
});
