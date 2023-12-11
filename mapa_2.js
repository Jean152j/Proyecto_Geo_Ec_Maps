//1. Se inicializa el mapa escogiendo coordenadas y nivel de zoom (15), mientras más sea el número más zoom se le da 

let map = L.map('mi_mapa10').setView([-1.009, -78.497], 6);

//2.Se crea capa para mostrar el mapa

var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">"Se Puede insertar nombre de organizacion"</a>' //Atribución del mapa puede colocarse lo que necesite
}).addTo(map);

// Escucha el cambio en el estilo del mapa
var mapStyleSelect = document.getElementById('mapStyle');
mapStyleSelect.addEventListener('change', function () {
    var selectedStyle = mapStyleSelect.value;

    // Actualiza el estilo del mapa según la selección del usuario
    if (selectedStyle === 'estandar') {
        tileLayer.setUrl('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    } else if (selectedStyle === 'satelite') {
        tileLayer.setUrl('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=oDAuktblFyxLjvuFK6EM');
    } else if (selectedStyle === 'transporte') {
        tileLayer.setUrl('https://c.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391');
    } else if (selectedStyle === 'ciclista') {
        tileLayer.setUrl('https://a.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391');
    } else if (selectedStyle === 'humanitario') {
        tileLayer.setUrl('https://tile-b.openstreetmap.fr/hot/{z}/{x}/{y}.png');
    }
});

//Insertar puntos
/* var punto1 = null;
 var punto2 = null;

 function actualizarCoordenadas() {
   if (punto1) {
     document.getElementById('lat1').textContent = punto1.lat.toFixed(6);
     document.getElementById('lon1').textContent = punto1.lng.toFixed(6);
   }

   if (punto2) {
     document.getElementById('lat2').textContent = punto2.lat.toFixed(6);
     document.getElementById('lon2').textContent = punto2.lng.toFixed(6);
   }
 }

 map.on('click', function(e) {
   if (!punto1) {
     punto1 = e.latlng;
   } else if (!punto2) {
     punto2 = e.latlng;
   } else {
     // Si ya se seleccionaron ambos puntos, restablécelos.
     punto1 = e.latlng;
     punto2 = null;
   }

   actualizarCoordenadas();
 });

 actualizarCoordenadas();*/


//Poner icono 
/*map.on('click', function(e) {
    var latlng = e.latlng;
    agregarMarcador(latlng);
  });
 
  function agregarMarcador(latlng) {
    var marcador = L.marker(latlng).addTo(map);
    
    // Puedes personalizar el icono con una imagen personalizada
    var iconoPersonalizado = L.icon({
      iconUrl: 'marker.png', // Ruta a tu imagen personalizada
      iconSize: [32, 32], // Tamaño del icono
      iconAnchor: [16, 32], // Punto de anclaje del icono
    });
    
    marcador.setIcon(iconoPersonalizado);
  }*/

// Personalizar punto
/*function mostrarDialogo(e) {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Aceptar',
      showCancelButton: false,
      progressSteps: ['1', '2', '3'],
      preConfirm: (values) => {
        agregarMarcador(e.latlng, values[0], values[1], values[2]);
      },
    }).queue([
      {
        title: 'Nombre del Punto',
        input: 'text',
        inputValue: '', // Valor predeterminado vacío
      },
      {
        title: 'Descripción',
        input: 'text',
        inputValue: '', // Valor predeterminado vacío
      },
      {
        title: 'Icono',
        input: 'select',
        inputOptions: {
          'star': 'Estrella',
          'heart': 'Corazón',
          'flag': 'Bandera',
          // Agrega más opciones según tus necesidades
        },
        inputValue: 'star', // Valor predeterminado
      }
    ]).then((result) => {
      // Se agregará el marcador en la función preConfirm
    });
  }
 
  map.on('click', mostrarDialogo);
 
  function agregarMarcador(latlng, nombre, descripcion, iconoSeleccionado) {
    var marcador = L.marker(latlng, {
      icon: L.divIcon({
        className: 'icon-' + iconoSeleccionado,
        html: nombre,
        iconSize: [32, 32],
      }),
    });
 
    marcador.bindPopup(`<b>${nombre}</b><br>${descripcion}`).openPopup();
    marcador.addTo(map);
  }*/

/*var puntos = L.layerGroup().addTo(map);

map.on('click', function (e) {
    mostrarDialogo(e.latlng);
});

function mostrarDialogo(latlng) {
    Swal.fire({
        title: 'Agregar Punto',
        html: '<label for="nombre">Nombre del Punto:</label><input type="text" id="nombre" class="swal2-input">' +
            '<label for="descripcion">Descripción:</label><input type="text" id="descripcion" class="swal2-input">' +
            '<label for="icono">Icono Personalizado:</label><input type="file" id="icono" accept="image/*" class="swal2-file">',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            var nombre = document.getElementById('nombre').value;
            var descripcion = document.getElementById('descripcion').value;
            var iconoSeleccionado = document.getElementById('icono').files[0];

            if (!nombre || !descripcion || !iconoSeleccionado) {
                Swal.showValidationMessage('Por favor, complete todos los campos antes de agregar el punto.');
                return false;
            }

            var iconoUrl = URL.createObjectURL(iconoSeleccionado);

            var marcador = L.marker(latlng, {
                icon: L.icon({
                    iconUrl: iconoUrl,
                    iconSize: [32, 32],
                }),
                draggable: true, // Habilita el arrastre del marcador
            });

            marcador.bindPopup(`<b>${nombre}</b><br>${descripcion}`).openPopup();
            marcador.addTo(puntos);

            // Agregar evento para actualizar el popup cuando se arrastra
            marcador.on('drag', function () {
                var newLatLng = marcador.getLatLng();
                marcador.setPopupContent(`<b>${nombre}</b><br>${descripcion}`).openPopup();
            });
        },
    });
}*/

var puntos = L.layerGroup().addTo(map);


map.on('click', function (e) {
    mostrarDialogo(e.latlng);
});

function mostrarDialogo(latlng) {
    Swal.fire({
        title: 'Agregar Punto',
        html: '<label for="nombre">Nombre del Punto:</label><input type="text" id="nombre" class="swal2-input">' +
            '<label for="descripcion">Descripción:</label><input type="text" id="descripcion" class="swal2-input">' +
            '<label for="icono">Icono Personalizado:</label><input type="file" id="icono" accept="image/*" class="swal2-file">' +
            '<label for="esInicio">Punto de Inicio</label><input type="checkbox" id="esInicio" class="swal2-checkbox">' +
            '<label for="esDestino">Punto de Destino</label><input type="checkbox" id="esDestino" class="swal2-checkbox">',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            var nombre = document.getElementById('nombre').value;
            var descripcion = document.getElementById('descripcion').value;
            var iconoSeleccionado = document.getElementById('icono').files[0];
            var esInicio = document.getElementById('esInicio').checked;
            var esDestino = document.getElementById('esDestino').checked;

            if (!nombre || !descripcion || !iconoSeleccionado) {
                Swal.showValidationMessage('Por favor, complete todos los campos antes de agregar el punto.');
                return false;
            }

            var iconoUrl = null;
            if (iconoSeleccionado) {
                iconoUrl = URL.createObjectURL(iconoSeleccionado);
            }
            if (esInicio) {
                startPoint = latlng;
                alert('Punto de inicio seleccionado.');
            }

            if (esDestino) {
                endPoint = latlng;
                alert('Punto de destino seleccionado.');
            }

            var marcador = L.marker(latlng, {
                icon: iconoUrl ? L.icon({
                    iconUrl: iconoUrl,
                    iconSize: [32, 32],
                }) : undefined,
                draggable: true,
            });

            marcador.bindPopup(`<b>${nombre}<br>${descripcion}`).openPopup();
            marcador.addTo(puntos);

            // Agregar evento para editar el marcador
            marcador.on('click', function () {
                editarMarcador(marcador);
            });

            // Llamada a la función para mostrar coordenadas en consola
            coordenadas.push(latlng);
        },
    });
}

