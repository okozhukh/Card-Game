document.addEventListener('DOMContentLoaded', function () {
  const level1Button = document.querySelector('.level1');
  const level2Button = document.querySelector('.level2');
  const level3Button = document.querySelector('.level3');
  const startGameButton = document.querySelector('.start-game');
  const pauseGameButton = document.querySelector('.pause-game');
  const messageContainer = document.querySelector('.message-container');
  const gameBoard = document.querySelector('.game-board');
  const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  let cards = [];
  let score;
  let timer;
  let flippedCards = [];
  let gameStarted;
  let paused;

  const createCard = (symbol) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = symbol;
    return card;
  }

  const updateScore = () => {
    document.querySelector('.score').textContent = `Бали: ${score}`;
  }

  const updateTimer = () => {
    document.querySelector('.timer').textContent = `Час: ${timer} сек`;
  }

  const showMessage = (message) => {
    messageContainer.innerHTML = message;
    messageContainer.style.display = 'block';
  }

  const hideMessage = () => {
    messageContainer.style.display = 'none';
  }

  const enableCards = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => card.addEventListener('click', handleCardClick));
  }

  const disableCards = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => card.removeEventListener('click', handleCardClick));
  }

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const setNewGame = () => {
    score = 0;
    timer = 60;
    flippedCards = [];
    gameStarted = false;
    paused = false;

    gameBoard.innerHTML = '';
    startGameButton.disabled = false;
    pauseGameButton.textContent = "Пауза"

    updateScore();
    updateTimer();
    hideMessage();

    shuffle(cards);

    for (const symbol of cards) {
      const card = createCard(symbol);
      gameBoard.appendChild(card);
    }
  }

  const handleLevelButtonClick = (boardSize) => {
    const slicedSymbols = symbols.slice(0, boardSize)
    cards = slicedSymbols.concat(slicedSymbols);
    setNewGame();
  }

  const initializeButtons = () => {
    level1Button.addEventListener('click', () => handleLevelButtonClick(6));
    level2Button.addEventListener('click', () => handleLevelButtonClick(8));
    level3Button.addEventListener('click', () => handleLevelButtonClick(10))
    startGameButton.addEventListener('click', startGame);
    pauseGameButton.addEventListener('click', () => {
      if (gameStarted) {
        paused = !paused;
        countdown();
        paused ? disableCards() : enableCards();
        pauseGameButton.textContent = paused ? "Продовжити" : "Пауза"
      }
    });
  }

  const startGame = () => {
    gameStarted = true;
    startGameButton.disabled = true;

    countdown();
    enableCards();
    hideMessage();
  }

  const handleCardClick = (e) => {
    if (!gameStarted || flippedCards.length === 2 || paused || timer < 0) {
      return;
    }

    e.target.classList.add('flipped');
    flippedCards.push(e.target);

    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;

      if (card1.textContent === card2.textContent) {
        score += 10;
        updateScore();

        if (score === cards.length / 2 * 10) {
          setNewGame();
          showMessage('Гра завершена! Ви виграли!');
          disableCards();
        }

        flippedCards.forEach((card) => {
          card.removeEventListener('click', handleCardClick);
        });

        flippedCards = [];
      } else {
        disableCards();
        setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          enableCards();
          flippedCards = [];
        }, 500);
      }
    }
  }

  const countdown = () => {
    if (paused || !gameStarted) return;

    timer--;

    if (timer < 0) {
      setNewGame();
      showMessage('Гра завершена! Ви програли!');
      disableCards();
    } else {
      updateTimer();
      setTimeout(countdown, 1000);
    }
  }

  initializeButtons();
});
