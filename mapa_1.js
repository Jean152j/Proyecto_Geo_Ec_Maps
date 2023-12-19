//Se inicializa el mapa escogiendo coordenadas y nivel de zoom, mientras mayoor sea el número más zoom se le da 

let map = L.map('mapa_general', {
    zoomControl: false, // Desactiva el control de zoom predeterminado
}).setView([-1.009, -78.497], 6);
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


// Variable global para almacenar el valor del layer
var mapaLayer;

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
    Swal.fire({
        denyButtonColor: '#1D8348',
        title: 'Selecciona una opción',
        showCancelButton: true,
        confirmButtonText: 'Agregar Punto',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            mostrarFormularioAgregarPunto(latlng);
        } 
    });
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


var puntoFeature;  // Declarar puntoFeature en un alcance más amplio
var puntosAgregados = [];  // Array para almacenar los puntos


function agregarPuntoGeoJSON(latlng, nombre, descripcion, iconoUrl, imagenes, marcador) {
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
            '</select>' + '<br>' +
            '<label>Imágenes Actuales:</label>' + '<br>' +
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


//Texto de los botones figuras
L.drawLocal.draw.toolbar.buttons.polyline = 'Dibujar Línea';
L.drawLocal.draw.toolbar.buttons.polygon = 'Dibujar Polígono';
L.drawLocal.draw.toolbar.buttons.rectangle = 'Dibujar Rectángulo';
L.drawLocal.draw.toolbar.buttons.circle = 'Dibujar Círculo';


// Texto Inicial de información de figuras 
//Línea
L.drawLocal.draw.handlers.polyline.tooltip.start = 'Haga Clic Para Comenzar A Dibujar La Línea';
L.drawLocal.draw.handlers.polyline.tooltip.cont = 'Haga Clic Para Continuar Dibujando La Línea';
L.drawLocal.draw.handlers.polyline.tooltip.end = 'Haga Clic Para En El Último Punto Para Finalizar La Línea';
L.drawLocal.draw.handlers.polyline.error = '<strong>Error:</strong> Las Líneas No Se Pueden Cruzar!';

//Figura - Polígono 
L.drawLocal.draw.handlers.polygon.tooltip.start = 'Haga Clic Para Comenzar A Dibujar La Forma';
L.drawLocal.draw.handlers.polygon.tooltip.cont = 'Haga Clic Para Continuar Dibujando La Forma';
L.drawLocal.draw.handlers.polygon.tooltip.end = 'Haga Clic En El Primer Punto Para Cerrar La Forma';

//Rectángulo
L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Haga Clic y Arrastre Para Dibujar El Rectángulo';

//Círculo
L.drawLocal.draw.handlers.circle.tooltip.start = 'Haga Clic y Arrastre Para Dibujar El Círculo';
L.drawLocal.draw.handlers.circle.radius = 'Radio';

//Forma Simple
L.drawLocal.draw.handlers.simpleshape.tooltip.end = 'Suelta El Clic Para Terminar El Dibujo';

//Texto Acciones de Figuras
L.drawLocal.draw.toolbar.actions.title = 'Cancelar Dibujo';
L.drawLocal.draw.toolbar.actions.text = 'Cancelar';
L.drawLocal.draw.toolbar.finish.title = 'Finalizar Dibujo';
L.drawLocal.draw.toolbar.finish.text = 'Finalizar';
L.drawLocal.draw.toolbar.undo.title = 'Eliminar último Punto Dibujado';
L.drawLocal.draw.toolbar.undo.text = 'Eliminar Último Punto';

//Texto Opcion Editar Capas
//Guardar
L.drawLocal.edit.toolbar.actions.save.title = 'Guardar Cambios';
L.drawLocal.edit.toolbar.actions.save.text = 'Guardar';

//Cancelar
L.drawLocal.edit.toolbar.actions.cancel.title = 'Descarta Todos Los Cambios.';
L.drawLocal.edit.toolbar.actions.cancel.text = 'Cancelar';

//Limpiar 
L.drawLocal.edit.toolbar.actions.clearAll.title = 'Limpiar Todo';
L.drawLocal.edit.toolbar.actions.clearAll.text = 'Limpiar Figuras';

//Botontes Editar Eliminar
L.drawLocal.edit.toolbar.buttons.edit = 'Editar Figuras';
L.drawLocal.edit.toolbar.buttons.editDisabled = 'No Hay Figuras Que Editar';
L.drawLocal.edit.toolbar.buttons.remove = 'Eliminar Figuras';
L.drawLocal.edit.toolbar.buttons.removeDisabled = 'No Hay Figuras Que Eliminar';

//Texto de Información Editar - Eliminar
L.drawLocal.edit.handlers.edit.tooltip.text = 'Arrastre Controladores O Marcadores Para Editar';
L.drawLocal.edit.handlers.edit.tooltip.subtext = 'Haga Clic En Cancelar Para Deshacer Los Cambios';
L.drawLocal.edit.handlers.remove.tooltip.text = 'Haga Clic En Una Figura Para Eliminarla';


// Dibujar en el mapa 

function agregarFiguras() {
    // Verificar si el control ya se ha agregado al mapa
    if (!drawControl) {
        drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems,
                edit: false,  // Desactivar la opción de edición
                remove: false   // Mantener la opción de eliminación
            },
            draw: {
                polyline: true,
                polygon: true,
                rectangle: true,
                circle: false,
                circlemarker: false,
                marker: false,
            }
        });

        drawControl.addTo(map);


        map.once('draw:created', async function (e) {
            var type = e.layerType;
            var layer = e.layer;

            try {
                // Preguntar al usuario por el nombre de la figura
                const nombre = await pedirNombreFigura();

                // Aquí agregamos la figura al GeoJSON
                agregarFiguraGeoJSON(layer, nombre);

                drawnItems.addLayer(layer);
                dibujando = false; // Restablecer el estado de dibujo
            } catch (error) {
                console.log('Operación cancelada:', error.message);
                dibujando = false; // Restablecer el estado de dibujo si se cancela
            } finally {
                map.removeControl(drawControl); // Remover el control después de la creación o cancelación
                drawControl = null; // Establecer drawControl a null
            }
        });
    }

    map.on('draw:drawstart', function () {
        dibujando = true; // Establecer el estado de dibujo al inicio del dibujo
    });

    map.on('draw:drawstop', function () {
        dibujando = false; // Restablecer el estado de dibujo al final del dibujo
    });

    map.on('draw:editstart', function () {
        dibujando = true; // Establecer el estado de dibujo al inicio del dibujo
    });

    map.on('draw:editstop', function () {
        dibujando = false; // Restablecer el estado de dibujo al final del dibujo
    });

    map.on('draw:deletestart', function () {
        dibujando = true; // Establecer el estado de dibujo al inicio del dibujo
    });

    map.on('draw:deletestop', function () {
        dibujando = false; // Restablecer el estado de dibujo al final del dibujo
    });


    map.on('mousedown', function (e) {
        if (drawControl && drawControl._toolbars.draw._activeMode) {
            e.originalEvent.preventDefault();
        }
    });

    // Evento para mostrar el formulario de edición al hacer clic en una figura
    map.on('click', function (event) {
        // Obtener las capas que están en el punto donde se hizo clic
        var latlng = event.latlng;

        // Obtener todas las capas en el grupo drawnItems
        const figuraLayers = drawnItems.getLayers();

        // Iterar sobre las capas de figuras
        figuraLayers.forEach(figuraLayer => {
            // Verificar si el clic está dentro de la figura
            if (figuraLayer.getBounds().contains(latlng)) {
                // Mostrar el cuadro de diálogo con los botones de editar, eliminar y cancelar
                mostrarDialogoFiguras(figuraLayer);
            }
        });
    });

    // Escuchar eventos de edición en el grupo de figuras (drawnItems)
    drawnItems.on('edit', function (event) {
        // Obtener la capa que fue editada
        const capaEditada = event.layers.first();

        // Actualizar el JSON después de la edición
        actualizarJson(capaEditada);
    });
}


