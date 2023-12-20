
//Se inicializa el mapa escogiendo coordenadas y nivel de zoom, mientras mayor sea el número más zoom se le da 

let map = L.map('mapa_general', {
    zoomControl: false, // Desactiva el control de zoom predeterminado
});
var drawnItems = new L.FeatureGroup().addTo(map);
var drawControl;
var dibujando = false; // Variable para rastrear si se está dibujando
L.control.zoom({
    zoomInTitle: 'Acercar',
    zoomOutTitle: 'Alejar'
}).addTo(map);
map.addLayer(drawnItems);

// Se crea capa para mostrar el mapa
var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' //Atribución del mapa puede colocarse lo que necesite
}).addTo(map);

// Escucha el cambio en el estilo del mapa
var mapStyleSelect = document.getElementById('mapStyle');
mapStyleSelect.addEventListener('change', function () {
    var selectedStyle = mapStyleSelect.value;

    // Actualiza el estilo del mapa según la selección del usuario
    if (selectedStyle === 'estandar' || selectedStyle === 'satelite' || selectedStyle === 'transporte' || selectedStyle === 'ciclista' /* Agrega más estilos según tus capas */) {
        // Actualiza el layer de todos los puntos existentes según el nuevo estilo del mapa
        geojsonData.features.forEach(function (feature) {
            if (feature.geometry.type === 'Point') {
                actualizarLayerPunto(feature);
            }
        });

        // Actualiza la capa del mapa
        cambiarLayerMapa(selectedStyle);
    }
    // Agrega más casos según tus capas
});

// Configurar el geocodificador de Nominatim
var geocoder = L.Control.geocoder({
    geocoder: L.Control.Geocoder.nominatim(),
    placeholder: 'Buscar...'
}).addTo(map);

// Manejar eventos de geocodificación
geocoder.on('markgeocode', function (event) {
    var center = event.geocode.center;
    map.flyTo(new L.LatLng(center.lat, center.lng), 12);
});

// Crear un control de geolocalización con opciones personalizadas
var locateControl = L.control.locate({
    position: 'topright', // Posición del control
    drawMarker: true, // dibujar el marcador al encontrar la ubicación
    showPopup: true, // mostrar un mensaje emergente cuando se encuentra la ubicación
    locateOptions: {
        enableHighAccuracy: true, // Mejor precisión, si está disponible
    },
    strings: {
        title: "Mostrar mi ubicación", // Cambiar el título del botón
        popup: "¡Estás aquí! (precisión {distance} metros)", // Cambiar el mensaje emergente (si showPopup es true)
    },
}).addTo(map);

// Personalizar la posición del control (si prefieres ajustarlo después de haberlo creado)
locateControl.setPosition('topright');


// Obtener las coordenadas del usuario
navigator.geolocation.getCurrentPosition(
    function (position) {
        var userLat = position.coords.latitude;
        var userLng = position.coords.longitude;

        // Inicializar el mapa con las coordenadas del usuario y nivel de zoom
        map.setView([userLat, userLng], 17);


    },
    function (error) {
        // En caso de error, puedes manejarlo aquí
        console.error('Error al obtener la ubicación del usuario:', error);

    }
);


var puntos = L.layerGroup().addTo(map);


var geojsonData = {
    "type": "FeatureCollection",
    "features": []
};

map.on('click', function (e) {
    if (!dibujando) {
        mostrarDialogo(e.latlng);
    }

});


var puntosParaRutaAgregados = false;
var startPoint = false;
var endPoint = false;
var iconoInicioPredeterminado = 'img/marker.png';  // Reemplaza con la URL de la imagen para el punto de inicio
var iconoDestinoPredeterminado = 'img/final.png';  // Reemplaza con la URL de la imagen para el punto de destino
// Variable global para almacenar el valor del layer
var mapaLayer;
// Define un objeto que mapea los nombres de los iconos a sus rutas
var iconosPredefinidos = {
    'Abierto 24/7': 'img/abierto24-7.png',
    'Aeropuerto': 'img/aeropuerto.png',
    'Agua': 'img/agua.png',
    'Alfiler': 'img/alfiler.png',
    'Alojamiento': 'img/alojamiento.png',
    'Alquiler de Vehículos': 'img/rentar_carro.png',
    'Ancla': 'img/ancla.png',
    'Aparcamiento': 'img/aparcamiento.png',
    'Arrecife': 'img/arrecife.png',
    'Auto': 'img/auto.png',
    'Autopista': 'img/autopista.png',
    'Ayuntamiento': 'img/ayuntamiento.png',
    'Banco': 'img/banco.png',
    'Bandera': 'img/bandera.png',
    'Baño': 'img/baño.png',
    'Bar': 'img/bar.png',
    'Barco': 'img/barco.png',
    'Biblioteca': 'img/biblioteca.png',
    'Bife': 'img/bife.png',
    'Bocina': 'img/bocina.png',
    'Bolos': 'img/bolos.png',
    'Bosque': 'img/bosque.png',
    'Boya': 'img/boya.png',
    'Bus': 'img/bus.png',
    'Buzón': 'img/buzon.png',
    'Cámara': 'img/camara.png',
    'Camión': 'img/camion.png',
    'Campana': 'img/campana.png',
    'Camping': 'img/camping.png',
    'Campo De Golf': 'img/campo_golf.png',
    'Campo Petrolero': 'img/campo_petrolero.png',
    'Casa': 'img/casa.png',
    'Casino': 'img/casino.png',
    'Cementerio': 'img/cementerio.png',
    'Centro Comercial': 'img/centro_comercial.png',
    'Centro Médico': 'img/centro_medico.png',
    'Cine': 'img/cine.png',
    'Comida China': 'img/comida_china.png',
    'Comida Rápida': 'img/comida_rapida.png',
    'Cruce Peatones': 'img/cruce_peaton.png',
    'Cuadrón': 'img/cuadron.png',
    'Cumbre': 'img/cumbre.png',
    'Diamante': 'img/diamante.png',
    'Ducha': 'img/ducha.png',
    'Edificio': 'img/edificio.png',
    'Escuela': 'img/escuela.png',
    'Esquí': 'img/esqui.png',
    'Estación De Policía': 'img/policia.png',
    'Estadio': 'img/estadio.png',
    'Farmacia': 'img/farmacia.png',
    'Faro': 'img/faro.png',
    'Fuente De Agua': 'img/fuente.png',
    'Gasolinera': 'img/gasolinera.png',
    'Gimnasio': 'img/gimnasio.png',
    'Grupo': 'img/grupo.png',
    'Helipuerto': 'img/helipuerto.png',
    'Herramientas': 'img/herramientas.png',
    'Hidrante': 'img/hidrante.png',
    'Hotel': 'img/hotel.png',
    'Huellas Animales': 'img/huellas.png',
    'Iglesia': 'img/iglesia.png',
    'Información': 'img/informacion.png',
    'Letra A': 'img/letra-a.png',
    'Letra B': 'img/letra-b.png',
    'Letra C': 'img/letra-c.png',
    'Letra D': 'img/letra-d.png',
    'Mariscos': 'img/mariscos.png',
    'Militar': 'img/militar.png',
    'Mina': 'img/mina.png',
    'Muelle': 'img/muelle.png',
    'Mundo': 'img/mundo.png',
    'Museo': 'img/museo.png',
    'Número 1': 'img/numero1.png',
    'Número 2': 'img/numero2.png',
    'Número 3': 'img/numero3.png',
    'Número 4': 'img/numero4.png',
    'Número 5': 'img/numero5.png',
    'Oficina De Correos': 'img/oficinacorreo.png',
    'Paracaídas': 'img/paracaidas.png',
    'Parque': 'img/parque.png',
    'Parque De Diversiones': 'img/parquediversiones.png',
    'Patinaje Sobre Hielo': 'img/patinajehielo.png',
    'Peligro': 'img/peligro.png',
    'Pesca': 'img/pesca.png',
    'Pizza': 'img/pizza.png',
    'Playa': 'img/playa.png',
    'Puente': 'img/puente.png',
    'Reparación De Autos': 'img/reparacionauto.png',
    'Restaurante': 'img/restaurante.png',
    'Salida': 'img/salida.png',
    'Salvavidas': 'img/salvavidas.png',
    'Taxi': 'img/taxi.png',
    'Teatro': 'img/teatro.png',
    'Teléfono': 'img/telefono.png',
    'Túnel': 'img/tunel.png',
    'Zona De Peligro': 'img/zonapeligro.png',
    'Zoológico': 'img/zoologico.png',
};

