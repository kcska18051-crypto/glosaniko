const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const dialog = document.querySelector('#preview-dialog');
document.querySelectorAll('[data-preview]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault(); document.querySelector('#dialog-title').textContent = link.dataset.preview;
  dialog.setAttribute('aria-labelledby', 'dialog-title'); dialog.showModal();
}));
document.querySelectorAll('.dialog-close, .dialog-back').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.querySelector('#contact-form').addEventListener('submit', event => { event.preventDefault(); document.querySelector('.form-status').textContent = 'Это локальный макет. Данные не отправлены и не сохранены. Отправку подключим после получения контактов и согласованных документов.'; });
const componentTexts = [
  ['Эмаль', 'Цвет и финишное покрытие — базовый материал системы Glosaniko'],
  ['Отвердитель', 'Компонент двухкомпонентной системы — используется совместно с эмалью Glosaniko'],
  ['Разбавитель', 'Подготовка материала к нанесению — рекомендации по применению в технической документации']
];
const componentButtons = [...document.querySelectorAll('[data-component]')];
const componentCards = [...document.querySelectorAll('.system-grid article')];
function selectComponent(index) {
  componentButtons.forEach((button,i) => { button.classList.toggle('active',i===index); button.setAttribute('aria-pressed',String(i===index)); });
  componentCards.forEach((card,i) => card.classList.toggle('selected',i===index));
  document.querySelector('.component-detail strong').textContent = componentTexts[index][0];
  document.querySelector('.component-detail p').textContent = componentTexts[index][1];
}
componentButtons.forEach((button,i) => button.addEventListener('click',()=>selectComponent(i)));
selectComponent(0);
