(() => {
  const select = document.querySelector('#purchase-region');
  const result = document.querySelector('#purchase-result');
  if (!select || !result) return;
  const script = document.currentScript;
  const dataUrl = new URL('dealer-network.json', script.src);
  const safeUrl = value => {
    if (!value) return null;
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
  };
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  function markets(items, compact = false) {
    const grid = element('div', '', compact ? 'purchase-alternatives' : 'purchase-tiles');
    items.forEach(item => {
      const card = element('article', '', 'purchase-platform');
      const icon = element('span', item.id === 'wb' ? 'wb' : item.id === 'ozon' ? 'O' : '', `market-icon ${item.id}`);
      icon.setAttribute('aria-hidden', 'true');
      if (item.id === 'ym') {
        const image = element('img'); image.src = new URL('yandex-market-official.png', script.src).href; image.alt = ''; image.width = image.height = 64; icon.append(image);
      }
      card.append(icon, element('h3', item.name));
      const href = safeUrl(item.url);
      if (href) {
        const link = element('a', 'Перейти в магазин ↗', 'purchase-store-link');
        link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.setAttribute('aria-label', `Перейти в магазин Glosaniko на ${item.name}`); card.append(link);
      } else card.append(element('span', 'Ссылка на магазин уточняется', 'purchase-link-pending'));
      grid.append(card);
    });
    return grid;
  }
  fetch(dataUrl).then(response => {
    if (!response.ok) throw new Error('Network data unavailable');
    return response.json();
  }).then(data => {
    document.querySelector('[data-marketplaces]').replaceWith(markets(data.marketplaces));
    const dealers = new Map(data.dealers.map(dealer => [dealer.id, dealer]));
    const regions = new Map(data.regions.map(region => [region.id, region]));
    select.replaceChildren(new Option('Выберите регион', ''));
    [...data.regions].sort((a, b) => a.name.localeCompare(b.name, 'ru')).forEach(region => select.add(new Option(region.name, region.id)));
    select.disabled = false;
    select.addEventListener('change', () => {
      const region = regions.get(select.value);
      result.replaceChildren();
      if (!region) { result.append(element('p', 'Выберите регион — покажем доступные способы покупки')); return; }
      const dealer = dealers.get(region.dealerId);
      result.append(element('p', region.name, 'purchase-selected-region'));
      if (dealer && dealer.visible !== false) {
        const card = element('article', '', 'purchase-dealer');
        card.append(element('span', 'Официальный дилер', 'purchase-dealer-label'), element('h3', dealer.name));
        if (safeUrl(dealer.logo)) { const image = element('img'); image.src = safeUrl(dealer.logo); image.alt = dealer.name; image.className = 'purchase-dealer-logo'; card.prepend(image); }
        if (dealer.address) card.append(element('p', dealer.address));
        if (dealer.phone) { const phone = element('a', dealer.phone, 'purchase-dealer-contact'); phone.href = `tel:${dealer.phone.replace(/[^+\d]/g, '')}`; card.append(phone); }
        if (safeUrl(dealer.website)) { const link = element('a', 'Сайт дилера ↗', 'purchase-dealer-contact'); link.href = safeUrl(dealer.website); link.target = '_blank'; link.rel = 'noopener noreferrer'; card.append(link); }
        if (safeUrl(dealer.shopUrl)) { const link = element('a', 'Перейти в магазин ↗', 'button yellow'); link.href = safeUrl(dealer.shopUrl); link.target = '_blank'; link.rel = 'noopener noreferrer'; card.append(link); }
        result.append(card, element('h3', 'Также можно купить на маркетплейсах', 'purchase-alternative-title'));
      } else result.append(element('h3', 'Вы можете приобрести продукцию Glosaniko на маркетплейсах', 'purchase-alternative-title'));
      result.append(markets(data.marketplaces, true));
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) result.animate([{opacity: 0}, {opacity: 1}], {duration: 220, easing: 'ease-out'});
    });
  }).catch(() => {
    select.replaceChildren(new Option('Список регионов временно недоступен', ''));
    result.replaceChildren(element('p', 'Свяжитесь с Glosaniko — поможем с покупкой.'));
    const link = element('a', '+7 (800) 100-25-93', 'text-link'); link.href = 'tel:+78001002593'; result.append(link);
  });
})();
