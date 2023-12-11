let menuVisible = false;
//Función que oculta o muestra el menu
function mostrarOcultarMenu(){
    if(menuVisible){
        document.getElementById("nav").classList ="";
        menuVisible = false;
    }else{
        document.getElementById("nav").classList ="responsive";
        menuVisible = true;
    }
}

function seleccionar(){
    //oculto el menu una vez que selecciono una opcion
    document.getElementById("nav").classList = "";
    menuVisible = false;
}

function descargarZIP() {
    // Obtener el enlace de descarga
    var enlaceDescarga = document.getElementById('enlace-descarga');

    // Simular un clic en el enlace para iniciar la descarga
    if (enlaceDescarga) {
        enlaceDescarga.click();
    }
}