import { ApiLibros } from './api.js';
import { InterfazUsuario } from './ui.js';
import { inicializarCarrusel } from './swiper-init.js';

class BuscadorApp {
    constructor() {
        this.api = new ApiLibros();
        this.ui = new InterfazUsuario();
        this.formulario = document.getElementById('formulario-busqueda');
        this.inputBusqueda = document.getElementById('input-busqueda');

        // Bindeamos el contexto de 'this' para el listener
        this._manejarSubmit = this._manejarSubmit.bind(this);
    }

    /** Inicializa los event listeners principales */
    iniciar() {
        this.formulario.addEventListener('submit', this._manejarSubmit);
    }

    /**
     * Orquestador de la búsqueda (Manejador del submit)
     * @param {Event} eventoSubmit
     */
    async _manejarSubmit(eventoSubmit) {
        eventoSubmit.preventDefault();
        
        const terminoBusqueda = this.inputBusqueda.value.trim();
        
        if (!this._validarEntrada(terminoBusqueda)) return;

        await this._ejecutarBusqueda(terminoBusqueda);
    }

    /**
     * Valida que el término de búsqueda no esté vacío
     * @param {string} termino
     * @returns {boolean}
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
     * @param {string} termino
     */
    async _ejecutarBusqueda(termino) {
        // 1. Preparar UI
        this.ui.limpiarResultados();
        this.ui.mostrarCargador();

        try {
            // 2. Fetch datos (solo a través de API)
            const librosEncontrados = await this.api.buscar(termino);
            
            // 3. Renderizar resultados (solo a través de UI)
            this.ui.renderizarLibros(librosEncontrados);
        } catch (errorAPI) {
            // 4. Manejo de errores
            this.ui.mostrarMensaje(errorAPI.message, true);
        } finally {
            // 5. Ocultar estado de carga (Obligatorio)
            this.ui.ocultarCargador();
        }
    }
}

// Punto de entrada de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrusel();
    const app = new BuscadorApp();
    app.iniciar();
});