function mostrarDialogo(latlng) {
    if (startPoint && endPoint) {
        Swal.fire({
            title: 'Selecciona una opción',
            showCancelButton: true,
            confirmButtonText: 'Agregar Punto Normal',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                mostrarFormularioAgregarPunto(latlng);
            }
        });

    } else {
        Swal.fire({
            denyButtonColor: '#1D8348',
            title: 'Selecciona una opción',
            showCancelButton: true,
            confirmButtonText: 'Agregar Punto',
            cancelButtonText: 'Cancelar',
            showDenyButton: true,
            denyButtonText: 'Agregar Punto para Ruta'
        }).then((result) => {
            if (result.isConfirmed) {
                mostrarFormularioAgregarPunto(latlng);
            } else if (result.isDenied) {
                mostrarFormularioAgregarPuntoRuta(latlng);
            }
        });
    }
}


function mostrarFormularioAgregarPunto(latlng) {
    var opcionesIconos = '';
    for (var nombreIcono in iconosPredefinidos) {
        opcionesIconos += `<option value="${iconosPredefinidos[nombreIcono]}">${nombreIcono}</option>`;
    }

    Swal.fire({
        title: 'Agregar Punto',
        html: '<label for="nombre">Nombre del Punto:</label><input type="text" id="nombre" class="swal2-input">' +
            '<label for="descripcion">Descripción:</label><input type="text" id="descripcion" class="swal2-input">' +
            '<label for="icono">Seleccione un Icono:</label>' +
            '<select id="icono" class="swal2-select">' +
            opcionesIconos + 
            '</select>' + '<br>' +
            '<label for="fotos">Subir Fotos (opcional):</label>' +
            '<input type="file" id="fotos" class="swal2-input" multiple>',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            var nombre = document.getElementById('nombre').value;
            var descripcion = document.getElementById('descripcion').value;
            var iconoSeleccionado = document.getElementById('icono').value;
            var fotosInput = document.getElementById('fotos');
            var fotos = fotosInput.files;

            if (!nombre || !descripcion || !iconoSeleccionado) {
                Swal.showValidationMessage('Por favor, complete el Nombre y la Descripción antes de agregar el punto.');
                return false;
            }

            var marcador = L.marker(latlng, {
                icon: L.icon({
                    iconUrl: iconoSeleccionado,
                    iconSize: [40, 40],
                }),
                draggable: false,
                id: generateUniqueId(), // Asigna un id único al marcador
            });

            marcador.bindPopup(`<b>${nombre} <br>${descripcion}`).openPopup();
            marcador.addTo(puntos);

            // Agregar evento para editar el marcador
            marcador.on('click', function () {
                editarYEliminarMarcador(marcador);
            });

            // Antes de llamar a agregarPuntoGeoJSON
            mapaLayer = mapStyleSelect.value;

            agregarPuntoGeoJSON(latlng, nombre, descripcion, iconoSeleccionado, fotos, marcador);

            Swal.fire('Éxito', 'Punto Agregado Correctamente. ', 'success');

        }
    });

}


function mostrarFormularioAgregarPuntoRuta(latlng) {
    Swal.fire({
        title: 'Agregar Punto para Ruta',
        html: '<label for="nombre">Nombre del Punto:</label><input type="text" id="nombre" class="swal2-input">' +
            '<label for="descripcion">Descripción:</label><input type="text" id="descripcion" class="swal2-input">' +
            '<label for="esInicio">Punto de Inicio</label><input type="checkbox" id="esInicio" class="swal2-checkbox" ' + (startPoint ? 'disabled' : '') + '>' +  '<br>' +
            '<label for="esDestino">Punto de Destino</label><input type="checkbox" id="esDestino" class="swal2-checkbox" ' + (endPoint ? 'disabled' : '') + '>',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            var nombre = document.getElementById('nombre').value;
            var descripcion = document.getElementById('descripcion').value;
            var esInicio = document.getElementById('esInicio').checked;
            var esDestino = document.getElementById('esDestino').checked;

            if (!nombre || !descripcion || !esInicio && !esDestino) {
                Swal.showValidationMessage('Por favor, complete el Nombre, la Descripción y Selecciona una casilla.');
                return false;
            }

            //Verificar si ambas casillas están marcadas
            if (esInicio && esDestino) {
                Swal.showValidationMessage('Por favor, selecciona solo una casilla a la vez.');
                return false;
            }

            if (esInicio || esDestino) {
                puntosParaRutaAgregados = true;
            }


            if (esInicio) {
                startPoint = latlng;
                Swal.fire('Éxito', 'Punto de inicio seleccionado.', 'success');

                // Desactivar la casilla de punto de inicio si existe
                var esInicioCheckbox = document.getElementById('esInicio');
                if (esInicioCheckbox) {
                    esInicioCheckbox.disabled = true;
                }
            }


            if (esDestino) {
                endPoint = latlng;
                Swal.fire('Éxito', 'Punto de destino seleccionado.', 'success');

                // Desactivar la casilla de punto de destino si existe
                var esDestinoCheckbox = document.getElementById('esDestino');
                if (esDestinoCheckbox) {
                    esDestinoCheckbox.disabled = true;
                }
            }

            var iconoUrl;
            if (esInicio) {
                iconoUrl = iconoInicioPredeterminado;
            } else if (esDestino) {
                iconoUrl = iconoDestinoPredeterminado;
            }

            var marcador = L.marker(latlng, {
                icon: iconoUrl ? L.icon({
                    iconUrl: iconoUrl,
                    iconSize: [40, 40],
                }) : undefined,
                draggable: false,
            });

            marcador.bindPopup(`<b> ${nombre} <br> ${descripcion}`).openPopup();
            marcador.addTo(puntos);

            // Agregar evento para editar el marcador
            marcador.on('click', function () {
                editarMarcadorRuta(marcador);
            });

            // Antes de llamar a agregarPuntoGeoJSON
            mapaLayer = mapStyleSelect.value;

            agregarPuntoRutaGeoJSON(latlng, nombre, descripcion, iconoUrl, esInicio, esDestino);

            // Desactivar la opción después de agregar el punto de destino
            if (esDestino) {
                desactivarAgregarPuntosRuta();
            }


        }

    });
}


