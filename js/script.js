// const cityInput = document.querySelector('.city-input')
// const searchBtn = document.querySelector('.search-btn')

// searchBtn.addEventListener('click', () =>  {
//     if (cityInput.value.trim() != '') {
//         updateWeatherInfo()
//     }
// })


// const cityInput = document.querySelector('.city-input')
// const searchBtn = document.querySelector('.search-btn')

// searchBtn.addEventListener('click', () => {
//     if (cityInput.value.trim() != '') {
//         console.log(cityInput.value, event.type)
//         cityInput.value = ''
//         cityInput.blur()
//     }
// })
// cityInput.addEventListener('keydown', (event) => {
//     console.log(event)
// })

const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSelection = document.querySelector('.weather-info')

const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-text')

const forecastItemsContainer = document.querySelector('.forecast-items-container')

const apiKey = 'c19ac12a384b37dd79f6408bf1560726'

searchBtn.addEventListener('click', (event) => {
    event.preventDefault();  
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value);  
        cityInput.value = '';  
        cityInput.blur();  
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFetchData(endPoint, city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch (apiURL)
 
    return response.json()
}

// async function getFetchData(endPoint, city) {
//     try {
//         const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
//         const response = await fetch(apiURL)

//         if (!response.ok) {
//             throw new Error('Network response was not ok')
//         }

//         return response.json()
//     } catch (error) {
//         console.error('Fetch error:', error)
//         return { cod: 500 }  // Возвращаем объект с ошибкой для обработки в основном коде
//     }
// }


function getWeatherIcon(id) {
    if (id <= 232) return 'thuderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city) {
    const weatherData =  await getFetchData('weather', city)

    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        return 
    }
    // console.log(weatherData)

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: {speed}
    } = weatherData

    
    countryTxt.textContent = country 
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + ' M/s'

    currentDateTxt.textContent = getCurrentDate()
    // console.log(getCurrentDate())
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSelection)
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && 
            !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather)
        }
       


    })
    console.log(todayDate)
    console.log(forecastsData)
}

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        date: date,
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="./assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section) {
    [weatherInfoSelection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')
    section.style.display = 'flex'
    }




