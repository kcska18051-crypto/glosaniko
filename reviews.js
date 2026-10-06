const reviewGrid = document.querySelector('#customer-reviews');
const viewer = document.querySelector('#review-viewer');
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function openReview(review) {
  viewer.querySelector('h2').textContent = `Отзыв: ${review.author}`;
  const img = viewer.querySelector('img');
  img.src = review.image;
  img.alt = `Оригинальный скриншот отзыва: ${review.author}`;
  viewer.showModal();
}
function reviewCard(review) {
  const card = element('article', 'customer-review');
  const heading = element('div', 'review-heading');
  const meta = element('div', 'review-meta');
  meta.append(element('h3', '', review.author));
  if (review.rating) {
    const stars = element('span', 'review-rating', '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating));
    stars.setAttribute('aria-label', review.rating + ' из 5');
    meta.append(stars);
  }
  heading.append(meta);
  if (review.date) heading.append(element('p', 'review-date', review.date));
  heading.append(element('p', 'review-product', review.color));
  card.append(heading, element('blockquote', 'review-quote', review.text));
  if (review.type === 'image' && review.image) {
    const button = element('button', 'review-image-button');
    button.type = 'button';
    button.setAttribute('aria-label', 'Увеличить изображение отзыва: ' + review.author);
    const img = element('img');
    img.src = review.image;
    img.alt = 'Скриншот отзыва: ' + review.author;
    img.loading = 'lazy';
    button.append(img, element('span', 'review-attachment-label', 'Скриншот отзыва'));
    button.addEventListener('click', () => openReview(review));
    card.append(button);
  }
  return card;
}
fetch('./data.json').then(response => {
  if (!response.ok) throw new Error('Reviews unavailable');
  return response.json();
}).then(reviews => {
  reviewGrid.replaceChildren(...reviews.filter(review => review.visible !== false).map(reviewCard));
}).catch(() => {
  reviewGrid.replaceChildren(element('p', '', 'Не удалось загрузить отзывы. Попробуйте обновить страницу'));
});
viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => {
  if (event.target !== viewer) return;
  const rect = viewer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
});
