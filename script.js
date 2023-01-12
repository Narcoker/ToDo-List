const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector('#todo-list');

const savedTodoList = JSON.parse(localStorage.getItem('saved-items'));

const createTodo = function (storageData) {
    let todoContents = todoInput.value;
    if (storageData) {
        todoContents = storageData.contents;
    }
    const newLi = document.createElement('li');
    const newSpan = document.createElement('span');
    const newBtn = document.createElement('button');

    newBtn.addEventListener('click', () => {
        newLi.classList.toggle('complete');
        saveItemsFn();
    });

    newLi.addEventListener('dblclick', () => {
        newLi.remove();
        saveItemsFn();
    });

    if (storageData?.complete) {
        newLi.classList.add('complete');
    }

    newSpan.textContent = todoContents;
    newLi.appendChild(newBtn);
    newLi.appendChild(newSpan);
    todoList.appendChild(newLi);
    console.log(newLi)
    todoInput.value = "";
    saveItemsFn();
}

const keyCodeCheck = function () {
    if (window.event.keyCode === 13 && todoInput.value.trim() !== '') {
        createTodo();
    }
}

const deleteAll = function () {
    const liList = document.querySelectorAll('li');
    for (let i = 0; i < liList.length; i++) {
        console.log(liList[i])
        liList[i].remove();
    }
    saveItemsFn();
}

const saveItemsFn = function () {
    const saveItems = [];
    for (let i = 0; i < todoList.children.length; i++) {
        const todoObj = {
            contents: todoList.children[i].querySelector('span').textContent,
            complete: todoList.children[i].classList.contains('complete')
        }
        saveItems.push(todoObj);
    }

    if (saveItems.length === 0) {
        localStorage.removeItem('saved-items');
        return;
    }

    if (saveItems.length !== 0) {
        localStorage.setItem('saved-items', JSON.stringify(saveItems));
        return;
    }
}

if (savedTodoList) {
    for (let i = 0; i < savedTodoList.length; i++) {
        createTodo(savedTodoList[i]);
    }
}

const weatherDataActive = function ({ location, weather }) {
    const weatherMainList = [
        'Clear',
        'Clouds',
        'Drizzle',
        'Rain',
        'Snow',
        'Thunderstorm',
    ]

    weather = weatherMainList.includes(weather) ? weather : "Fog";
    const locationNameTag = document.querySelector("#location-name-tag");
    locationNameTag.textContent = location;
    document.body.style.backgroundImage = `url('./images/${weather}.jpg')`;
}

const weatherSearch = function ({ latitude, longitude }) {
    const API_KEY = "8d038f1d2119f9ebfec10c51b8b75396";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    const openWeartherRes = fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            console.log(json.name, json.weather[0].main);
            const weatherData = {
                location: json.name,
                weather: json.weather[0].main
            }
            weatherDataActive(weatherData)
        })
        .catch((err) => {
            console.error(err);
        });
    // console.log(openWeartherRes)
}

const accessToGeo = function ({ coords }) {
    const { latitude, longitude } = coords;
    const positionObj = {
        latitude,
        longitude
    }
    weatherSearch(positionObj);
}

const deniedToGeo = function (err) {
    console.log(err);
}

const askForLocation = function () {
    navigator.geolocation.getCurrentPosition(accessToGeo, deniedToGeo);
}

askForLocation();
