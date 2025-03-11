function getWeather () {
  const apiKey = '1d0008fb5b5d15876b74b930fa7cd34d'
  const city = document.getElementById('city').value
  if (!city) {
    alert('Please enter a city')
    return
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`

  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      displayWeather(data)
    })
    .catch(error => {
      console.error('Error fetching current weather data:', error)
      alert('Error fetching weather data. Please try again.')
    })

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      displayDailyForecast(data.list)
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error)
      alert('Error fetching forecast data. Please try again.')
    })
}

function displayWeather (data) {
  const tempDivInfo = document.getElementById('temp-div')
  const weatherInfoDiv = document.getElementById('weather-info')
  const weatherIcon = document.getElementById('weather-icon')
  weatherInfoDiv.innerHTML = ''
  tempDivInfo.innerHTML = ''

  if (data.cod === '404') {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`
  } else {
    const cityName = data.name
    const temperature = Math.round(data.main.temp)
    const description = data.weather[0].description
    const iconCode = data.weather[0].icon
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@4x.png`

    weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`
    tempDivInfo.innerHTML = `<p>${temperature}°C</p>`
    weatherIcon.src = iconUrl
    weatherIcon.alt = description
    weatherIcon.style.display = 'block'
  }
}

function displayDailyForecast (forecastData) {
  const dailyForecastDiv = document.getElementById('daily-forecast')
  dailyForecastDiv.innerHTML = ''

  const dailyData = {}
  forecastData.forEach(item => {
    const date = item.dt_txt.split(' ')[0]
    if (!dailyData[date]) {
      dailyData[date] = {
        temp: [],
        icon: item.weather[0].icon,
        description: item.weather[0].description
      }
    }
    dailyData[date].temp.push(item.main.temp)
  })

  Object.keys(dailyData)
    .slice(0, 5)
    .forEach(date => {
      const avgTemp = Math.round(
        dailyData[date].temp.reduce((sum, t) => sum + t, 0) /
          dailyData[date].temp.length
      )
      const iconUrl = `http://openweathermap.org/img/wn/${dailyData[date].icon}.png`

      const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      const dayIndex = new Date(date).getDay()

      const dailyItemHtml = `<div class="daily-item">
      <p>${daysOfWeek[dayIndex]}</p>
      <img src="${iconUrl}" alt="Weather Icon">
      <p>${avgTemp}°C</p>
      <p>${dailyData[date].description}</p>
    </div>`
      dailyForecastDiv.innerHTML += dailyItemHtml
    })
}
