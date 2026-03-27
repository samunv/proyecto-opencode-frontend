/**
 * Clase encargada de recopilar métricas de rendimiento de la aplicación
 * Mide tiempos de respuesta de API y registra estadísticas de uso
 */
export class Metricas {
    /**
     * Clave utilizada en sessionStorage
     * @type {string}
     */
    static CLAVE_STORAGE = 'metricas_sesion';

    /**
     * Inicializa las métricas desde la sesión actual
     */
    constructor() {
        this.datos = this._cargarDatos();
    }

    /**
     * Inicia la medición de tiempo para una operación
     * @returns {number} Timestamp de inicio
     */
    iniciarMedicion() {
        return performance.now();
    }

    /**
     * Finaliza la medición y registra el resultado
     * @param {number} inicio Timestamp devuelto por iniciarMedicion
     * @param {string} termino Término buscado
     * @param {number} resultados Número de resultados obtenidos
     */
    finalizarMedicion(inicio, termino, resultados) {
        const duracion = Math.round(performance.now() - inicio);

        this.datos.busquedas.push({
            termino: termino,
            resultados: resultados,
            duracionMs: duracion,
            fecha: new Date().toISOString()
        });

        this.datos.totalBusquedas++;
        this._actualizarPromedios(duracion);
        this._guardar();
    }

    /**
     * Obtiene un resumen de las métricas actuales
     * @returns {Object} Resumen con estadísticas
     */
    obtenerResumen() {
        return {
            totalBusquedas: this.datos.totalBusquedas,
            tiempoPromedioMs: this.datos.tiempoPromedioMs,
            ultimaBusqueda: this._obtenerUltimaBusqueda(),
            busquedaMasRapida: this.datos.busquedaMasRapida,
            busquedaMasLenta: this.datos.busquedaMasLenta
        };
    }

    /**
     * Actualiza los promedios con el nuevo dato
     * @param {number} duracion Duración de la última búsqueda en ms
     */
    _actualizarPromedios(duracion) {
        const total = this.datos.totalBusquedas;
        const promedioAnterior = this.datos.tiempoPromedioMs;

        this.datos.tiempoPromedioMs = Math.round(
            ((promedioAnterior * (total - 1)) + duracion) / total
        );

        if (duracion < this.datos.busquedaMasRapida || this.datos.busquedaMasRapida === 0) {
            this.datos.busquedaMasRapida = duracion;
        }

        if (duracion > this.datos.busquedaMasLenta) {
            this.datos.busquedaMasLenta = duracion;
        }
    }

    /**
     * Obtiene la información de la última búsqueda
     * @returns {Object|null} Última búsqueda o null
     */
    _obtenerUltimaBusqueda() {
        const busquedas = this.datos.busquedas;
        return busquedas.length > 0 ? busquedas[busquedas.length - 1] : null;
    }

    /**
     * Carga datos desde sessionStorage
     * @returns {Object} Datos de métricas
     */
    _cargarDatos() {
        try {
            const datos = sessionStorage.getItem(Metricas.CLAVE_STORAGE);
            return datos ? JSON.parse(datos) : this._datosIniciales();
        } catch (error) {
            return this._datosIniciales();
        }
    }

    /**
     * Estructura de datos iniciales
     * @returns {Object} Datos vacíos
     */
    _datosIniciales() {
        return {
            totalBusquedas: 0,
            tiempoPromedioMs: 0,
            busquedaMasRapida: 0,
            busquedaMasLenta: 0,
            busquedas: []
        };
    }

    /**
     * Guarda las métricas en sessionStorage
     */
    _guardar() {
        try {
            sessionStorage.setItem(
                Metricas.CLAVE_STORAGE,
                JSON.stringify(this.datos)
            );
        } catch (error) {
            console.error('Error al guardar métricas:', error);
        }
    }
}
