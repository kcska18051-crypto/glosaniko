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
document.querySelector('#contact-form')?.addEventListener('submit', event => { event.preventDefault(); document.querySelector('.form-status').textContent = event.currentTarget.dataset.demoMessage || 'Это демонстрационная версия. Данные не отправлены и не сохранены. Отправку подключим после получения контактов и согласованных документов.'; });
const componentTexts = [
  ['Эмаль', 'Формирует цвет и финишное покрытие'],
  ['Отвердитель', 'Обеспечивает корректную работу двухкомпонентной системы'],
  ['Разбавитель', 'Помогает подготовить материал к нанесению']
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
if (componentButtons.length) selectComponent(0);
const shadeLinks = [...document.querySelectorAll('.color-jumps a')];
function markShadeGroup() {
  shadeLinks.forEach(link => {
    if (link.hash === location.hash) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}
if (shadeLinks.length) { addEventListener('hashchange', markShadeGroup); markShadeGroup(); }

// Highlight existing homepage destinations when following section links.
function markGlobalSection() {
  const links = document.querySelectorAll('#navigation a[href]');
  links.forEach(link => {
    const target = new URL(link.href);
    if (target.hash && target.pathname === location.pathname) {
      if (target.hash === location.hash) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  });
}
addEventListener('hashchange', markGlobalSection);
markGlobalSection();
const navGroups = [...document.querySelectorAll('.nav-group')];
function toggleSubmenu(group, open) {
  group.classList.toggle('is-open', open);
  group.querySelector('.submenu-toggle').setAttribute('aria-expanded', String(open));
}
navGroups.forEach(group => {
  const button = group.querySelector('.submenu-toggle');
  button.addEventListener('click', () => {
    const open = !group.classList.contains('is-open');
    navGroups.forEach(other => toggleSubmenu(other, other === group && open));
  });
  group.addEventListener('pointerenter', () => { if (matchMedia('(min-width:1251px)').matches) toggleSubmenu(group, true); });
  group.addEventListener('pointerleave', () => { if (matchMedia('(min-width:1251px)').matches) toggleSubmenu(group, false); });
});
document.addEventListener('click', event => {
  if (!event.target.closest('.nav-group')) navGroups.forEach(group => toggleSubmenu(group, false));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') navGroups.forEach(group => toggleSubmenu(group, false));
});
menuButton.addEventListener('click', () => {
  if (menuButton.getAttribute('aria-expanded') === 'false') navGroups.forEach(group => toggleSubmenu(group, false));
});

navGroups.forEach(group => {
  group.addEventListener('focusin', () => { if (matchMedia('(min-width:1251px)').matches) toggleSubmenu(group, true); });
  group.addEventListener('focusout', event => { if (!group.contains(event.relatedTarget)) toggleSubmenu(group, false); });
});
