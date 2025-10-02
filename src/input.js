let inputDirection = { x: 1, y: 0 };
let lastInputDirection = { x: 1, y: 0 };

function setDirection(x, y) {
  if (lastInputDirection.x === -x && lastInputDirection.y === -y) return;
  inputDirection = { x, y };
}

function handleKeyDown(e) {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();

  switch (e.key) {
    case 'ArrowUp':
      setDirection(0, -1);
      break;
    case 'ArrowDown':
      setDirection(0, 1);
      break;
    case 'ArrowLeft':
      setDirection(-1, 0);
      break;
    case 'ArrowRight':
      setDirection(1, 0);
      break;
    default:
      break;
  }
}

export function getInputDirection() {
  lastInputDirection = inputDirection;
  return inputDirection;
}

export function initInput() {
  window.addEventListener('keydown', handleKeyDown);

  const btnUp = document.getElementById('up-btn');
  const btnDown = document.getElementById('down-btn');
  const btnLeft = document.getElementById('left-btn');
  const btnRight = document.getElementById('right-btn');

  if (btnUp) btnUp.addEventListener('click', () => setDirection(0, -1));
  if (btnDown) btnDown.addEventListener('click', () => setDirection(0, 1));
  if (btnLeft) btnLeft.addEventListener('click', () => setDirection(-1, 0));
  if (btnRight) btnRight.addEventListener('click', () => setDirection(1, 0));
}
