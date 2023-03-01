let ip = "8.8.8.8"
let access_key = "at_LuVp7vwSvdUqgohY5oVOo9cBAje8T"
window.addEventListener("load", async function () {
	let res = await fetch(
		`https://geo.ipify.org/api/v2/country,city?ipAddress=${ip}&apiKey=${access_key}`
	)
	let data = await res.json()
  changeAddress(data);
})

// Map
let map = L.map("map", {
	center: [0, 0],
	zoom: 13,
	zoomControl: false
})

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution: "© OpenStreetMap"
}).addTo(map)

// IP
document.querySelector("#submit-btn").addEventListener("click", showNewAddress)
document.querySelector('[name="input-ip"]').addEventListener("keydown", (e) => {
	if (e.keyCode === 13) return showNewAddress()
})

async function showNewAddress() {
	let input = document.querySelector('[name="input-ip"]')
	let ip = input.value.replace(/https?:\/\//, "").replace(/\/.*/, "")
	if (!validator.isIP(ip) && !validator.isFQDN(ip)) {
		input.style.border = "1.5px solid red"
		return false
	}
	input.style.border = "none"

	await getAddress(ip)
}

async function getAddress(ip) {
  let url =`https://geo.ipify.org/api/v2/country,city?ipAddress=${ip}&apiKey=${access_key}`;
  if (!validator.isIP(ip)){
     url = `https://geo.ipify.org/api/v2/country,city?domain=${ip}&apiKey=${access_key}`
  }
	let res = await fetch(url)
	let data = await res.json()
	changeAddress(data)
}

function changeAddress(data) {
	document.querySelector("#ip-address").textContent = data.ip
	document.querySelector(
		"#location"
	).textContent = `${data.location.city}, ${data.location.country}, ${data.location.postalCode}`
	document.querySelector("#timezone").textContent = `UTC ${data.location.timezone}`
	document.querySelector("#isp").textContent = data.isp
  console.log(data);
	map.panTo({
		lat: data.location.lat,
		lon: data.location.lng,
	})
	L.marker([data.location.lat, data.location.lng]).addTo(map)
}
