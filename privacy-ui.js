(() => {
  const script = document.currentScript;
  const base = new URL('./', script.src);
  let acknowledged = false;
  try { acknowledged = localStorage.getItem('glosaniko-privacy-notice-v1') === 'seen'; } catch {}
  if (acknowledged) return;
  const notice = document.createElement('aside');
  notice.className = 'cookie-notice';
  notice.setAttribute('aria-label', 'Cookies и конфиденциальность');
  const copy = document.createElement('p');
  copy.textContent = 'В этой версии сайт запоминает закрытие уведомления в вашем браузере. Аналитические и рекламные cookies не используются. Подробнее: ';
  const link = document.createElement('a');
  link.href = new URL('privacy/', base).href;
  link.textContent = 'политика конфиденциальности';
  copy.append(link);
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Понятно';
  button.addEventListener('click', () => {
    try { localStorage.setItem('glosaniko-privacy-notice-v1', 'seen'); } catch {}
    notice.remove();
  });
  notice.append(copy, button);
  document.body.append(notice);
})();
