import { ApiLibros } from './api.js';
import { InterfazUsuario } from './ui.js';
import { Carrusel } from './swiper-init.js';

/**
 * Clase principal que orquesta la aplicación
 */
class BuscadorApp {
    /**
     * Inicializa las dependencias y elementos del DOM
     */
    constructor() {
        this.api = new ApiLibros();
        this.ui = new InterfazUsuario();
        this.formulario = document.getElementById('formulario-busqueda');
        this.inputBusqueda = document.getElementById('input-busqueda');

        // Bindeamos el contexto de 'this' para el listener
        this._manejarSubmit = this._manejarSubmit.bind(this);
    }

    /**
     * Inicializa los event listeners principales
     */
    iniciar() {
        this.formulario.addEventListener('submit', this._manejarSubmit);
    }

    /**
     * Orquestador de la búsqueda (Manejador del submit)
     * @param {Event} eventoSubmit Evento del formulario
     */
    async _manejarSubmit(eventoSubmit) {
        eventoSubmit.preventDefault();
        
        const terminoBusqueda = this.inputBusqueda.value.trim();
        
        if (!this._validarEntrada(terminoBusqueda)) return;

        await this._ejecutarBusqueda(terminoBusqueda);
    }

    /**
     * Valida que el término de búsqueda no esté vacío
     * @param {string} termino Texto a validar
     * @returns {boolean} Verdadero si es válido
     */
    _validarEntrada(termino) {
        if (!termino) {
            this.ui.mostrarMensaje('Por favor, escribe el nombre de un libro o autor.', true);
            return false;
        }
        return true;
    }

    /**
     * Flujo central de la aplicación (Orquestador API <-> UI)
     * @param {string} termino Texto a buscar
     */
    async _ejecutarBusqueda(termino) {
        this._prepararBusqueda();
        try {
            const libros = await this.api.buscar(termino);
            this.ui.renderizarLibros(libros);
        } catch (error) {
            this.ui.mostrarMensaje(error.message, true);
        } finally {
            this.ui.ocultarCargador();
        }
    }

    /**
     * Prepara la interfaz para una nueva búsqueda
     */
    _prepararBusqueda() {
        this.ui.limpiarResultados();
        this.ui.mostrarCargador();
    }
}

/**
 * Punto de entrada de la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
    const carrusel = new Carrusel();
    carrusel.inicializar();
    const app = new BuscadorApp();
    app.iniciar();
});