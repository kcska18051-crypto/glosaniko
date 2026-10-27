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
  copy.append(document.createTextNode('Мы используем файлы Куки (cookie), аналитические и метрические системы Яндекс.Метрика для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с '));
  const privacyLink = document.createElement('a');
  privacyLink.href = new URL('privacy/', base).href;
  privacyLink.textContent = 'Политикой конфиденциальности';
  const cookieLink = document.createElement('a');
  cookieLink.href = new URL('privacy/#cookies', base).href;
  cookieLink.textContent = 'Политикой Куки (Cookie)';
  copy.append(privacyLink, document.createTextNode(' и '), cookieLink, document.createTextNode('.'));
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