function desactivarAgregarPuntosRuta() {
    if (startPoint && endPoint) {
        map.off('click', mostrarDialogo);
        Swal.fire({
            icon: 'info',
            title: '¡Puntos de inicio y destino agregados!',
            text: 'Ya has seleccionado puntos de inicio y destino. No puedes agregar más puntos de ruta, pero puedes agregar puntos normales.',
        });
    } else if (endPoint && startPoint) {
        map.off('click', mostrarDialogo);
        Swal.fire({
            icon: 'info',
            title: '¡Puntos de inicio y destino agregados!',
            text: 'Ya has seleccionado puntos de inicio y destino. No puedes agregar más puntos de ruta, pero puedes agregar puntos normales.',
        });

    }
}

var puntoFeature;  // Declarar puntoFeature en un alcance más amplio
var puntosAgregados = [];  // Array para almacenar los puntos

// Escuchar el evento de cambio de zoom del mapa
map.on('zoomend', function () {
    // Obtener el nuevo nivel de zoom
    var newZoom = map.getZoom();

    // Actualizar el nivel de zoom en cada punto
    if (geojsonData.features) {
        geojsonData.features.forEach(function (feature) {
            if (feature.properties) {
                feature.properties.zoom = newZoom;
            }
        });
    }

    // Puedes convertir a cadena JSON y guardar donde sea necesario
    var geoJsonString = JSON.stringify(geojsonData);
    console.log(geoJsonString);
});

function agregarPuntoGeoJSON(latlng, nombre, descripcion, iconoUrl, imagenes, marcador) {
     // Obtener el nivel de zoom actual del mapa
     var zoom = map.getZoom();
    // Verificar si la información del punto es válida
    if (latlng && nombre && descripcion) {
        puntoFeature = {
            "type": "Feature",
            "properties": {
                "id": marcador.options.id, // Genera un identificador único para el punto
                "nombre": nombre,
                "descripcion": descripcion,
                "iconoUrl": iconoUrl,
                "layer": mapaLayer,  // Utiliza el estilo actual del mapa como layer
                "fotos": [],
                "zoom": zoom  // Nuevo: Agregar el nivel de zoom
            },
            "geometry": {
                "coordinates": [latlng.lng, latlng.lat],
                "type": "Point"
            }
        };

        // Nuevo: Actualiza el layer del punto según el estilo del mapa actual
        actualizarLayerPunto(puntoFeature);


        // Nuevo: Verificar si imagenes está definido y no está vacío
        if (imagenes && imagenes.length > 0) {
            // Procesar las imágenes
            for (var i = 0; i < imagenes.length; i++) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    puntoFeature.properties.fotos.push(e.target.result);
                };
                reader.readAsDataURL(imagenes[i]);
            }
        }

        geojsonData.features.push(puntoFeature);
        // Agregar el punto al array global
        puntosAgregados.push(puntoFeature);
    } else {
        console.error('Error: falta información del punto.');
    }
}

function agregarPuntoRutaGeoJSON(latlng, nombre, descripcion, iconoUrl, esInicio, esDestino) {
    // Obtener el nivel de zoom actual del mapa
    var zoom = map.getZoom();
    // Verificar si la información del punto es válida
    if (latlng && nombre && descripcion) {
        puntoFeature = {
            "type": "Feature",
            "properties": {
                "nombre": nombre,
                "descripcion": descripcion,
                "iconoUrl": iconoUrl,
                "esInicio": esInicio,
                "esDestino": esDestino,
                "layer": mapaLayer,  // Utiliza el estilo actual del mapa como layer
                "zoom": zoom  // Nuevo: Agregar el nivel de zoom
            },
            "geometry": {
                "coordinates": [latlng.lng, latlng.lat],
                "type": "Point"
            }
        };

        // Nuevo: Actualiza el layer del punto según el estilo del mapa actual
        actualizarLayerPunto(puntoFeature);


        geojsonData.features.push(puntoFeature);

    } else {
        console.error('Error: falta información del punto.');
    }
}



document.addEventListener('DOMContentLoaded', function () {
    
    document.getElementById('botonVerInformacion').addEventListener('click', verificarPuntosAgregados);
});

function verificarPuntosAgregados() {
    if (geojsonData.features.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Para visualizar información de puntos, debes agregar al menos un punto al mapa.',
        });
        return;
    } else {
        // Si hay puntos, permite mostrar la información
        mostrarInformacionDePuntos();
    }


}

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function mostrarInformacionDePuntos() {
    // Obtén el div donde mostrarás la información
    var infoDiv = document.getElementById('infoDiv');
    
    // Crea una tabla HTML
    var table = document.createElement('table');
    table.id = 'miTabla'; // Asigna un id a la tabla
    table.border = '1';
    table.style.textAlign = 'center';
    table.style.margin = 'auto'; // Establece márgenes automáticos
    table.style.width = '100%'; // Ajusta el ancho según tus necesidades

    // Crea la fila de encabezado
    var headerRow = table.insertRow(0);
    var headers = ['Nombre', 'Descripción', 'Icono', 'Fotos']; // Agrega más encabezados según sea necesario

    // Agrega los encabezados a la fila de encabezado
    for (var i = 0; i < headers.length; i++) {
        var headerCell = headerRow.insertCell(i);
        headerCell.innerHTML = '<b>' + headers[i] + '</b>';
    }

    // Recorrer los puntos cargados y agregar a la tabla
    for (var i = 0; i < geojsonData.features.length; i++) {
        var punto = geojsonData.features[i].properties;

        // Crea una nueva fila en la tabla
        var row = table.insertRow(i + 1);

        // Agrega las celdas con la información del punto
        var nombreCell = row.insertCell(0);
        nombreCell.innerHTML = punto.nombre;

        var descripcionCell = row.insertCell(1);
        // Verifica si hay descripción y agrega el contenido correspondiente
        descripcionCell.innerHTML = punto.descripcion ? punto.descripcion : 'Es Una Figura';

        var iconoCell = row.insertCell(2);
        iconoCell.innerHTML = ''; // Limpia el contenido anterior

        // Si hay URL de icono, agrega la etiqueta de imagen
        if (punto.iconoUrl) {
            var iconoImg = document.createElement('img');
            iconoImg.src = punto.iconoUrl;
            iconoImg.alt = 'Icono';
            iconoImg.style.width = '100px'; // Puedes ajustar el tamaño según tus necesidades
            iconoCell.appendChild(iconoImg);
        } else {
            iconoCell.innerHTML = 'Sin ícono'; // Muestra "N/A" si no hay URL de icono
        }

        var fotosCell = row.insertCell(3);
        fotosCell.innerHTML = ''; // Limpia el contenido anterior

        // Si hay fotos, agrega las etiquetas de imagen
        if (punto.fotos && punto.fotos.length > 0) {
            for (var j = 0; j < punto.fotos.length; j++) {
                var fotoUrl = punto.fotos[j];
                var fotoImg = document.createElement('img');
                fotoImg.src = fotoUrl;
                fotoImg.alt = 'Foto ' + (j + 1);
                fotoImg.style.width = '100px'; // Puedes ajustar el tamaño según tus necesidades

                // Utiliza una función de cierre para capturar el valor correcto de fotoUrl
                (function (url) {
                    fotoImg.addEventListener('click', function () {
                        abrirModalAmpliarImagen(url); // Pasa la URL de la foto
                    });
                })(fotoUrl);

                fotosCell.appendChild(fotoImg)

            }
        } else {
            fotosCell.innerHTML = 'Sin Fotos'; // Muestra "N/A" si no hay fotos
        }
    }

    // Limpia el contenido previo del div
    infoDiv.innerHTML = '';

    // Agrega la tabla al div
    infoDiv.appendChild(table);

    // Desplaza el infoDiv a la vista
    infoDiv.scrollIntoView({ behavior: 'smooth' });
}



