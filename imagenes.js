function insertarImagen() {
    const input = document.getElementById('imageInput');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imageData = {
                base64: e.target.result,
            };

            // Guardar la imagen en el almacenamiento local como JSON
            localStorage.setItem('imagen', JSON.stringify(imageData));

            // Mostrar la imagen
            mostrarImagen(imageData.base64);
        };

        reader.readAsDataURL(file);
    }
}

function mostrarImagen(base64) {
    const imagen = document.getElementById('imagen');
    imagen.src = base64;
}

function descargarJSON() {
    const imageData = localStorage.getItem('imagen');

    if (imageData) {
        const blob = new Blob([imageData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'imagen.json';
        a.click();

        URL.revokeObjectURL(url);
    }
}

function cargarJSON() {
    const input = document.getElementById('imageInput');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.click();

    fileInput.addEventListener('change', function () {
        const fileReader = new FileReader();
        const file = fileInput.files[0];

        fileReader.onload = function (e) {
            const imageData = JSON.parse(e.target.result);

            // Guardar la imagen en el almacenamiento local como JSON
            localStorage.setItem('imagen', JSON.stringify(imageData));

            // Mostrar la imagen
            mostrarImagen(imageData.base64);
        };

        fileReader.readAsText(file);
    });
}
