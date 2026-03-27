import { InterfazUsuario } from './ui.js';

/**
 * Clase encargada de gestionar los libros favoritos del usuario
 * Utiliza localStorage para persistencia de datos
 */
export class GestorFavoritos {
    /**
     * Clave utilizada en localStorage
     * @type {string}
     */
    static CLAVE_STORAGE = 'libros_favoritos';

    /**
     * Inicializa el gestor y carga los favoritos existentes
     */
    constructor() {
        this.favoritos = this._cargarFavoritos();
    }

    /**
     * Añade o elimina un libro de favoritos (toggle)
     * @param {Object} libro Datos del libro
     * @returns {boolean} true si se añadió, false si se eliminó
     */
    alternar(libro) {
        const indice = this._buscarIndice(libro.titulo);

        if (indice !== -1) {
            this.favoritos.splice(indice, 1);
            this._guardar();
            return false;
        }

        this.favoritos.push({
            titulo: libro.titulo,
            autor: libro.autor,
            anioPublicacion: libro.anioPublicacion,
            urlPortada: libro.urlPortada,
            fechaAgregado: new Date().toISOString()
        });
        this._guardar();
        return true;
    }

    /**
     * Comprueba si un libro está en favoritos
     * @param {string} titulo Título del libro
     * @returns {boolean} Verdadero si está en favoritos
     */
    esFavorito(titulo) {
        return this._buscarIndice(titulo) !== -1;
    }

    /**
     * Obtiene todos los libros favoritos
     * @returns {Array} Lista de favoritos
     */
    obtenerTodos() {
        return [...this.favoritos];
    }

    /**
     * Obtiene el número total de favoritos
     * @returns {number} Cantidad de favoritos
     */
    obtenerCantidad() {
        return this.favoritos.length;
    }

    /**
     * Busca el índice de un libro por título
     * @param {string} titulo Título a buscar
     * @returns {number} Índice o -1 si no existe
     */
    _buscarIndice(titulo) {
        return this.favoritos.findIndex(fav => fav.titulo === titulo);
    }

    /**
     * Carga los favoritos desde localStorage
     * @returns {Array} Array de favoritos o vacío
     */
    _cargarFavoritos() {
        try {
            const datos = localStorage.getItem(GestorFavoritos.CLAVE_STORAGE);
            return datos ? JSON.parse(datos) : [];
        } catch (error) {
            console.error('Error al cargar favoritos:', error);
            return [];
        }
    }

    /**
     * Guarda los favoritos en localStorage
     */
    _guardar() {
        try {
            const datos = JSON.stringify(this.favoritos);
            localStorage.setItem(GestorFavoritos.CLAVE_STORAGE, datos);
        } catch (error) {
            console.error('Error al guardar favoritos:', error);
        }
    }
}