var coordenadas = [];

function mostrarCoordenadasEnConsola(latlng) {
  console.log('Latitud:', latlng.lat.toFixed(6), 'Longitud:', latlng.lng.toFixed(6));
}

function editarMarcador(marcador) {
    Swal.fire({
        title: 'Editar Punto',
        html: '<label for="nombre">Nombre del Punto:</label><input type="text" id="nombre" class="swal2-input" value="' + marcador.getPopup().getContent().split('<br>')[0].replace('<b>', '') + '">' +
            '<label for="descripcion">Descripción:</label><input type="text" id="descripcion" class="swal2-input" value="' + marcador.getPopup().getContent().split('<br>')[1] + '">' +
            '<label for="icono">Icono Personalizado (opcional):</label><input type="file" id="icono" accept="image/*" class="swal2-file">',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            var nombre = document.getElementById('nombre').value;
            var descripcion = document.getElementById('descripcion').value;
            var iconoSeleccionado = document.getElementById('icono').files[0];

            if (!nombre || !descripcion) {
                Swal.showValidationMessage('Por favor, complete los campos de Nombre y Descripción.');
                return false;
            }

            var iconoUrl = null;
            if (iconoSeleccionado) {
                iconoUrl = URL.createObjectURL(iconoSeleccionado);
            }

            if (iconoUrl) {
                marcador.setIcon(L.icon({
                    iconUrl: iconoUrl,
                    iconSize: [32, 32],
                }));
            }

            marcador.setPopupContent(`<b>${nombre}<br>${descripcion}`);
        },
    });
}