function pedirNombreFigura() {
    return Swal.fire({
        title: 'Agregar Figura',
        text: 'Ingrese un nombre para la figura:',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Debe ingresar un nombre';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            return result.value;
        } else {
            throw new Error('Operación cancelada');
        }
    });
}


function mostrarDialogoFiguras(figuraLayer) {
    // Utilizar SweetAlert2 para mostrar el cuadro de diálogo
    Swal.fire({
        title: 'Opciones de Figura',
        showCancelButton: true,
        confirmButtonText: 'Editar',
        cancelButtonText: 'Cancelar',
        showDenyButton: true,
        denyButtonText: 'Eliminar',
    }).then((result) => {
        if (result.isConfirmed) {
            editarFigura(figuraLayer);
        } else if (result.isDenied) {
            eliminarFigura(figuraLayer);
        }
    });
}

// Función para editar la figura
function editarFigura(figuraLayer) {
    // Cerrar el cuadro de diálogo
    Swal.close();

    // Mostrar el formulario de edición
    mostrarFormularioEdicionInterno(figuraLayer);
}


function mostrarFormularioEdicionInterno(figuraLayer) {
    // Generar un identificador único para el modal
    const modalId = `modal-${Date.now()}`;

    // Crear el modal con SweetAlert2
    const modal = Swal.fire({
        html: `
            <div>
                <label for="${modalId}-colorBorde">Color de Borde:</label>
                <input type="color" id="${modalId}-colorBorde" value="${figuraLayer.options.color}">
            </div>
            <div>
                <label for="${modalId}-colorRelleno">Color de Relleno:</label>
                <input type="color" id="${modalId}-colorRelleno" value="${figuraLayer.options.fillColor}">
            </div>
        `,
        showCancelButton: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Obtener los valores de los input de color
            const nuevoColorBorde = document.getElementById(`${modalId}-colorBorde`).value;
            const nuevoColorRelleno = document.getElementById(`${modalId}-colorRelleno`).value;

            // Aplicar los cambios de color a la figura
            figuraLayer.setStyle({
                color: nuevoColorBorde,
                fillColor: nuevoColorRelleno,
            });

            // Actualizar el JSON después de cambiar el color
            actualizarJson(figuraLayer);
        }
    });
}


