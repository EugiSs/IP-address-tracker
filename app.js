window.onload = function () {
	getAddress('?');
}

// Map
let map = L.map('map', {
	center: [0, 0],
	zoom: 13,
	zoomControl: false,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '© OpenStreetMap'
}).addTo(map);


// IP
document.querySelector('#submit-btn').addEventListener('click', showNewAddress);
document.querySelector('[name="input-ip"]').addEventListener('keydown', (e) => {
	if (e.keyCode === 13) return showNewAddress();
});

async function showNewAddress() {
	let input = document.querySelector('[name="input-ip"]');
	let ip = input.value.replace(/https?:\/\//, "").replace(/\/.*/, "");

	if (!validator.isIP(ip) && !validator.isFQDN(ip)) {
		input.style.border = '1.5px solid red';
		return false;
	}
	input.style.border = 'none';

	await getAddress(ip);
}

async function getAddress(ip) {
	let res = await fetch(`http://ip-api.com/json/${ip}?fields=9208`);
	let data = await res.json();
	changeAddress(data);
};

function changeAddress(data) {
	document.querySelector('#ip-address').textContent = data.query;
	document.querySelector('#location').textContent = `${data.regionName}, ${data.city}, ${data.zip}`;
	document.querySelector('#timezone').textContent = `UTC ${moment.tz(data.timezone).format('Z')}`;
	document.querySelector('#isp').textContent = data.isp;

	map.panTo({
		lat: data.lat,
		lon: data.lon
	});
	L.marker([data.lat, data.lon]).addTo(map);
};





