const baseURL = `https://api.weatherapi.com/v1`;
const endPoint = `/forecast.json`;
const APIKey = `e5037c0a46804d8483a225943240201`;
const rowData = document.querySelector("#container");
const searchInput = document.querySelector("input");
let weatherData = {};


const getDateDetails = (dates) => {
  const date = new Date(dates);
  const weekDay = date.toLocaleString("en-US", {
    weekday: "long",
  });
  const day = date.toLocaleString("en-US", {
    day: "2-digit",
  });
  const month = date.toLocaleString("en-US", {
    month: "long",
  });
  return { weekDay, day, month };
};
const displayWeatherData = (array) => {
  let cartona = ``;
  for (let i = 0; i < array.length; i++) {
    const { weekDay, day, month } = getDateDetails(array[i].date);
    cartona += `
                <div class="col-md-6 col-lg-4">
                        <div class="card text-white">
                            <div class="d-flex justify-content-between align-items-center fs-3">
                                ${
                                  i === 0
                                    ? `
                                <p>${weekDay}</p>
                                <p>${day} ${month}</p>
                                    `
                                    : `<p>${weekDay}</p>`
                                }
                            </div>
                            <div class="fs-4">
                                    ${
                                      i === 0
                                        ? `
                                        <p class="text-start">
                                        ${weatherData.location.name}
                                        </p>`
                                        : ``
                                    }
                                <div class="d-flex flex-column justify-content-between align-items-center">
                                    ${
                                      i === 0
                                        ? `
                                        <p class="display-2 fw-bold">
                                        ${weatherData.current.temp_c} &deg;C
                                    </p>
                                    <img src=${weatherData.current.condition.icon} alt=${weatherData.current.condition.text}> `
                                        : `
                                    <img src=${weatherData.forecast.forecastday[i].day.condition.icon} alt=${weatherData.forecast.forecastday[i].day.condition.text}>
                                    <p>${weatherData.forecast.forecastday[i].day.maxtemp_c}</p>
                                    <p>${weatherData.forecast.forecastday[i].day.mintemp_c}</p>                                
                                        `
                                    }
                                </div>
                                <p class="text-center fs-3">
                                    ${
                                      i === 0
                                        ? `${weatherData.current.condition.text}`
                                        : `${weatherData.forecast.forecastday[i].day.condition.text}`
                                    }
                                </p>
                            </div>
                                ${
                                  i === 0
                                    ? `
                                    <div class="d-flex justify-content-between align-items-center py-2">
                                <span>
                                    <i class="fa-solid fa-umbrella"></i>
                                    ${weatherData.forecast.forecastday[0].day.daily_will_it_rain}%
                                </span>
                                <span>
                                    <i class="fa-solid fa-wind"></i>
                                    ${weatherData.current.wind_kph} KM/H
                                </span>
                                <span>
                                    <i class="fa-solid fa-compass"></i>
                                        ${weatherData.current.wind_dir}
                                </span>
                            </div>
                                    `
                                    : ""
                                }
                        </div>
                    </div>
        `;
  }
  rowData.innerHTML = cartona;
};

const getWeatherData = async (city = "cairo") => {
  if (city.length === 0) getWeatherData();
  if (city.length < 3) return;

  try {
    let response = await fetch(
      `${baseURL}${endPoint}?key=${APIKey}&q=${city}&days=3`
    );
    
    if (!response.ok) {
      
      switch (response.status) {
        case 400: {
          
          throw new Error(`${await response.text()}`); 
        }
        case 500: {
          throw new Error("Server Error!");
        }
        default: {
          throw new Error("Couldn't fetch data!");
        }
      }
    }
    response = await response.json();
    weatherData = response;
    console.log(weatherData);
    displayWeatherData(weatherData.forecast.forecastday);
  } catch (error) {
    console.log(error);
  }
};

searchInput.addEventListener("input", (e) => {
  getWeatherData(e.target.value);
});

window.navigator.geolocation.getCurrentPosition(
  (success) => {
    console.log(success.coords.latitude);
    console.log(success.coords.longitude);
    getWeatherData(`${success.coords.latitude},${success.coords.longitude}`);
  },
  () => {
    getWeatherData();
  }
);