function agregarFiguraGeoJSON(figuraLayer, nombre) {
    // Verificar si la capa de figura y el nombre son válidos
    if (!figuraLayer || !nombre) {
        throw new Error("La figuraLayer y el nombre son obligatorios para agregar una figura GeoJSON.");
    }

    const geometry = obtenerCoordenadas(figuraLayer);
    if (geometry) {
        const figuraFeature = {
            "type": "Feature",
            "properties": {
                "nombre": nombre,
                "colorBorde": figuraLayer.options.color || "#000000",
                "colorRelleno": figuraLayer.options.fillColor || "#FFFFFF",

            },
            "geometry": {
                "coordinates": obtenerCoordenadas(figuraLayer),
                "type": obtenerTipoGeometry(figuraLayer)
            }
        };

        geojsonData.features.push(figuraFeature);
        figuraLayer.options.nombre = nombre;
    } else {
        // Manejar caso cuando el tipo de figura no es reconocido
    }
}


function obtenerCoordenadas(figuraLayer) {
    if (figuraLayer instanceof L.Polyline || figuraLayer instanceof L.Polygon) {
        // Polilínea o polígono
        const latLngs = figuraLayer.getLatLngs();
        if (latLngs.length > 0) {
            let geometryType = "LineString"; // Por defecto, asumimos que es una polilínea

            if (latLngs[0] instanceof L.LatLng) {
                // Caso de polilínea
                geometryType = "LineString";

                return latLngs.map(latlng => [latlng.lng, latlng.lat]);

            } else if (latLngs[0] instanceof Array && latLngs[0].length > 0 && latLngs[0][0] instanceof L.LatLng) {
                // Caso de polígono
                geometryType = "Polygon";

                const polygonCoordinates = latLngs[0].map(latlng => [latlng.lng, latlng.lat]);
                polygonCoordinates.push(polygonCoordinates[0]); // Agregamos la primera coordenada al final para cerrar el polígono
                return polygonCoordinates;
            }

        }
    } else if (figuraLayer instanceof L.Rectangle) {
        // Rectángulo
        const bounds = figuraLayer.getBounds();
        const esquinaNE = bounds.getNorthEast();
        const esquinaSW = bounds.getSouthWest();

        const rectangleCoordinates = [
            [
                [esquinaNE.lng, esquinaNE.lat],
                [esquinaNE.lng, esquinaSW.lat],
                [esquinaSW.lng, esquinaSW.lat],
                [esquinaSW.lng, esquinaNE.lat],
                [esquinaNE.lng, esquinaNE.lat]
            ]
        ];

        return rectangleCoordinates;

    } else {
        // Manejar caso cuando el tipo de figura no es reconocido
        return null;
    }
}


