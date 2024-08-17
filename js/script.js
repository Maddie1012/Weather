const changeTheme = document.querySelector('.header-theme-img');
const input = document.querySelector('.header-search');
const dayInfo = document.querySelector('.day-info');
const body = document.body;
const curTemp = document.querySelector('.current-day');
const apiKey = 'aa1c1907c72995220440758af591c62e';
let defaultCity = 'Москва';
let city = '';
const lang = 'ru';

let cityData = {
    temp: null,
    temp_max: null,
    temp_min: null,
    pressure: null,
    timezoneOffset: null,
    temp_feels_like: null,
    windSpeed: null,
    windDirection: null,
    precipitation: null,
}

//осадки
function getPrecipitationText(prec) {
    if (prec === 'Rain') {
        return 'Дождь';
    } else if (prec === 'Snow') {
        return 'Снег';
    } else {
        return 'Без осадков'
    }
}
//вычисление направления ветра
function getWindDirectionText(degree) {
    if (degree > 337.5 || degree <= 22.5) {
        return ' с севера';
    } else if (degree > 22.5 && degree <= 67.5) {
        return ' с северо-востока';
    } else if (degree > 67.5 && degree <= 112.5) {
        return ' с востока';
    } else if (degree > 112.5 && degree <= 157.5) {
        return ' с юго-востока';
    } else if (degree > 157.5 && degree <= 202.5) {
        return ' с юга';
    } else if (degree > 202.5 && degree <= 247.5) {
        return ' с юго-запада';
    } else if (degree > 247.5 && degree <= 292.5) {
        return ' с запада';
    } else if (degree > 292.5 && degree <= 337.5) {
        return ' с северо-запада';
    }
}

//описание ветра относительно скорости
function getWindSpeedText(speed) {
    if (speed < 0.3) return "Штиль";
    if (speed < 1.6) return "Тихий (легкий) ветер";
    if (speed < 3.4) return "Легкий бриз";
    if (speed < 5.5) return "Слабый бриз";
    if (speed < 8.0) return "Умеренный бриз";
    if (speed < 10.8) return "Свежий бриз";
    if (speed < 13.9) return "Сильный бриз";
    if (speed < 17.2) return "Крепкий ветер";
    if (speed < 20.8) return "Крепкий ветер (высокий)";
    if (speed < 24.5) return "Очень крепкий ветер";
    if (speed < 28.5) return "Шторм";
    if (speed < 32.7) return "Сильный шторм";
    return "Ураган";
}

//обновление интерфейса
function updateUI() {
    const now = new Date();
    const localTime = new Date(now.getTime() + cityData.timezoneOffset * 1000);

    const hours = localTime.getUTCHours().toString().padStart(2, '0');
    const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
    const currentTimeString = `${hours}:${minutes}`;
    const windDeg = getWindDirectionText(cityData.windDirection);
    const windSpeedDescr = getWindSpeedText(cityData.windSpeed);
    const precipitationDesc = getPrecipitationText(cityData.precipitation)

    curTemp.children[0].innerText = `${cityData.temp}°`;
    curTemp.children[2].innerText = `Время: ${currentTimeString}`;
    curTemp.children[3].innerText = `Город: ${city}`;

    (dayInfo.children[0]).children[2].innerText = `${cityData.temp}° - ощущается как ${cityData.temp_feels_like}°`;
    (dayInfo.children[1]).children[2].innerText = `${Math.round(cityData.pressure * 0.75006375541921)} мм ртутного столба`;
    (dayInfo.children[2]).children[2].innerText = `${precipitationDesc}`;
    (dayInfo.children[3]).children[2].innerText = `${cityData.windSpeed} м/с ${windDeg} - ${windSpeedDescr}`;
}


//запрос на сервер, получение данных о погоде
function getData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=${lang}&units=metric`)
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        } else {
            return response.json();
        }
    })
    .then(data => {
        cityData.temp = Math.round(data.main.temp);
        cityData.temp_max = Math.round(data.main.temp_max);
        cityData.temp_min = Math.round(data.main.temp_min);
        cityData.temp_feels_like = Math.round(data.main.feels_like);
        cityData.pressure = data.main.pressure;
        cityData.windSpeed = (data.wind.speed).toFixed(1);
        cityData.windDirection = data.wind.deg;
        cityData.timezoneOffset = data.timezone;
        cityData.precipitation = data.weather[0].main;
        console.log(cityData.precipitation)
        updateUI();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    })
}



document.addEventListener('DOMContentLoaded', () => {
    city = defaultCity;
    getData(city)
})

//отображение погоды введенного города
input.addEventListener('keyup', event => {
    if(event.code === 'Enter') {
        city = input.value;
        getData(city)
    }
})

//переключение темы
changeTheme.addEventListener('click', () => {
    body.classList.toggle('light-theme');
})



