import { URL_PORTADAS, PORTADA_POR_DEFECTO } from './config.js';

/**
 * Clase Libro: Responsable de normalizar los datos "sucios"
 * provenientes de la API de OpenLibrary hacia un formato limpio
 * y manejable en español.
 */
export class Libro {
    constructor(datosBrutos) {
        // Extraemos solo lo que necesitamos usando valores por defecto
        this.titulo = datosBrutos.title || 'Título desconocido';
        
        // El autor suele venir en un array, lo convertimos a string
        this.autor = this._formatearAutores(datosBrutos.author_name);
        
        // Año de la primera publicación
        this.anioPublicacion = datosBrutos.first_publish_year || 'Año desconocido';
        
        // Generamos la URL de la portada si tenemos el ID (cover_i)
        this.urlPortada = this._obtenerUrlPortada(datosBrutos.cover_i);
    }

    /**
     * Une el array de autores en un solo string
     * @param {Array|undefined} autores 
     * @returns {string} Autores unidos por coma
     */
    _formatearAutores(autores) {
        if (!autores || !Array.isArray(autores) || autores.length === 0) {
            return 'Autor desconocido';
        }
        return autores.join(', ');
    }

    /**
     * Construye la URL de la portada basada en el ID
     * @param {number|undefined} idPortada 
     * @returns {string} URL de la imagen
     */
    _obtenerUrlPortada(idPortada) {
        if (!idPortada) {
            return PORTADA_POR_DEFECTO;
        }
        return `${URL_PORTADAS}/${idPortada}-M.jpg`;
    }
}