function obtenerTipoGeometry(figuraLayer) {
    // Implementa lógica para obtener el tipo de geometry según el tipo de figura
   
    if (figuraLayer instanceof L.Polyline) {
        return "LineString";
    } else if (figuraLayer instanceof L.Polygon) {
        return "Polygon";
    } else if (figuraLayer instanceof L.Rectangle) {
        return "Polygon"; 
    } else {
        // Manejar caso cuando el tipo de figura no es reconocido
        return "desconocido";
    }
}

function actualizarJson(figuraLayer) {
    // Buscar y actualizar el objeto correspondiente en el JSON
    const figuraJson = geojsonData.features.find(feature => feature.properties.nombre === figuraLayer.options.nombre);
    if (figuraJson) {
        figuraJson.properties.colorBorde = figuraLayer.options.color;
        figuraJson.properties.colorRelleno = figuraLayer.options.fillColor;
    }

}

// Función para eliminar la figura
function eliminarFigura(figuraLayer) {
    Swal.fire({
        title: 'Eliminar Figura',
        text: '¿Desea Eliminar La Figura?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Elimina el marcador del mapa
            drawnItems.removeLayer(figuraLayer);

            // Elimina el punto del GeoJSON
            eliminarFiguraGeoJSON(figuraLayer);

            Swal.fire('Figura eliminada', '', 'success');
        }
    });
}

