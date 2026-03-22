import { URL_BUSQUEDA, LIMITE_RESULTADOS } from './config.js';
import { Libro } from './types.js';

export class ApiLibros {
    /**
     * Realiza la búsqueda de libros en OpenLibrary
     * @param {string} termino Texto a buscar
     * @returns {Promise<Libro[]>} Array de instancias de Libro
     */
    async buscar(termino) {
        try {
            const respuesta = await this._ejecutarFetch(termino);
            return this._procesarRespuesta(respuesta.docs);
        } catch (error) {
            console.error('Error en API:', error);
            throw new Error('Hubo un problema al contactar con la biblioteca');
        }
    }

    /**
     * Construye y ejecuta el fetch encapsulando la lógica pura de red
     * @param {string} termino Término a buscar
     * @returns {Promise<Object>} Promesa con JSON crudo
     */
    async _ejecutarFetch(termino) {
        const queryNormalizado = encodeURIComponent(termino);
        const urlFinal = `${URL_BUSQUEDA}?q=${queryNormalizado}&limit=${LIMITE_RESULTADOS}`;
        const respuesta = await fetch(urlFinal);
        
        if (!respuesta.ok) {
            throw new Error(`Fallo HTTP: ${respuesta.status}`);
        }
        
        return await respuesta.json();
    }

    /**
     * Convierte los resultados de la API a nuestro modelo
     * @param {Array} documentos Resultados devueltos por la API
     * @returns {Libro[]} Array formateado para nuestra UI
     */
    _procesarRespuesta(documentos) {
        if (!documentos || documentos.length === 0) {
            return [];
        }
        
        // Mapeamos los "documentos" crudos (docs) en nuestro formato limpio
        return documentos.map(datosBrutos => new Libro(datosBrutos));
    }
}