// Función para abrir un modal con la imagen ampliada
function abrirModalAmpliarImagen(fotoUrl) {
    var imgAmpliada = document.createElement('img');
    imgAmpliada.src = fotoUrl;
    imgAmpliada.alt = 'Imagen ampliada';

    // Establecer un ancho máximo y alto máximo para la imagen ampliada
    imgAmpliada.style.maxWidth = '400px'; // Ajusta el ancho máximo según sea necesario
    imgAmpliada.style.maxHeight = '400px'; // Ajusta el alto máximo según sea necesario

    // Abrir el modal con la imagen individual
    Swal.fire({
        html: imgAmpliada,
        showCloseButton: true,
        showConfirmButton: false,
    });
}



// Define un icono por defecto para puntos de ruta


function editarMarcadorPunto(marcador) {
    // Crear opciones del menú desplegable con iconos predefinidos
    var opcionesIconos = '';
    for (var nombreIcono in iconosPredefinidos) {
        opcionesIconos += `<option value="${iconosPredefinidos[nombreIcono]}">${nombreIcono}</option>`;
    }

    // Obtener imágenes actuales
    var imagenesActuales = obtenerImagenesActuales(marcador);

    // Crear el elemento div para mostrar las imágenes actuales
    var imagenesActualesDiv = document.createElement('div');
    imagenesActualesDiv.id = 'imagenes-actuales';

    // Verificar si hay imágenes actuales
    if (imagenesActuales.length > 0) {
        imagenesActuales.forEach(function (imagenUrl) {
            // Crear un elemento de imagen para cada imagen actual
            var imagenElement = document.createElement('img');
            imagenElement.src = imagenUrl;
            imagenElement.alt = 'Imagen actual';
            imagenElement.style.width = '100px'; // Ajusta el tamaño según tus necesidades

            // Agregar el evento de clic para ampliar la imagen
            imagenElement.addEventListener('click', function () {
                abrirModalAmpliarImagen(imagenUrl);
            });

            // Agregar la imagen al div
            imagenesActualesDiv.appendChild(imagenElement);
        });
    } else {
        // Si no hay imágenes actuales, muestra un mensaje
        imagenesActualesDiv.textContent = 'No hay imágenes actuales.';
    }

    // Mostrar el formulario de edición con las imágenes actuales y campo de nuevas imágenes
    Swal.fire({
        title: 'Editar Punto',
        html: '<label for="nombre">Nombre</label><input type="text" id="nombre" class="swal2-input" value="' + marcador.getPopup().getContent().split('<br>')[0].replace('<b>', '') + '">' +
            '<label for="descripcion">Descripción</label><input type="text" id="descripcion" class="swal2-input" value="' + marcador.getPopup().getContent().split('<br>')[1] + '">' +
            '<label for="icono">Seleccione un Icono:</label>' +
            '<select id="icono" class="swal2-select">' +
            opcionesIconos +
            '</select>' +  '<br>' +
            '<label>Imágenes Actuales:</label>' +  '<br>' +
            imagenesActualesDiv.outerHTML + '<br>' +
            '<label for="nuevas-imagenes">Nuevas Imágenes:</label><input type="file" id="nuevas-imagenes" multiple accept="image/*">',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            var nombre = document.getElementById('nombre').value;
            var descripcion = document.getElementById('descripcion').value;
            var iconoSeleccionado = document.getElementById('icono').value;
            var nuevasImagenesInput = document.getElementById('nuevas-imagenes');

            if (!nombre || !descripcion) {
                Swal.showValidationMessage('Por favor, complete los campos de Nombre y Descripción.');
                return false;
            }

            marcador.setIcon(L.icon({
                iconUrl: iconoSeleccionado,
                iconSize: [40, 40],
            }));

            // Al mostrar el contenido inicial
            marcador.setPopupContent(`<b>${nombre}<br>${descripcion}`);

            // Actualizar el GeoJSON
            actualizarPuntoGeoJSON(marcador, nombre, descripcion, iconoSeleccionado);

            // Procesar nuevas imágenes si se han seleccionado
            if (nuevasImagenesInput.files && nuevasImagenesInput.files.length > 0) {
                procesarNuevasImagenes(marcador, nuevasImagenesInput.files);
            }

            Swal.fire('Éxito', 'Punto Actualizado Correctamente. ', 'success');
        },
    });
}

function procesarNuevasImagenes(marcador, nuevasImagenes) {
    // Obtener el punto correspondiente en el GeoJSON
    var puntoGeoJSON = obtenerPuntoGeoJSON(marcador);

    // Verificar si el puntoGeoJSON y sus propiedades están definidos
    if (puntoGeoJSON && puntoGeoJSON.properties) {
        // Obtener la propiedad de imágenes existentes del punto
        var imagenesExistentes = puntoGeoJSON.properties.fotos || [];

        // Convertir la colección de archivos a una matriz de promesas de lectura de archivos
        var promesasLectura = Array.from(nuevasImagenes).map(function (imagen) {
            return new Promise(function (resolve, reject) {
                var lector = new FileReader();
                lector.onload = function (evento) {
                    resolve(evento.target.result);
                };
                lector.onerror = function (error) {
                    reject(error);
                };
                lector.readAsDataURL(imagen);
            });
        });

        // Una vez que se han leído todas las nuevas imágenes, actualizar las propiedades del puntoGeoJSON
        Promise.all(promesasLectura)
            .then(function (nuevasImagenesBase64) {
                // Combinar las imágenes existentes con las nuevas imágenes
                var todasLasImagenes = imagenesExistentes.concat(nuevasImagenesBase64);

                // Actualizar las imágenes en las propiedades del puntoGeoJSON
                puntoGeoJSON.properties.fotos = todasLasImagenes;

                // Actualizar el marcador (puedes necesitar una función específica para esto)
                actualizarMarcador(marcador, puntoGeoJSON);

                // Notificar al usuario que las imágenes han sido procesadas exitosamente
                Swal.fire('Éxito', 'Imágenes procesadas correctamente.', 'success');
            })
            .catch(function (error) {
                console.error('Error al procesar las nuevas imágenes:', error);
                // Puedes mostrar un mensaje de error al usuario si lo consideras necesario
                Swal.fire('Error', 'Hubo un problema al procesar las nuevas imágenes.', 'error');
            });
    } else {
        console.error("El puntoGeoJSON o sus propiedades son indefinidos.", puntoGeoJSON);
        // Puedes mostrar un mensaje de error al usuario si lo consideras necesario
        Swal.fire('Error', 'Falta información del punto.', 'error');
    }
}

