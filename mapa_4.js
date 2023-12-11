//Mapa con Buscador

//1. Se inicializa el mapa escogiendo coordenadas y nivel de zoom (15), mientras más sea el número más zoom se le da 

let map7 = L.map('mi_mapa7').setView([-1.009,-78.497], 6);

//2.Se crea capa para mostrar el mapa
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">"Se Puede insertar nombre de organizacion"</a>' //Atribución del mapa puede colocarse lo que necesite
}).addTo(map7);

// Dummy markers
L.marker([-0.2219,-78.4973], { title: 'Tienda Quito' }).addTo(map7);
L.marker([-1.2759,-78.6237], { title: 'Tienda Ambato' }).addTo(map7);        
L.marker([-2.852,-78.970], { title: 'Tienda Cuenca' }).addTo(map7);


// PinSearch component
var searchBar = L.control.pinSearch({
    position: 'topright',
    placeholder: 'Search...',
    buttonText: 'Search',
    onSearch: function(query) {
        console.log('Search query:', query);
        // Handle the search query here
    },
    searchBarWidth: '200px',
    searchBarHeight: '30px',
    maxSearchResults: 3
}).addTo(map7);