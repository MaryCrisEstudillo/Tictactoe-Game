'use strict';

/* Every set of three squares that wins the game. */
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

const SPLASH_FADE = 300; // matches the .splash transition

/* Sampled from the mark artwork, so the confetti matches the pieces. */
const MARK_COLORS = {
  x: '#e43996',
  o: '#a0cc3a',
};

const boardEl = document.getElementById('board');
const cells = Array.from(boardEl.querySelectorAll('.cell'));
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const previousBtn = document.getElementById('previous');
const nextBtn = document.getElementById('next');
const splash = document.getElementById('splash');
const startBtn = document.getElementById('start');

let marks;       // one entry per square: 'x', 'o' or null
let moves;       // square indexes, in the order they were played
let currentMark; // whose turn it is
let isOver;      // true once somebody has won or the board is full
let shownMoves;  // how many moves the board is displaying (for the replay)

function newGame() {
  marks = new Array(cells.length).fill(null);
  moves = [];
  currentMark = 'x';
  isOver = false;
  shownMoves = 0;

  statusEl.textContent = 'Player X Turn';
  Confetti.stop();
  render();
}

/* Draws the first `shownMoves` moves. While a game is in progress that is all
   of them; the replay buttons rewind it afterwards. */
function render() {
  const visible = new Array(cells.length).fill(null);
  for (let i = 0; i < shownMoves; i++) {
    visible[moves[i]] = marks[moves[i]];
  }

  cells.forEach((cell, index) => {
    const mark = visible[index];
    cell.classList.toggle('cell--x', mark === 'x');
    cell.classList.toggle('cell--o', mark === 'o');
    cell.disabled = isOver || marks[index] !== null;
    cell.setAttribute(
      'aria-label',
      `Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}: ` +
        (mark ? mark.toUpperCase() : 'empty')
    );
  });

  previousBtn.hidden = !isOver || shownMoves === 0;
  nextBtn.hidden = !isOver || shownMoves === moves.length;
}

function findWinningLine(mark) {
  return WINNING_LINES.find((line) => line.every((index) => marks[index] === mark));
}

/* Blends a colour towards white (positive amount) or black (negative). */
function mix(hex, amount) {
  const value = parseInt(hex.slice(1), 16);
  const target = amount > 0 ? 255 : 0;
  const weight = Math.abs(amount);
  const channel = (shift) => {
    const c = (value >> shift) & 255;
    return Math.round(c + (target - c) * weight);
  };
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

/* Five tones of the winner's own colour. */
function paletteFor(mark) {
  const base = MARK_COLORS[mark];
  return [base, mix(base, 0.3), mix(base, 0.55), mix(base, -0.2), mix(base, -0.38)];
}

/* Centre of an element, in viewport coordinates. */
function centreOf(element) {
  const { left, right, top, bottom } = element.getBoundingClientRect();
  return { x: (left + right) / 2, y: (top + bottom) / 2 };
}

function endGame(message) {
  isOver = true;
  statusEl.textContent = message;
  render();
}

function play(index) {
  if (isOver || marks[index] !== null) return;

  marks[index] = currentMark;
  moves.push(index);
  shownMoves = moves.length;

  const winningLine = findWinningLine(currentMark);
  if (winningLine) {
    endGame(`"${currentMark.toUpperCase()}" Won!`);
    // The middle square of a line is its centre, so the burst starts there.
    Confetti.burst({
      ...centreOf(cells[winningLine[1]]),
      colors: paletteFor(currentMark),
    });
    return;
  }

  if (moves.length === cells.length) {
    endGame('Its a Tie!');
    // Nobody won, so both colours go up, from the middle of the board.
    Confetti.burst({
      ...centreOf(boardEl),
      colors: [...paletteFor('x'), ...paletteFor('o')],
    });
    return;
  }

  currentMark = currentMark === 'x' ? 'o' : 'x';
  statusEl.textContent = `Player ${currentMark.toUpperCase()} Turn`;
  render();
}

/* Steps the finished game backwards or forwards one move. */
function stepReplay(delta) {
  shownMoves = Math.min(moves.length, Math.max(0, shownMoves + delta));
  render();
}

boardEl.addEventListener('click', (event) => {
  const cell = event.target.closest('.cell');
  if (cell) play(Number(cell.dataset.index));
});

restartBtn.addEventListener('click', newGame);
previousBtn.addEventListener('click', () => stepReplay(-1));
nextBtn.addEventListener('click', () => stepReplay(1));

startBtn.addEventListener('click', () => {
  splash.classList.add('is-hiding');
  setTimeout(() => {
    splash.hidden = true;
  }, SPLASH_FADE);
});

newGame();
