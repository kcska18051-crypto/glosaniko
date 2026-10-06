const region = document.querySelector('#region');
const regionStatus = document.querySelector('#region-status');
region.addEventListener('change', () => {
  regionStatus.textContent = region.value
    ? `${region.value}: информация о продавцах ожидается. Доступные варианты можно уточнить у производителя или посмотреть на маркетплейсах`
    : 'Выберите регион в списке';
});
