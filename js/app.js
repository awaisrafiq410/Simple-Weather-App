const form = document.querySelector('.top-banner form');
const input = document.querySelector('.top-banner input');
const msg = document.querySelector('.top-banner .msg');
const list = document.querySelector('.ajax-section .cities');
/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
/*PUT YOUR OWN KEY HERE - THIS MIGHT NOT WORK
    SUBSCRIBE HERE: https://home.openweathermap.org/users/sign_up*/
const apiKey = '4cd79a08dd00bcb6892f2b5d096c49ec';
function createCard(main, name, sys, weather, wind, icon) {
	const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${weather[0]['description']}">
          <figcaption>${weather[0]['description']}</figcaption>
        </figure><br>
        <ul data-v-1b8538d2="" data-v-1370a5cc="" class="weather-items text-container orange-side standard-padding XXsnipcss_extracted_selector_selectionXX">
  <li data-v-1b8538d2="">
    <div data-v-1b8538d2="" class="wind-line">
      <svg data-v-47880d39="" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve" class="icon-wind-direction" style="transform: rotate(350deg);">
        <g data-v-47880d39="" fill="#48484a">
          <path data-v-47880d39="" d="M510.5,749.6c-14.9-9.9-38.1-9.9-53.1,1.7l-262,207.3c-14.9,11.6-21.6,6.6-14.9-11.6L474,48.1c5-16.6,14.9-18.2,21.6,0l325,898.7c6.6,16.6-1.7,23.2-14.9,11.6L510.5,749.6z">
          </path>
          <path data-v-47880d39="" d="M817.2,990c-8.3,0-16.6-3.3-26.5-9.9L497.2,769.5c-5-3.3-18.2-3.3-23.2,0L210.3,976.7c-19.9,16.6-41.5,14.9-51.4,0c-6.6-9.9-8.3-21.6-3.3-38.1L449.1,39.8C459,13.3,477.3,10,483.9,10c6.6,0,24.9,3.3,34.8,29.8l325,898.7c5,14.9,5,28.2-1.7,38.1C837.1,985,827.2,990,817.2,990z M485.6,716.4c14.9,0,28.2,5,39.8,11.6l255.4,182.4L485.6,92.9l-267,814.2l223.9-177.4C454.1,721.4,469,716.4,485.6,716.4z">
          </path>
        </g>
      </svg>
      ${wind['speed']} m/s S 
    </div>
  </li>
  <li data-v-1b8538d2="">
    <svg data-v-7bdd0738="" data-v-1b8538d2="" width="96pt" height="96pt" viewBox="0 0 96 96" class="icon-pressure">
      <g data-v-7bdd0738="" transform="translate(0,96) scale(0.100000,-0.100000)" fill="#48484a" stroke="none">
        <path data-v-7bdd0738="" d="M351 854 c-98 -35 -179 -108 -227 -202 -27 -53 -29 -65 -29 -172 0
                                    -107 2 -119 29 -172 38 -75 104 -141 180 -181 58 -31 66 -32 176 -32 110 0
                                    118 1 175 32 77 40 138 101 178 178 31 57 32 65 32 175 0 110 -1 118 -32 176
                                    -40 76 -106 142 -181 179 -49 25 -71 29 -157 32 -73 2 -112 -1 -144 -13z m259
                                    -80 c73 -34 126 -86 161 -159 24 -50 29 -73 29 -135 0 -62 -5 -85 -29 -135
                                    -57 -119 -161 -185 -291 -185 -130 0 -234 66 -291 185 -24 50 -29 73 -29 135
                                    0 130 66 234 185 291 82 40 184 41 265 3z"></path><path data-v-7bdd0738="" d="M545 600 c-35 -35 -68 -60 -80 -60 -27 0 -45 -18 -45 -45 0 -33 -50
                                    -75 -89 -75 -18 0 -41 -5 -53 -11 -20 -11 -20 -11 3 -35 12 -13 33 -24 46 -24
                                    17 0 23 -6 23 -23 0 -13 10 -33 23 -45 30 -28 47 -13 47 43 0 32 6 47 28 68
                                    15 15 37 27 48 27 26 0 44 18 44 44 0 12 26 47 60 81 l60 61 -28 27 -28 27
                                    -59 -60z"></path></g></svg>
    ${main['pressure']} hPa
  </li>
  <li data-v-1b8538d2="">
    <span data-v-1b8538d2="" class="symbol">
      Humidity:
    </span>
     ${main['humidity']}%
  </li>
</ul>
      `;
	return markup;
}
async function getData(url) {
	const response = await fetch(url);
	const data = await response.json();
	return data;
}
function myLoc() {
	var user_loc_card = document.getElementById('user_location');
	if (user_loc_card) {
		var city_name = user_loc_card.getElementsByClassName('city-name')[0].getElementsByTagName('span')[0]
			.textContent;
		msg.textContent = `You already know the weather for ${city_name} ...otherwise be more specific by providing the country code as well 😉`;
		form.reset();
		input.focus();
		return;
	}
	var openWeatherMap = 'http://api.openweathermap.org/data/2.5/weather';
	if (window.navigator && window.navigator.geolocation) {
		window.navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;
			const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
			console.log(url);
			getData(url)
				.then((data) => {
					const { main, name, sys, weather, wind } = data;
					const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]['icon']}.svg`;
					const li = document.createElement('li');
					li.classList.add('city');
					li.id = 'user_location';
					li.innerHTML = createCard(main, name, sys, weather, wind, icon);
					list.appendChild(li);
				})
				.catch((e) => {
					console.log(e);
					msg.textContent = 'Please search for a valid city 😩';
				});

			msg.textContent = '';
			form.reset();
			input.focus();
		});
	}
}
form.addEventListener('submit', (e) => {
	e.preventDefault();
	let inputVal = input.value;
	//check if there's already a city
	const listItems = list.querySelectorAll('.ajax-section .city');
	const listItemsArray = Array.from(listItems);
	console.log(listItems);
	if (listItemsArray.length > 0) {
		const filteredArray = listItemsArray.filter((el) => {
			let content = '';
			//athens,gr
			if (inputVal.includes(',')) {
				//athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
				if (inputVal.split(',')[1].length > 2) {
					inputVal = inputVal.split(',')[0];
					content = el.querySelector('.city-name span').textContent.toLowerCase();
				} else {
					content = el.querySelector('.city-name').dataset.name.toLowerCase();
				}
			} else {
				//athens
				content = el.querySelector('.city-name span').textContent.toLowerCase();
			}
			return content == inputVal.toLowerCase();
		});

		if (filteredArray.length > 0) {
			msg.textContent = `You already know the weather for ${filteredArray[0].querySelector('.city-name span')
				.textContent} ...otherwise be more specific by providing the country code as well 😉`;
			form.reset();
			input.focus();
			return;
		}
	}

	//ajax here
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
	getData(url)
		.then((data) => {
			const { main, name, sys, weather, wind } = data;
			const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]['icon']}.svg`;
			const li = document.createElement('li');
			li.classList.add('city');
			li.innerHTML = createCard(main, name, sys, weather, wind, icon);
			list.appendChild(li);
		})
		.catch(() => {
			msg.textContent = 'Please search for a valid city 😩';
		});

	msg.textContent = '';
	form.reset();
	input.focus();
});
