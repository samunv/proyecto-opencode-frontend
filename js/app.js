import { ApiLibros } from './api.js';
import { InterfazUsuario } from './ui.js';
import { Carrusel } from './swiper-init.js';
import { GestorFavoritos } from './favorites.js';
import { ControladorPeticiones } from './ratelimit.js';
import { Metricas } from './metrics.js';
import { Validador } from './validator.js';

/**
 * Clase principal que orquesta la aplicación
 * Coordina API, UI, favoritos, rate limiting, métricas y validación
 */
class BuscadorApp {
    /**
     * Inicializa las dependencias y elementos del DOM
     */
    constructor() {
        this.api = new ApiLibros();
        this.ui = new InterfazUsuario();
        this.favoritos = new GestorFavoritos();
        this.rateLimiter = new ControladorPeticiones(5, 10000);
        this.metricas = new Metricas();
        this.validador = new Validador();

        this.formulario = document.getElementById('formulario-busqueda');
        this.inputBusqueda = document.getElementById('input-busqueda');
        this.btnFavoritos = document.querySelector('.btn-favoritos');

        this.vistaActual = 'inicio';

        this._manejarSubmit = this._manejarSubmit.bind(this);
        this._manejarClickFavoritos = this._manejarClickFavoritos.bind(this);
    }

    /**
     * Inicializa los event listeners principales
     */
    iniciar() {
        this.formulario.addEventListener('submit', this._manejarSubmit);
        this.btnFavoritos.addEventListener('click', this._manejarClickFavoritos);
        this.ui.actualizarContadorFavoritos(this.favoritos.obtenerCantidad());
    }

    /**
     * Orquestador de la búsqueda (Manejador del submit)
     * @param {Event} eventoSubmit Evento del formulario
     */
    async _manejarSubmit(eventoSubmit) {
        eventoSubmit.preventDefault();

        const terminoBusqueda = this.inputBusqueda.value;
        const validacion = this.validador.validarBusqueda(terminoBusqueda);

        if (!validacion.valido) {
            this.ui.mostrarMensaje(validacion.mensaje, true);
            return;
        }

        if (!this.rateLimiter.puedeRealizarPeticion()) {
            const espera = this.rateLimiter.obtenerTiempoEspera();
            this.ui.mostrarMensaje(`Demasiadas búsquedas. Espera ${espera} segundos.`, true);
            return;
        }

        this.vistaActual = 'resultados';
        await this._ejecutarBusqueda(validacion.terminoLimpio);
    }

    /**
     * Muestra u oculta la vista de favoritos
     */
    _manejarClickFavoritos() {
        if (this.vistaActual === 'favoritos') {
            this.vistaActual = 'inicio';
            this.ui.mostrarEstadoVacio();
            return;
        }

        this.vistaActual = 'favoritos';
        const listaFavoritos = this.favoritos.obtenerTodos();

        if (listaFavoritos.length === 0) {
            this.ui.ocultarEstadoVacio();
            this.ui.mostrarMensaje('No tienes libros favoritos aún. Busca libros y márcalos con el corazón.');
            return;
        }

        this.ui.renderizarLibros(listaFavoritos, this.favoritos, (libro) => {
            this._alternarFavorito(libro);
        });
    }

    /**
     * Flujo central de la aplicación (Orquestador API <-> UI)
     * @param {string} termino Texto a buscar
     */
    async _ejecutarBusqueda(termino) {
        this._prepararBusqueda();
        const inicioMedicion = this.metricas.iniciarMedicion();

        try {
            this.rateLimiter.registrarPeticion();
            const libros = await this.api.buscar(termino);

            this.metricas.finalizarMedicion(inicioMedicion, termino, libros.length);

            this.ui.renderizarLibros(libros, this.favoritos, (libro) => {
                this._alternarFavorito(libro);
            });

            this._mostrarInfoMetricas();
        } catch (error) {
            this.ui.mostrarMensaje(error.message, true);
        } finally {
            this.ui.ocultarCargador();
        }
    }

    /**
     * Alterna un libro como favorito y actualiza la UI
     * @param {Object} libro Datos del libro
     */
    _alternarFavorito(libro) {
        const agregado = this.favoritos.alternar(libro);
        this.ui.actualizarContadorFavoritos(this.favoritos.obtenerCantidad());
        this.ui.actualizarBotonFavorito(libro.titulo, agregado);
    }

    /**
     * Muestra información de métricas en consola (para desarrollo)
     */
    _mostrarInfoMetricas() {
        const resumen = this.metricas.obtenerResumen();
        console.info(
            `📊 Métricas | Búsquedas: ${resumen.totalBusquedas} | ` +
            `Promedio: ${resumen.tiempoPromedioMs}ms | ` +
            `Última: ${resumen.ultimaBusqueda?.duracionMs}ms`
        );
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
