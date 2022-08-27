/**
 * Este archivo de JavaScript es parte de la extensión «Cronox».
 *
 * @author      Ulises Francisco Alejandre Navarro
 * @since       2022-08-26
 * @license     MPL 2.0
 *
 * Este codigo fuente está sujeto a los términos de la Licencia Pública
 * de Mozilla, v. 2.0. Si una copia de la licencia no fue distribuída con
 * este archivo, la puede encontrar en http://mozilla.org/MPL/2.0/.
 */

'use strict';

// Definiendo el tipo de navegador
if (typeof browser === "undefined") {
    var browser = chrome;
} else {
    var browser = browser || chrome
}

localizarPagHtml();

var corriendo = false;
var iniciado = false;
var tiempo = 0; // en centésimas de segundo
var reloj = 0; // Variable que contine el timer que se actualiza cada 10 ms

// Localizar el reloj de la aplicación
var cronometro = document.getElementById("reloj");

/**
 * Asignarle a cada botón la función indicada
 */ 
document.getElementById("b_iniciar").addEventListener("click", iniciarCrono);
document.getElementById("b_pausar").addEventListener("click", pausarCrono);
document.getElementById("b_continuar").addEventListener("click", continuarCrono);
document.getElementById("b_reiniciar").addEventListener("click", reiniciarCrono);
    	
// Funciones para el funcionamiento del cronómetro
/**
 * Modifica el contador del cronómetro a partir del tiempo transcurrido.
 */
function calcularTiempo() {
    tiempo++;

    let mins = Math.floor(tiempo/6000);
    let resMin = tiempo - mins*6000;
    let seg = Math.floor(resMin/100);
    let cs = Math.floor((resMin - seg*100));
    
    // Siempre poner los numeros con dos dígitos
    if(cs < 10) {cs = "0" + cs;}
    if(seg < 10) {seg = "0" + seg;}
    if(mins < 10) {mins = "0" + mins;}

    cronometro.textContent = mins + ":" + seg + ":" + cs;
    // cronometro.innerHTML = mins + ":" + seg + ":" + cs;
}

/**
 * Empieza la cuenta del cronómetro.
 */
function iniciarCrono() {
    if (!corriendo && !iniciado) {
        corriendo = true;
        iniciado = true;
        reloj = setInterval(calcularTiempo, 10)
    }
}

/**
 * Pausa la cuenta del cronómetro.
 */
function pausarCrono() {
    if(corriendo) {
        corriendo = false;
        clearInterval(reloj);
    }

}

/**
 * Continúa con la cuenta pausada del cronómetro.
 */
function continuarCrono() {
    if (iniciado) {
        iniciado = false;
        iniciarCrono();
    }
}

/**
 * Regresa la cuenta del cronómetro a 0.
 */
function reiniciarCrono() {
    if (iniciado){
        if (corriendo) {
            corriendo = false;
            clearInterval(reloj);
        }
        tiempo = 0;
        iniciado = false;
        cronometro.innerHTML = "00:00:00"
    }
}

// Funciones para la localización de la extensión
/**
 * Busca los elementos HTML localizables y pone el mensaje correspondiente en su lugar
 */    
function localizarPagHtml() {
    // Localizar usando los tags __MSG_***__ de data-localize
    // Juntar todos los elementos html con el tag data-localize
    var elementos = document.querySelectorAll('[data-localize]');
    
    // Reemplazar el texto por defecto con los mensajes correspondientes
    // a la localización
    for (var i in elementos){ 
        // verificar que se tenga la propiedad data-localize
        if (elementos.hasOwnProperty(i)) {
            let elem = elementos[i];
            let tag = elem.getAttribute('data-localize').toString();
    
            reemplazar(elem, tag);
        }
    }
}

// Funciones para la localización de la extensión
/**
 * Reemplaza los tags __MSG_***__ con el mensaje de localización correspondiente
 * @param {*} objeto: elemento html que se quiere localizar
 * @param {*} tag: contenido del tag data-localize de cada objeto html anterior
 */
 function reemplazar(objeto, tag) {
    // Reemplazar los tags con MSG
    var mensaje = tag.replace(/__MSG_(\w+)__/g, function(match, v1) {
        return v1 ? browser.i18n.getMessage(v1) : '';
    });
        
    // Reemplazar el contenido del tag con el mensaje del json correspondiente
    if(mensaje != tag) {
        objeto.textContent = mensaje;
        // objeto.innerHTML = mensaje;
    }
}

