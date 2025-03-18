//      github: https://github.com/slavinskiyboris
//      HH: https://spb.hh.ru/resume/a5ab30cfff097f295a0039ed1f6d6c686f744e
//      linkedin: https://www.linkedin.com/in/slavinskiyboris

document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы формы и модального окна
    const addTripBtn = document.querySelector('.button_type_add');
    const modal = document.getElementById('add-trip-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const addTripForm = document.getElementById('add-trip-form');

    if (addTripBtn) {
        addTripBtn.addEventListener('click', function() {
            modal.style.display = 'flex';
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            addTripForm.reset();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            addTripForm.reset();
        });
    }

    if (addTripForm) {
        addTripForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные из формы
            const tripId = this.elements.id.value.trim();
            const startDate = this.elements.startDate.value;
            const endDate = this.elements.endDate.value;
            const plan = this.elements.plan.value.trim();
            const fact = this.elements.fact.value.trim();
            const city = this.elements.city.value.trim();
            
            // Базовая валидация
            if (!tripId || !startDate || !endDate || !plan || !fact || !city) {
                alert('Пожалуйста, заполните все поля формы');
                return;
            }
            
            // Форматируем даты как в примере
            const formattedDate = `${formatDate(startDate)} - ${formatDate(endDate)}`;
            
            // Создаем новую группу поездки из шаблона
            const tripGroup = createNewTripGroup(tripId, formattedDate, plan, fact, city);
            
            // Добавляем группу в начало таблицы
            const tripsTable = document.querySelector('.trips-table');
            tripsTable.insertBefore(tripGroup, tripsTable.firstChild);
            
            // Добавляем обработчики событий для кнопки документов
            setupDocButtonHandlers();
            
            // Скрываем модальное окно
            modal.style.display = 'none';
            
            // Сбрасываем форму
            this.reset();
            
            // Показываем сообщение об успешном добавлении
            alert(`Поездка ${tripId} успешно добавлена`);
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            addTripForm.reset();
        }
    });

    function setupDocButtonHandlers() {
        const docsBtns = document.querySelectorAll('.button_type_docs');
        docsBtns.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function(e) {
                const row = this.closest('.trips-table__row');
                const idCell = row.querySelector('.trips-table__cell_id a');
                if (idCell) {
                    alert(`Открытие документов для поездки ${idCell.textContent}`);
                    e.stopPropagation();
                }
            });
        });
    }
    
    setupDocButtonHandlers();
    
    function createNewTripGroup(id, date, plan, fact, city) {
        const template = document.getElementById('trip-group-template');
        const clone = template.content.cloneNode(true);
        
        const tripIdLink = clone.querySelector('.trip-id');
        tripIdLink.textContent = id;
        tripIdLink.href = '#' + id;
        
        clone.querySelector('.trip-date').textContent = date;
        clone.querySelector('.trip-plan').textContent = plan;
        clone.querySelector('.trip-fact').textContent = fact;
        
        const cityCol = clone.querySelector('.trip-city');
        if (city.length > 40) {
            const shortCity = city.substring(0, 40) + '...';
            cityCol.textContent = shortCity;
            
            const tooltipContainer = document.createElement('div');
            tooltipContainer.className = 'tooltip-container';
            
            const infoIcon = document.createElement('span');
            infoIcon.className = 'tooltip__icon';
            infoIcon.textContent = 'i';
            tooltipContainer.appendChild(infoIcon);
            
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = city;
            tooltipContainer.appendChild(tooltip);
            
            cityCol.parentNode.insertBefore(tooltipContainer, cityCol.nextSibling);
        } else {
            cityCol.textContent = city;
        }
        
        return clone;
    }

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    }

    // Обработчик сброса фильтров
    const resetBtn = document.querySelector('.button_type_reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Очищаем поля дат
            const dateInputs = document.querySelectorAll('.date-range__input');
            dateInputs.forEach(input => input.value = '');
            
            // Очищаем поле поиска
            const searchInput = document.querySelector('.filter-panel__search-input');
            if (searchInput) {
                searchInput.value = '';
            }
            
            // Снимаем флажок с архива
            const archiveToggle = document.querySelector('.filter-panel__archive-checkbox');
            if (archiveToggle) {
                archiveToggle.checked = false;
            }
        });
    }
}); 