function calcularRuta() {
    if (startPoint && endPoint) {
        L.Routing.control({
            waypoints: [
                L.latLng(startPoint.lat, startPoint.lng),
                L.latLng(endPoint.lat, endPoint.lng),
            ],
            routeWhileDragging: true,  // Actualizar la ruta mientras se arrastra
            language: 'es',
        }).addTo(map);
    } else {
        alert('Por favor, seleccione un punto de inicio y un punto final.');
    }
}

// Dibujar en el mapa 
var drawnItems = new L.FeatureGroup().addTo(map);

map.addControl(new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: true,
        circle: true,
        marker: false
    }
}));

map.on('draw:created', function (e) {
    var type = e.layerType;
    var layer = e.layer;
    drawnItems.addLayer(layer);
});

//guardar
// Función para generar el GeoJSON con coordenadas dinámicas
function generarGeoJSONDinamico() {
    var puntos = [];  // Debes llenar esta lista con tus puntos dinámicos

    // Crear un objeto GeoJSON FeatureCollection
    var featureCollection = {
        type: 'FeatureCollection',
        features: [],
    };

    // Convertir cada punto en un Feature de GeoJSON
    puntos.forEach(function (punto) {
        var feature = {
            type: 'Feature',
            properties: {
                nombre: punto.nombre,  // Propiedades personalizadas de tus puntos
            },
            geometry: {
                type: 'Point',
                coordinates: [punto.longitud, punto.latitud],  // Coordenadas dinámicas
            },
        };
        featureCollection.features.push(feature);
    });

    return featureCollection;
}

// Función para descargar el GeoJSON como un archivo
function descargarGeoJSONDinamico() {
    var geoJSON = generarGeoJSONDinamico();
    var geoJSONString = JSON.stringify(coordenadas);

    var blob = new Blob([geoJSONString], { type: 'application/json' });
    var url = URL.createObjectURL(blob);

    var link = document.createElement('a');
    link.href = url;
    link.download = 'puntos.geojson';  // Nombre del archivo GeoJSON
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Agrega un evento al botón para descargar el GeoJSON dinámico
document.getElementById('descargar-geojson').addEventListener('click', descargarGeoJSONDinamico);
