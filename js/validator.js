/**
 * Clase encargada de validar las entradas del usuario
 * Centraliza toda la lógica de validación del formulario
 */
export class Validador {
    /**
     * Longitud mínima permitida para búsquedas
     * @type {number}
     */
    static LONGITUD_MINIMA = 2;

    /**
     * Longitud máxima permitida para búsquedas
     * @type {number}
     */
    static LONGITUD_MAXIMA = 100;

    /**
     * Patrón para detectar caracteres potencialmente peligrosos
     * @type {RegExp}
     */
    static PATRON_PELIGROSO = /[<>{}()\\\/;`$]/g;

    /**
     * Valida y sanitiza el término de búsqueda
     * @param {string} termino Texto introducido por el usuario
     * @returns {Object} Resultado con { valido: boolean, mensaje: string, terminoLimpio: string }
     */
    validarBusqueda(termino) {
        if (!termino || termino.trim().length === 0) {
            return this._resultado(false, 'Por favor, escribe el nombre de un libro o autor.');
        }

        const terminoLimpio = this._sanitizar(termino);

        if (terminoLimpio.length < Validador.LONGITUD_MINIMA) {
            return this._resultado(false, `La búsqueda debe tener al menos ${Validador.LONGITUD_MINIMA} caracteres.`);
        }

        if (terminoLimpio.length > Validador.LONGITUD_MAXIMA) {
            return this._resultado(false, `La búsqueda no puede exceder ${Validador.LONGITUD_MAXIMA} caracteres.`);
        }

        return this._resultado(true, '', terminoLimpio);
    }

    /**
     * Elimina caracteres potencialmente peligrosos del input
     * @param {string} texto Texto a sanitizar
     * @returns {string} Texto limpio
     */
    _sanitizar(texto) {
        return texto
            .trim()
            .replace(Validador.PATRON_PELIGROSO, '')
            .replace(/\s+/g, ' ');
    }

    /**
     * Construye el objeto de resultado de validación
     * @param {boolean} valido Si la validación pasó
     * @param {string} mensaje Mensaje de error o vacío
     * @param {string} terminoLimpio Texto sanitizado
     * @returns {Object} Resultado de la validación
     */
    _resultado(valido, mensaje, terminoLimpio = '') {
        return { valido, mensaje, terminoLimpio };
    }
}
