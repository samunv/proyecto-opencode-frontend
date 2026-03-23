/**
 * URL base para la búsqueda de libros en OpenLibrary
 * @type {string}
 */
export const URL_BUSQUEDA = 'https://openlibrary.org/search.json';

/**
 * URL base para las portadas. Formato: {base}/{tamaño}.jpg 
 * Usaremos ID de portada y tamaño mediano ('M')
 * @type {string}
 */
export const URL_PORTADAS = 'https://covers.openlibrary.org/b/id';

/**
 * Límite de resultados a mostrar en el DOM
 * @type {number}
 */
export const LIMITE_RESULTADOS = 20;

/**
 * URL de imagen por defecto si el libro no tiene portada
 * @type {string}
 */
export const PORTADA_POR_DEFECTO = 'https://via.placeholder.com/150x220?text=Sin+Portada';