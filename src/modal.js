export function showModal(text) {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  const content = modal.querySelector('.modal-content');
  content.querySelector('h1').textContent = text;
}

export function hideModal() {
  const modal = document.getElementById('modal');
  if (modal) modal.classList.add('hidden');
}
