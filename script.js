const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezoneEl = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const API_KEY = 'abc42e352fde0f860bc4f261c3d9fd76';

setInterval(() => {
    const time = new Date();
    const month =time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minute = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minute < 10? '0' + minute: minute) + '  ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML =  days[day] + ', ' + date + ' ' + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
        })
    })
}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
    let { timezone } = data;

    timeEl.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E'
    
    timezoneEl.innerHTML = 
    `
    <div class="time-zone" id="time-zone">${timezone}</div>
    `

    currentWeatherItemsEl.innerHTML =     
    `<div class="weather-item">
        <div>Umidade</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressão</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Vento</div>
        <div>${wind_speed} km/h</div>
    </div>
    <div class="weather-item">
        <div>Nascer do Sol</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Pôr do Sol</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>
    `;

    let otherDayForcast = ' '
    data.daily.forEach((day, idx) => {
        if (idx == 0){
            currentTempEl.innerHTML = `
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                    <div class="temp">Noite ${day.temp.night}&#176; C</div>
                    <div class="temp">Dia - ${day.temp.day}&#176; C</div>
                </div>
            `
        } else {
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Noite - ${day.temp.night}&#176; C</div>
                <div class="temp">Dia - ${day.temp.day}&#176; C</div>
            </div>
            `
        }
    })

    weatherForecastEl.innerHTML = otherDayForcast;
}