const DECKS = {
  tarot: {
    nome: 'Tarô',
    descricao: 'Arquétipos clássicos para clareza e direção.',
    cartas: [
      { nome: 'O Mago', significado: 'Você possui os recursos necessários para iniciar agora.' },
      { nome: 'A Imperatriz', significado: 'Criatividade, nutrição e fertilidade para novos projetos.' },
      { nome: 'A Força', significado: 'Domínio emocional e coragem gentil para atravessar desafios.' },
      { nome: 'A Roda da Fortuna', significado: 'Mudanças importantes chegam; adapte-se ao novo ciclo.' },
      { nome: 'A Estrela', significado: 'Cura e esperança: siga com fé no processo.' },
      { nome: 'O Sol', significado: 'Êxito, vitalidade e reconhecimento em alta.' }
    ]
  },
  cigano: {
    nome: 'Baralho Cigano',
    descricao: 'Mensagens diretas sobre acontecimentos e relações.',
    cartas: [
      { nome: 'O Cavaleiro', significado: 'Novidades e movimento em curto prazo.' },
      { nome: 'A Árvore', significado: 'Crescimento sólido e conexão com a saúde.' },
      { nome: 'A Chave', significado: 'Soluções, desbloqueio e respostas concretas.' },
      { nome: 'Os Pássaros', significado: 'Comunicação ativa; cuidado com ansiedade e ruídos.' },
      { nome: 'A Estrela', significado: 'Proteção espiritual e direção luminosa.' },
      { nome: 'O Coração', significado: 'Afeto, vínculos e decisões guiadas por verdade emocional.' }
    ]
  },
  cartas: {
    nome: 'Cartas Místicas',
    descricao: 'Insights intuitivos para autoconhecimento profundo.',
    cartas: [
      { nome: 'Portal', significado: 'Uma passagem se abre para um novo patamar.' },
      { nome: 'Espelho', significado: 'A resposta surge ao olhar para dentro com honestidade.' },
      { nome: 'Chama Violeta', significado: 'Transmutação do passado e limpeza energética.' },
      { nome: 'Semeadura', significado: 'O que você planta agora definirá a próxima colheita.' },
      { nome: 'Aliança', significado: 'Uniões estratégicas elevam sua jornada.' },
      { nome: 'Voo', significado: 'Hora de romper limites e expandir sua visão.' }
    ]
  }
};

const THEMES = {
  amor: 'no amor e nos relacionamentos',
  carreira: 'na carreira e prosperidade',
  espiritualidade: 'na sua conexão espiritual',
  geral: 'nos próximos passos da sua vida'
};

const LABELS = ['Passado', 'Presente', 'Futuro'];

const form = document.getElementById('reading-form');
const resultSection = document.getElementById('result');
const resultTitle = document.getElementById('result-title');
const resultSubtitle = document.getElementById('result-subtitle');
const readingDate = document.getElementById('reading-date');
const cardsContainer = document.getElementById('cards');
const summary = document.getElementById('summary');
const deckBadges = document.getElementById('deck-badges');
const historySection = document.getElementById('history-section');
const historyContent = document.getElementById('history-content');
const shuffleBtn = document.getElementById('shuffle-btn');

function renderDeckBadges() {
  deckBadges.innerHTML = Object.values(DECKS)
    .map((deck) => `<span class="chip">${deck.nome}</span>`)
    .join('');
}

function sortearCartas(cartas, quantidade) {
  return [...cartas]
    .sort(() => Math.random() - 0.5)
    .slice(0, quantidade);
}

function formatDate() {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());
}

function cardTemplate(carta, index, total) {
  const label = total === 1 ? 'Conselho' : LABELS[index];
  return `
    <article class="col-md-${total === 1 ? '12' : '4'}">
      <div class="oracle-card">
        <div class="oracle-card-inner" style="animation-delay:${index * 120}ms">
          <small>${label}</small>
          <h4>${carta.nome}</h4>
          <p>${carta.significado}</p>
        </div>
      </div>
    </article>
  `;
}

function createSummary(cards, themeKey) {
  const abertura = cards.map((c) => c.nome).join(', ');
  return `As cartas ${abertura} indicam foco ${THEMES[themeKey]}. Avance com consciência, sem pressa, e confie nos sinais que se repetem ao longo dos próximos dias.`;
}

function saveHistory(payload) {
  localStorage.setItem('oraculo:lastReading', JSON.stringify(payload));
}

function showHistory() {
  const data = localStorage.getItem('oraculo:lastReading');
  if (!data) {
    return;
  }

  const reading = JSON.parse(data);
  historyContent.innerHTML = `
    <p class="mb-1"><strong>${reading.title}</strong></p>
    <p class="mb-1 text-soft">${reading.subtitle}</p>
    <p class="mb-0"><small>${reading.date}</small></p>
  `;
  historySection.hidden = false;
}

function revealReading() {
  const deckKey = document.getElementById('deck').value;
  const spread = Number(document.getElementById('spread').value);
  const theme = document.getElementById('theme').value;
  const question = document.getElementById('question').value.trim();

  const selectedDeck = DECKS[deckKey];
  const cards = sortearCartas(selectedDeck.cartas, spread);

  const subtitleQuestion = question ? `Intenção: “${question}” · ` : '';
  const subtitle = `${subtitleQuestion}${selectedDeck.descricao}`;

  resultTitle.textContent = `${selectedDeck.nome} · ${spread} carta${spread > 1 ? 's' : ''}`;
  resultSubtitle.textContent = subtitle;
  readingDate.textContent = formatDate();
  cardsContainer.innerHTML = cards.map((card, index) => cardTemplate(card, index, spread)).join('');
  summary.textContent = createSummary(cards, theme);

  resultSection.classList.remove('d-none');

  saveHistory({
    title: resultTitle.textContent,
    subtitle: resultSubtitle.textContent,
    date: readingDate.textContent
  });
  showHistory();

  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  revealReading();
});

shuffleBtn.addEventListener('click', () => {
  form.reset();
  document.getElementById('deck').focus();
});

renderDeckBadges();
showHistory();
