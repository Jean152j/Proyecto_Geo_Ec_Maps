//Mapa Redirigible

//1. Se inicializa el mapa escogiendo coordenadas y nivel de zoom (15), mientras más sea el número más zoom se le da 

let map9 = L.map('mi_mapa9').setView([-1.009,-78.497], 6);

//2.Se crea capa para mostrar el mapa
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">"Se Puede insertar nombre de organizacion"</a>' //Atribución del mapa puede colocarse lo que necesite
}).addTo(map9);

var heat = L.heatLayer([
[ -1.7065,-79.0480, 0.2], // Latitud, Longitud, Intensidad 
[-1.7545,-78.8283, 0.5],
[-1.6557,-78.7459, 0.3],
[-1.6529,-78.6264, 0.2],
[-1.5596,-78.6017, 0.1],
[-1.6968,-78.5880, 0.5],
[-1.8601,-78.6209, 0.6],
[-0.2970,-78.4891, 0.6],
[-0.2549,-78.3929, 0.6],
[-0.4415,-78.1705, 0.6],
[-0.5899,-78.0826, 0.6],

], {radius: 25,
    minOpacity: 0.4,
    gradient: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
}).addTo(map9);