function obtenerImagenesActuales(marcador) {
    // Obtener el punto correspondiente en el GeoJSON
    var puntoGeoJSON = obtenerPuntoGeoJSON(marcador);

    // Verificar si el puntoGeoJSON y sus propiedades están definidos
    if (puntoGeoJSON && puntoGeoJSON.properties) {
        // Obtener la propiedad de imágenes existentes del punto
        return puntoGeoJSON.properties.fotos || [];
    } else {
        console.error("El puntoGeoJSON o sus propiedades son indefinidos.", puntoGeoJSON);
        // Puedes mostrar un mensaje de error al usuario si lo consideras necesario
        Swal.fire('Error', 'Falta información del punto.', 'error');
        return [];
    }
}

function obtenerPuntoGeoJSON(marcador) {
    // Encuentra el punto correspondiente en el GeoJSON
    return geojsonData.features.find(function (feature) {
        // Compara las coordenadas para identificar el punto
        return (
            feature.geometry.coordinates[0] === marcador.getLatLng().lng &&
            feature.geometry.coordinates[1] === marcador.getLatLng().lat
        );
    });
}

function actualizarMarcador(marcador, puntoGeoJSON) {
    // Verificar si el puntoGeoJSON y sus propiedades están definidos
    if (puntoGeoJSON && puntoGeoJSON.properties) {
        var nombre = puntoGeoJSON.properties.nombre;
        var descripcion = puntoGeoJSON.properties.descripcion;
        var iconoUrl = puntoGeoJSON.properties.iconoUrl;
        var imagenes = puntoGeoJSON.properties.fotos || [];

        // Actualizar el contenido del popup del marcador
        var contenidoPopup = `<b>${nombre}<br>${descripcion}`;
        marcador.getPopup().setContent(contenidoPopup);

        // Actualizar el icono del marcador
        marcador.setIcon(L.icon({
            iconUrl: iconoUrl,
            iconSize: [40, 40],
        }));


    } else {
        console.error("El puntoGeoJSON o sus propiedades son indefinidos.", puntoGeoJSON);
        // Puedes mostrar un mensaje de error al usuario si lo consideras necesario
        Swal.fire('Error', 'Falta información del punto.', 'error');
    }
}

function editarMarcadorPuntoRuta(marcador) {
    Swal.fire({
        title: 'Editar Punto Ruta',
        html: '<label for="nombre"> Nombre </label><input type="text" id="nombre" class="swal2-input" value="' + marcador.getPopup().getContent().split('<br>')[0].replace('<b>', '') + '">' +
            '<label for="descripcion"> Descripción </label><input type="text" id="descripcion" class="swal2-input" value="' + marcador.getPopup().getContent().split('<br>')[1] + '">',
        showCancelButton: true,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            var nombre = document.getElementById('nombre').value;
            var descripcion = document.getElementById('descripcion').value;


            if (!nombre || !descripcion) {
                Swal.showValidationMessage('Por favor, complete los campos de Nombre y Descripción.');
                return false;
            }

            // Al mostrar el contenido inicial
            marcador.setPopupContent(`<b>${nombre}<br>${descripcion}`);

            // Actualizar el GeoJSON
            actualizarPuntoRutaGeoJSON(marcador, nombre, descripcion);

            Swal.fire('Éxito', 'Punto Actualizado Correctamente. ', 'success');

        },
    });
}

function actualizarPuntoGeoJSON(marcador, nombre, descripcion, iconoUrl) {
    // Encuentra el punto correspondiente en el GeoJSON
    var puntoGeoJSON = geojsonData.features.find(function (feature) {
        // Compara las coordenadas para identificar el punto
        return (
            feature.geometry.coordinates[0] === marcador.getLatLng().lng &&
            feature.geometry.coordinates[1] === marcador.getLatLng().lat
        );
    });

    // Actualiza las propiedades del GeoJSON con los nuevos valores
    puntoGeoJSON.properties.nombre = nombre;
    puntoGeoJSON.properties.descripcion = descripcion;
    puntoGeoJSON.properties.iconoUrl = iconoUrl;

}

function actualizarPuntoRutaGeoJSON(marcador, nombre, descripcion) {
    // Encuentra el punto correspondiente en el GeoJSON
    var puntoGeoJSON = geojsonData.features.find(function (feature) {
        // Compara las coordenadas para identificar el punto
        return (
            feature.geometry.coordinates[0] === marcador.getLatLng().lng &&
            feature.geometry.coordinates[1] === marcador.getLatLng().lat
        );
    });

    // Actualiza las propiedades del GeoJSON con los nuevos valores
    puntoGeoJSON.properties.nombre = nombre;
    puntoGeoJSON.properties.descripcion = descripcion;
}
function editarYEliminarMarcador(marcador) {
    Swal.fire({
        title: 'Opciones del Punto',
        showCancelButton: true,
        confirmButtonText: 'Editar',
        cancelButtonText: 'Cancelar',
        showDenyButton: true,
        denyButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            editarMarcadorPunto(marcador);
        } else if (result.isDenied) {
            eliminarMarcador(marcador);
        }
    });
}

function editarMarcadorRuta(marcador) {
    Swal.fire({
        title: 'Opciones del Punto',
        showCancelButton: true,
        confirmButtonText: 'Editar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            editarMarcadorPuntoRuta(marcador);
        } 
    });
}
function eliminarMarcador(marcador) {
    Swal.fire({
        title: 'Eliminar Punto',
        text: '¿Estás seguro de que quieres eliminar este punto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Elimina el marcador del mapa
            puntos.removeLayer(marcador);

            // Elimina el punto del GeoJSON
            eliminarPuntoGeoJSON(marcador);

            console.log("Antes de eliminar:", puntosAgregados);
            var puntoIndex = puntosAgregados.findIndex(punto => punto.properties.id === marcador.options.id);
            console.log("Marcador a eliminar:", marcador.options.id);

            if (puntoIndex !== -1) {
                puntosAgregados.splice(puntoIndex, 1);

                // Actualiza la tabla de información de puntos
                mostrarInformacionDePuntos();
            } else {
                console.error("No se pudo encontrar el punto en el array puntosAgregados.");
            }
            console.log("Después de eliminar:", puntosAgregados);

            Swal.fire('Punto eliminado', '', 'success');
        }
    });
}



