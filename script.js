// ===== Вспомогательные функции для работы с cookies =====

// Получить значение cookie по имени
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
}

// Установить cookie на 7 дней
function setCookie(name, value) {
    const maxAge = 7 * 24 * 60 * 60; // 7 дней в секундах
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// Удалить cookie
function deleteCookie(name) {
    document.cookie = `${name}=; path=/; max-age=0`;
}

// ===== Имена cookies =====
const COOKIES = {
    type:     'formType',
    floors:   'formFloors',
    area:     'formArea',
    price:    'formPrice',
    location: 'formLocation',
    photo:    'formPhoto',
    mapLink:  'formMapLink'
};

// ===== 1. Сохранение данных при отправке формы =====
document.getElementById('realtyForm').addEventListener('submit', function (event) {
    event.preventDefault(); // отменяем перезагрузку страницы

    // Вид недвижимости — сохраняем только выбранное значение
    const checkedType = document.querySelector('input[name="formType"]:checked');
    if (checkedType) {
        setCookie(COOKIES.type, checkedType.value);
    } else {
        deleteCookie(COOKIES.type);
    }

    // Остальные поля
    setCookie(COOKIES.floors,   document.getElementById('floors').value);
    setCookie(COOKIES.area,     document.getElementById('area').value);
    setCookie(COOKIES.price,    document.getElementById('price').value);
    setCookie(COOKIES.location, document.getElementById('location').value);
    setCookie(COOKIES.mapLink,  document.getElementById('mapLink').value);

    // Файл: содержимое в cookie не сохраняем (лимит 4 КБ),
    // сохраняем только имя выбранного файла
    const photoInput = document.getElementById('photo');
    if (photoInput.files.length > 0) {
        setCookie(COOKIES.photo, photoInput.files[0].name);
    } else {
        deleteCookie(COOKIES.photo);
    }

    alert('Данные сохранены в cookies на 7 дней. Обновите страницу — они восстановятся.');
});

// ===== 2. Восстановление данных при загрузке страницы =====
document.addEventListener('DOMContentLoaded', function () {
    // Текстовые и числовые поля
    const floors = getCookie(COOKIES.floors);
    if (floors !== null) document.getElementById('floors').value = floors;

    const area = getCookie(COOKIES.area);
    if (area !== null) document.getElementById('area').value = area;

    const price = getCookie(COOKIES.price);
    if (price !== null) document.getElementById('price').value = price;

    const location = getCookie(COOKIES.location);
    if (location !== null) document.getElementById('location').value = location;

    const mapLink = getCookie(COOKIES.mapLink);
    if (mapLink !== null) document.getElementById('mapLink').value = mapLink;

    // Радиокнопки — отмечаем ту, чьё значение совпало
    const type = getCookie(COOKIES.type);
    if (type !== null) {
        const radio = document.querySelector(`input[name="formType"][value="${type}"]`);
        if (radio) radio.checked = true;
    }

    // Файл — восстановить значение в <input type="file"> из соображений
    // безопасности браузер не позволяет, поэтому просто показываем,
    // какой файл был выбран ранее (например, в подсказке)
    const photoName = getCookie(COOKIES.photo);
    if (photoName) {
        document.getElementById('photo').title = `Ранее выбран файл: ${photoName}`;
    }
});

// ===== 3. Очистка формы и cookies =====
document.getElementById('clearBtn').addEventListener('click', function () {
    // Удаляем все cookies
    Object.values(COOKIES).forEach(deleteCookie);

    // Сбрасываем форму
    document.getElementById('realtyForm').reset();

    // Убираем возможную подсказку о файле
    document.getElementById('photo').title = '';

    alert('Cookies и поля формы очищены.');
});