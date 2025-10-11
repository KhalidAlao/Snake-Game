let inputDirection = { x: 1, y: 0 };
let lastInputDirection = { x: 1, y: 0 };
let pauseCallback = null;

function setDirection(x, y) {
  // Prevent 180-degree turns (can't go directly opposite)
  if (lastInputDirection.x === -x && lastInputDirection.y === -y) return;
  inputDirection = { x, y };
}

function handleKeyDown(e) {
  // Handle pause key first
  if (e.key === 'p' || e.key === 'P') {
    e.preventDefault();
    if (pauseCallback) {
      pauseCallback();
    }
    return;
  }

  // Handle direction keys
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
    
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
}

export function getInputDirection() {
  lastInputDirection = { ...inputDirection }; // Store current direction
  return inputDirection;
}

export function setPauseCallback(callback) {
  pauseCallback = callback;
}

export function resetDirection() {
  inputDirection = { x: 1, y: 0 };
  lastInputDirection = { x: 1, y: 0 };
}

export function initInput(onPause) {
  // Reset direction on init
  resetDirection();
  
  // Set the pause callback
  pauseCallback = onPause;
  
  // Remove any existing event listeners to avoid duplicates
  window.removeEventListener('keydown', handleKeyDown);
  window.addEventListener('keydown', handleKeyDown);

  // Mobile controls - use event delegation to avoid cloning issues
  document.addEventListener('click', (e) => {
    switch (e.target.id) {
      case 'up-btn':
        setDirection(0, -1);
        break;
      case 'down-btn':
        setDirection(0, 1);
        break;
      case 'left-btn':
        setDirection(-1, 0);
        break;
      case 'right-btn':
        setDirection(1, 0);
        break;
    }
  });
}