function eliminarFiguraGeoJSON(figuraLayer) {

    // Verificar si la capa tiene un nombre en sus propiedades
    const nombreFigura = figuraLayer.options.nombre;
    if (!nombreFigura) {
        console.error('Nombre de la figura no encontrado:', figuraLayer.feature.properties);
        return;
    }

    // Buscar y eliminar la figura en el JSON según el nombre de la capa
    const indiceFigura = geojsonData.features.findIndex(feature => feature.properties.nombre === nombreFigura);

    if (indiceFigura !== -1) {
        // Eliminar la figura del array de features
        geojsonData.features.splice(indiceFigura, 1);

        // Eliminar la capa del mapa solo si figuraLayer es válida y está en el mapa
        if (map && map.hasLayer(figuraLayer)) {
            map.removeLayer(figuraLayer);
        } else {

        }
    } else {
        console.error('No se pudo encontrar la figura en el GeoJSON:', nombreFigura);
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
    // Verificar si no hay puntos 
    if (puntos.getLayers().length === 0) {
        mostrarMensaje('Nada que limpiar. No hay puntos en el mapa.');
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
    if (puntos.getLayers().length === 0 && todosLosPuntos.getLayers().length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Nada que limpiar',
            text: 'No hay puntos, ni figuras agregadas en el mapa.'
        });

        // Llama a la función para limpiar la tabla de información de puntos
        limpiarTablaInformacion();

        return;
    }

    // Elimina todos los puntos del mapa
    todosLosPuntos.clearLayers();


    // Limpia el arreglo de puntos del GeoJSON
    geojsonData.features = [];

    // Llamada a la función para cargar el estado inicial
    cargarEstadoInicial();

    Swal.fire({
        icon: 'success',
        title: 'Mapa limpiado',
        text: 'Los puntos y figuras han sido limpiados del mapa y se descargó el GeoJSON.'
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

    // Agrega las capas de puntos al mapa nuevamente
    todosLosPuntos.addTo(map);
   
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

    // Verificar si hay un layer en el JSON y cambiar el layer del mapa si es necesario
    if (nuevoGeoJSON.features.length > 0 && nuevoGeoJSON.features[0].properties && nuevoGeoJSON.features[0].properties.layer) {
        cambiarLayerMapa(nuevoGeoJSON.features[0].properties.layer);
    }

    // Iterar sobre los features en el nuevo GeoJSON y agregar puntos y otras figuras al mapa
    nuevoGeoJSON.features.forEach(function (feature) {
        try {
            // Verificar y procesar las coordenadas según el tipo de geometría
            if (feature.geometry.type === 'Point') {
                agregarPuntoAlMapa(feature);
            } else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'Polygon') {
                agregarPolilineaOPolygonAlMapa(feature);
            } 
            
        } catch (error) {
            console.error('Error al procesar feature:', error.message);
           
        }
    });

    // Agregar todos los puntos  calientes al mapa
    map.addLayer(todosLosPuntos);
    map.addLayer(todasLasFiguras);

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


function habilitarEdicionEnFigura(figura) {
    // Agregar evento de clic para editar o eliminar la figura
    figura.on('click', function (event) {
        // Habilitar edición para la figura
        figura.editing.enable();

        // Puedes agregar eventos adicionales o lógica según tus necesidades
        figura.on('editable:editing', function () {
            console.log('Editando figura...');
        });

        figura.on('editable:drawing:commit', function () {
            console.log('Edición completada.');
        });

        figura.on('editable:vertex:click', function (e) {
            // Acciones cuando se hace clic en un vértice de la figura (opcional)
        });

        figura.on('editable:delete', function () {
            // Acciones al eliminar la figura
            console.log('Figura eliminada.');
            todasLasFiguras.removeLayer(figura);
        });
    });
}

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

function agregarPolilineaOPolygonAlMapa(feature) {
    console.log('Entrando en agregarPolilineaOPolygonAlMapa:', feature);

    // Verificar si las coordenadas están presentes y son válidas
    if (
        feature.geometry.coordinates &&
        Array.isArray(feature.geometry.coordinates)
    ) {
        // Obtener las coordenadas directamente
        const coords = feature.geometry.coordinates.map(coord => {
            if (Array.isArray(coord) && coord.length === 2) {
                return [coord[1], coord[0]];
            }
            return null;
        });

        // Filtrar coordenadas que no sean válidas
        const validCoords = coords.filter(coord => coord !== null);

        // Verificar si hay coordenadas válidas
        if (validCoords.length > 0) {
            try {

                // Verificar el tipo de figura y agregar al mapa
                if (feature.geometry.type === 'LineString') {
                    console.log('Agregando polilínea al mapa:', validCoords);

                    // Agregar polilínea
                    var polyline = L.polyline(validCoords, {
                        color: feature.properties.colorBorde || 'red',
                        weight: feature.properties.anchoBorde || 3,
                        
                    }).addTo(todasLasFiguras);

                    // Puedes agregar eventos u otras configuraciones específicas para polilíneas
                } else if (feature.geometry.type === 'Polygon') {
                    console.log('Agregando polígono al mapa:', validCoords);
                    // Agregar polígono
                    var polygon = L.polygon(validCoords, {
                        color: feature.properties.colorBorde || 'blue',
                        fillColor: feature.properties.colorRelleno || 'lightblue',
                        weight: feature.properties.anchoBorde || 3,
                       
                    }).addTo(todasLasFiguras);

                }

            } catch (error) {
                console.error('Error al agregar figura al mapa:', error);
            }

        } else {
            console.warn('Coordenadas filtradas, ninguna válida en el feature:', feature);
        }
    } else {
        console.warn('Coordenadas no válidas en el feature:', feature);
    }
}

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