function eliminarPuntoGeoJSON(marcador) {
    // Encuentra el índice del punto correspondiente en el GeoJSON
    var index = geojsonData.features.findIndex(function (feature) {
        // Compara las coordenadas para identificar el punto
        return (
            feature.geometry.coordinates[0] === marcador.getLatLng().lng &&
            feature.geometry.coordinates[1] === marcador.getLatLng().lat
        );
    });

    // Elimina el punto del GeoJSON
    if (index !== -1) {
        geojsonData.features.splice(index, 1);

        // Elimina el marcador del mapa
        todosLosPuntos.removeLayer(marcador);
        // Actualiza la tabla de información de puntos
        mostrarInformacionDePuntos();
    }

}

function calcularRuta() {

    // Obtener todos los puntos, incluidos los nuevos del archivo JSON
    var todosLosPuntosGeoJSON = geojsonData.features;

    if (!todosLosPuntosGeoJSON || todosLosPuntosGeoJSON.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecciona Puntos',
            text: 'Agrega al menos un punto para la ruta antes de calcular.',
        });
        return;
    }

    // Filtrar puntos de inicio y destino
    var puntosInicio = todosLosPuntosGeoJSON.filter(function (punto) {
        return punto.properties.esInicio === true;
    });

    var puntosDestino = todosLosPuntosGeoJSON.filter(function (punto) {
        return punto.properties.esDestino === true;
    });

    if (!puntosInicio.length || !puntosDestino.length) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecciona Puntos Inicio y Destino',
            text: 'Debes seleccionar al menos un punto de inicio y un punto de destino antes de calcular la ruta.',
        });
        return;
    }

    // Limpia las rutas existentes antes de agregar una nueva
    limpiarRutas();

    // Iterar sobre todos los puntos de inicio y destino y agregar rutas
    for (var i = 0; i < puntosInicio.length; i++) {
        for (var j = 0; j < puntosDestino.length; j++) {
            agregarRuta(
                L.latLng(puntosInicio[i].geometry.coordinates[1], puntosInicio[i].geometry.coordinates[0]),
                L.latLng(puntosDestino[j].geometry.coordinates[1], puntosDestino[j].geometry.coordinates[0])
            );
        }
    }
}


function descargarGeoJSON() {

    // Obtener el GeoJSON actualizado
    var geoJSONContenido = generarGeoJSON();

    // Verificar si hay puntos agregados
    if (geojsonData.features.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: 'Para descargar un archivo, debes agregar al menos un punto o una figura al mapa.',
        });
        return;
    }
    var geoJSONContenido = JSON.stringify(geojsonData);
    descargarArchivo(geoJSONContenido, 'mapa_personalizado.json');

}

// Función para descargar el GeoJSON actualizado
function generarGeoJSON() {
    // Aquí generas el GeoJSON actualizado con las propiedades de tus puntos
    // Retorna el GeoJSON como texto JSON
    return JSON.stringify(geojsonData);
}

// Función para descargar un archivo desde un texto y un nombre de archivo
function descargarArchivo(contenido, nombreArchivo) {
    var blob = new Blob([contenido], { type: 'application/json' });
    var enlace = document.createElement('a');
    enlace.href = window.URL.createObjectURL(blob);
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}

var botonLimpiarMapa = document.getElementById('boton-limpiar-mapa');

botonLimpiarMapa.addEventListener('click', function () {
    // Lógica para limpiar el mapa
    mostrarDialogoLimpiarMapa();
});

function mostrarDialogoLimpiarMapa() {
    // Verificar si no hay puntos ni rutas
    if (puntos.getLayers().length === 0 && rutas.length === 0) {
        mostrarMensaje('Nada que limpiar. No hay puntos ni rutas en el mapa.');
        return;
    }

    Swal.fire({
        title: 'Opciones para Limpiar el Mapa',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Descargar y Limpiar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {

            // Lógica para descargar y limpiar
            descargarYLimpiarMapa();

            // Limpia la tabla de información después de limpiar y descargar
            limpiarTablaInformacion();

        }
    });
}

function descargarYLimpiarMapa() {
    var geoJSONContenido = generarGeoJSON();
    descargarArchivo(geoJSONContenido, 'mapa_personalizado.json');

    // Limpiar el mapa después de la descarga
    limpiarMapa();
    // Recargar la página
    location.reload();
}

function limpiarMapa() {
    // Verifica si hay puntos agregados
    if (puntos.getLayers().length === 0 && rutas.length === 0 && todosLosPuntos.getLayers().length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Nada que limpiar',
            text: 'No hay puntos, rutas ni figuras agregadas en el mapa.'
        });

        // Llama a la función para limpiar la tabla de información de puntos
        limpiarTablaInformacion();

        return;
    }

    // Elimina todos los puntos del mapa
    todosLosPuntos.clearLayers();

    // Elimina todas las capas de ruta almacenadas
    for (var i = 0; i < rutas.length; i++) {
        map.removeControl(rutas[i]);
    }

    // Limpia el arreglo de rutas
    rutas = [];

    // Limpia el arreglo de puntos del GeoJSON
    geojsonData.features = [];

    // Llamada a la función para cargar el estado inicial
    cargarEstadoInicial();

    Swal.fire({
        icon: 'success',
        title: 'Mapa limpiado',
        text: 'Los puntos, rutas y figuras han sido limpiados del mapa y se descargó el GeoJSON.'
    });
}

// Agrega la función para limpiar la tabla de información de puntos
function limpiarTablaInformacion() {
    var infoPuntoDiv = document.getElementById('infoPunto');
    // Limpiar el contenido existente en el div de información
    infoPuntoDiv.innerHTML = "";
}

function cargarEstadoInicial() {
    // Centra el mapa en las coordenadas iniciales y establece el nivel de zoom
    map.setView([-1.009, -78.497], 6);

    // Elimina todas las capas existentes en el mapa
    map.eachLayer(function (layer) {
        if (layer !== tileLayer) {
            map.removeLayer(layer);
        }
    });

    // Agrega de nuevo la capa base
    tileLayer.addTo(map);

    // Agrega las capas de puntos y rutas al mapa nuevamente
    todosLosPuntos.addTo(map);
    // Asegúrate de agregar las rutas al mapa
    for (var i = 0; i < rutas.length; i++) {
        rutas[i].addTo(map);
    }

    // Puedes realizar otras acciones según tus necesidades
}


var rutas = [];  // Arreglo para almacenar capas de ruta

function agregarRuta(startPoint, endPoint) {
    var iconoInicio = L.icon({
        iconUrl: iconoInicioPredeterminado,
        iconSize: [40, 40],
    });

    var iconoDestino = L.icon({
        iconUrl: iconoDestinoPredeterminado,
        iconSize: [40, 40],
    });

    // Configura Leaflet Routing Machine
    var ruta = L.Routing.control({
        waypoints: [
            L.latLng(startPoint.lat, startPoint.lng),
            L.latLng(endPoint.lat, endPoint.lng),
        ],
        routeWhileDragging: true,
        language: 'es',
        createMarker: function (i, waypoint, n) {
            // Utiliza el icono personalizado según el tipo de punto (inicio o destino)
            return L.marker(waypoint.latLng, {
                icon: i === 0 ? iconoInicio : iconoDestino,
                draggable: false,
            });
        },
    }).addTo(map);

    rutas.push(ruta);
}


function limpiarRutas() {
    // Elimina todas las capas de ruta almacenadas
    for (var i = 0; i < rutas.length; i++) {
        map.removeControl(rutas[i]);
    }

    // Limpia el arreglo de rutas
    rutas = [];
}

document.getElementById('limpiarRutaBtn').addEventListener('click', function () {
    mostrarDialogoLimpiarRuta();
});

function mostrarDialogoLimpiarRuta() {
    // Verificar si hay rutas
    if (rutas.length === 0) {
        mostrarMensaje('No se ha generado una ruta. Calcula una ruta antes de limpiar.');
        return;
    }

    Swal.fire({
        title: 'Limpiar Ruta',
        text: '¿Estás seguro de que deseas limpiar la ruta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, limpiar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Lógica para limpiar la ruta
            limpiarRuta();
        }
    });
}

function limpiarRuta() {
    // Elimina todas las capas de ruta almacenadas
    for (var i = 0; i < rutas.length; i++) {
        map.removeControl(rutas[i]);
    }

    // Limpia el arreglo de rutas
    rutas = [];

    // Limpia los puntos de inicio y destino solo si existen
    if (startPoint || endPoint) {
        // Elimina los puntos de inicio y destino del mapa
        puntos.removeLayer(startPoint);
        puntos.removeLayer(endPoint);

        // Restablece las variables de inicio y destino a null
        startPoint = null;
        endPoint = null;

        Swal.fire({
            icon: 'success',
            title: 'Ruta limpiada correctamente',
            text: 'La ruta ha sido limpiada.'
        });
    } else {
        Swal.fire({
            icon: 'info',
            title: 'Nada que limpiar',
            text: 'No hay puntos de inicio y destino para limpiar.'
        });
    }
}


function mostrarMensaje(mensaje) {
    Swal.fire({
        icon: 'info',
        title: 'Aviso',
        text: mensaje,
    });
}

// Variables globales
var todosLosPuntos = new L.FeatureGroup();
var todasLasFiguras = L.layerGroup();
var capasExistentes = [];
var puntosCalientes = [];
var heatLayer;

document.getElementById('cargarArchivoBtn').addEventListener('click', function () {
    // Simular un clic en el elemento de entrada de archivos
    document.getElementById('fileInput').click();
});


// Función para procesar el GeoJSON
function procesarGeoJSON(contenidoArchivo) {
    console.log('Entrando en procesarGeoJSON');
    var nuevoGeoJSON;

    try {
        nuevoGeoJSON = JSON.parse(contenidoArchivo);
    } catch (error) {
        throw new Error("Error al parsear el JSON del archivo: " + error.message);
    }

    // Limpiar todos los puntos existentes
    todosLosPuntos.clearLayers();
    todasLasFiguras.clearLayers();
    puntosCalientes = [];

    // Verificar si hay un layer en el JSON y cambiar el layer del mapa si es necesario
    if (nuevoGeoJSON.features.length > 0 && nuevoGeoJSON.features[0].properties && nuevoGeoJSON.features[0].properties.layer) {
        cambiarLayerMapa(nuevoGeoJSON.features[0].properties.layer);
    }

    // Iterar sobre los features en el nuevo GeoJSON y agregar puntos, zonas calientes y otras figuras al mapa
    nuevoGeoJSON.features.forEach(function (feature) {
        try {
            // Verificar y procesar las coordenadas según el tipo de geometría
            if (feature.geometry.type === 'Point') {
                agregarPuntoAlMapa(feature);
            }  else if (feature.geometry.type === 'Circle') {
                agregarPuntoCalienteGeoJSON();
            }
            // Puedes agregar más bloques para otros tipos de figuras (Rectangle, Marker, etc.)
        } catch (error) {
            console.error('Error al procesar feature:', error.message);
            // Agrega el manejo de errores específico según tu caso
        }
    });

    // Agregar todos los puntos y zonas calientes al mapa
    map.addLayer(todosLosPuntos);
    map.addLayer(todasLasFiguras);

    // Verificar si hay puntos calientes para agregar la capa de calor
    if (puntosCalientes.length > 0) {
        if (heatLayer) {
            heatLayer.setLatLngs(puntosCalientes).addTo(map);
        } else {
            heatLayer = L.heatLayer(puntosCalientes, {
                radius: 25,
                minOpacity: 0.4,
                gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
            }).addTo(map);
        }
    }

    // Puedes también recalcular las rutas si es necesario
    calcularRuta();

    // Agregar las nuevas features al arreglo existente evitando duplicados
    nuevoGeoJSON.features.forEach(function (nuevaFeature) {
        if (!featureExistente(nuevaFeature)) {
            geojsonData.features.push(nuevaFeature);
        }
    });
}

// Función para verificar si una feature ya existe
function featureExistente(nuevaFeature) {
    return geojsonData.features.some(function (existente) {
        return existente.properties.nombre === nuevaFeature.properties.nombre;
    });
}

// Evento de cambio en el input de archivos
document.getElementById('fileInput').addEventListener('change', function () {
    console.log('Evento de cambio de archivo disparado');
    var fileInput = this;

    // Verificar si se seleccionó un archivo
    if (fileInput.files.length > 0) {
        // Limpiar el mapa antes de procesar el nuevo archivo
        limpiarMapa();

        var file = fileInput.files[0];
        var reader = new FileReader();

        // Escuchar el evento de carga del lector de archivos
        reader.onload = function (e) {
            try {
                var contenidoArchivo = e.target.result;
                procesarGeoJSON(contenidoArchivo);

                Swal.fire({
                    icon: 'success',
                    title: 'Archivo cargado con éxito',
                    text: 'El archivo se ha cargado y se ha actualizado el mapa.',
                });
                // Actualizar la información de la tabla de puntos
                mostrarInformacionDePuntos();

            } catch (error) {
                console.error("Error al procesar el archivo:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al cargar el archivo',
                    text: 'No se pudo procesar el archivo. Consulta la consola para obtener más detalles.',
                });
            }
        };

        // Leer el contenido del archivo como texto
        reader.readAsText(file);
    } else {
        Swal.fire({
            icon: 'info',
            title: 'Seleccione un archivo',
            text: 'Por favor, seleccione un archivo antes de hacer clic en "Cargar Archivo".',
        });
    }
});


function agregarPuntoAlMapa(feature) {
    // Verificar si las coordenadas están presentes y son válidas
    if (feature.geometry.coordinates && Array.isArray(feature.geometry.coordinates) && feature.geometry.coordinates.length === 2) {
        var latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);

        // Agregar puntos al mapa
        var marcador = L.marker(latlng, {
            icon: feature.properties.iconoUrl ? L.icon({
                iconUrl: feature.properties.iconoUrl,
                iconSize: [40, 40],
            }) : undefined,
            draggable: false,
        });

        marcador.bindPopup(`<b>${feature.properties.nombre}<br>${feature.properties.descripcion}`).openPopup();
        marcador.addTo(todosLosPuntos);

        // Agregar evento para editar el marcador
        marcador.on('click', function () {
            editarYEliminarMarcador(marcador);
        });

        // Agregar punto al GeoJSON global
        geojsonData.features.push(feature);
    }
}

document.addEventListener('DOMContentLoaded', function () {

    var heatLayer;
    var puntosCalientes = [];

    document.getElementById('agregarZonaCaliente').addEventListener('click', function () {
        mostrarInstruccionesAgregarZonaCaliente();
    });

    function mostrarInstruccionesAgregarZonaCaliente() {
        Swal.fire({
            title: 'Instrucciones para Zona de Calor',
            text: 'Haz clic en el mapa para definir la posición de la zona de calor.',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
        }).then(() => {
            // Cuando el usuario hace clic en OK, escucha el evento click en el mapa
            map.once('click', function (event) {
                mostrarDialogoAgregarZonaCaliente(event.latlng);
            });
        });
    }
    function mostrarDialogoAgregarZonaCaliente(latlng) {
        Swal.fire({
            title: 'Agregar Zona De Calor',
            html:
                '<input id="nombre" class="swal2-input" placeholder="Nombre de la zona">' +
                '<input id="descripcion" class="swal2-input" placeholder="Descripción de la zona">' +
                '<label for="intensidad">Intensidad:</label>' +
                '<select id="intensidad" class="swal2-select">' +
                '<option value="0.1">Baja</option>' +
                '<option value="0.5">Media</option>' +
                '<option value="1.0">Alta</option>' +
                '</select>',
            confirmButtonText: 'Agregar',
            showCancelButton: true,
            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#nombre').value;
                const descripcion = Swal.getPopup().querySelector('#descripcion').value;
                const intensidad = Swal.getPopup().querySelector('#intensidad').value;

                if (!nombre || !descripcion || !intensidad) {
                    Swal.showValidationMessage('Por favor, complete los campos de Nombre y Descripción de la zona.');
                }

                return { nombre, descripcion, intensidad: parseFloat(intensidad) };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                agregarZonaCaliente(latlng, result.value.nombre, result.value.descripcion, result.value.intensidad);
                Swal.fire('Éxito', 'Zona de Calor agregada correctamente.', 'success');
            }
        });
    }

    function agregarZonaCaliente(latlng, nombre, descripcion, intensidad) {
        const puntoCaliente = [latlng.lat, latlng.lng, intensidad];
        puntosCalientes.push(puntoCaliente);

        if (heatLayer) {
            heatLayer.setLatLngs(puntosCalientes).addTo(map);
        } else {
            heatLayer = L.heatLayer(puntosCalientes, {
                radius: 25,
                minOpacity: 0.4,
                gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
            }).addTo(map);
        }

        agregarPuntoCalienteGeoJSON(latlng, nombre, descripcion, intensidad);
    }
});

function agregarPuntoCalienteGeoJSON(latlng, nombre, descripcion, intensidad) {
    // Obtener el nivel de zoom actual del mapa
    var zoom = map.getZoom();
    // Verificar si la información del punto es válida
    if (latlng && nombre && descripcion) {
        var puntoFeature = {
            "type": "Feature",
            "properties": {
                "nombre": nombre,
                "descripcion": descripcion,
                "intensidad": intensidad,
                "zoom": zoom  // Nuevo: Agregar el nivel de zoom
            },
            "geometry": {
                "coordinates": [latlng.lng, latlng.lat],
                "type": "Circle"
            }
        };

        geojsonData.features.push(puntoFeature);
    } else {

    }
}

geoJson2heat = function (geojson) {
    return geojson.features
        .filter(function (feature) {
            // Filtrar solo los features de tipo "Circle"
            return feature.geometry.type === "Circle";
        })
        .map(function (feature) {
            return [parseFloat(feature.geometry.coordinates[1]), parseFloat(feature.geometry.coordinates[0])];
        });
};


document.getElementById("fileInput").addEventListener("change", function (evt) {
    var file = evt.target.files[0], // Read only first file.
        reader = new FileReader();

    reader.onload = function (e) {
        var fileText = e.target.result,
            fileData = JSON.parse(fileText);
        var geoData = geoJson2heat(fileData, 1);
        var heatMap = new L.heatLayer(geoData, {
            radius: 25,
            minOpacity: 0.4,
            gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
        }).addTo(map);
        // group = L.geoJSON(fileData).addTo(map);
        // map.fitBounds(heatMap.getBounds());
    }

    reader.readAsText(file);
});

// Define la función obtenerURLMapa con lógica personalizada para obtener el URL del mapa según el nombre de la capa
function obtenerURLMapa(estilo) {
    var url;

    // Lógica para asignar un URL según el nombre de la capa
    switch (estilo) {
        case 'estandar':
            return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        case 'satelite':
            return 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=oDAuktblFyxLjvuFK6EM';


        case 'transporte':
            return 'https://c.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391';

        case 'ciclista':
            return 'https://a.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391';


        // Agrega más casos según tus capas
        default:
            // Devuelve una URL predeterminada o maneja el estilo desconocido según tus necesidades
            return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

}

function cambiarLayerMapa(nuevoLayer) {
    // Define las URL de los layers según tus necesidades
    var urlEstandar = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var urlSatelite = 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=oDAuktblFyxLjvuFK6EM';
    var urlTransporte = 'https://c.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391';
    var urlCiclista = 'https://a.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391';


    // Agrega más URL según tus capas

    // Actualiza el estilo del mapa según el nuevoLayer
    if (nuevoLayer === 'estandar') {
        tileLayer.setUrl(urlEstandar);
    } else if (nuevoLayer === 'satelite') {
        tileLayer.setUrl(urlSatelite);
    } else if (nuevoLayer === 'transporte') {
        tileLayer.setUrl(urlTransporte);
    } else if (nuevoLayer === 'ciclista') {
        tileLayer.setUrl(urlCiclista);
    }

}

// Nueva función para actualizar el layer del punto según el estilo del mapa actual
function actualizarLayerPunto(puntoFeature) {
    // Obtén el estilo actual del mapa
    var selectedStyle = mapStyleSelect.value;

    // Actualiza el layer del punto según el estilo actual del mapa
    switch (selectedStyle) {
        case 'estandar':
            puntoFeature.properties.layer = 'estandar';
            break;
        case 'satelite':
            puntoFeature.properties.layer = 'satelite';
            break;
        case 'transporte':
            puntoFeature.properties.layer = 'transporte';
            break;
        case 'ciclista':
            puntoFeature.properties.layer = 'ciclista';
            break;
        default:
        // Maneja el caso por defecto si es necesario
    }
}

