/**
 * Clase que implementa Rate Limiting para las peticiones a la API
 * Evita saturar el servidor con demasiadas peticiones seguidas
 */
export class ControladorPeticiones {
    /**
     * @param {number} maxPeticiones Máximo de peticiones permitidas en la ventana
     * @param {number} ventanaMs Ventana de tiempo en milisegundos
     */
    constructor(maxPeticiones = 5, ventanaMs = 10000) {
        this.maxPeticiones = maxPeticiones;
        this.ventanaMs = ventanaMs;
        this.registroPeticiones = [];
    }

    /**
     * Verifica si se puede realizar una nueva petición
     * @returns {boolean} true si se permite la petición
     */
    puedeRealizarPeticion() {
        this._limpiarRegistrosExpirados();
        return this.registroPeticiones.length < this.maxPeticiones;
    }

    /**
     * Registra una nueva petición realizada
     */
    registrarPeticion() {
        this.registroPeticiones.push(Date.now());
    }

    /**
     * Calcula los segundos restantes hasta poder hacer otra petición
     * @returns {number} Segundos de espera necesarios
     */
    obtenerTiempoEspera() {
        if (this.puedeRealizarPeticion()) {
            return 0;
        }

        const peticionMasAntigua = this.registroPeticiones[0];
        const tiempoRestante = (peticionMasAntigua + this.ventanaMs) - Date.now();

        return Math.ceil(tiempoRestante / 1000);
    }

    /**
     * Elimina registros fuera de la ventana de tiempo
     */
    _limpiarRegistrosExpirados() {
        const ahora = Date.now();
        this.registroPeticiones = this.registroPeticiones.filter(
            timestamp => (ahora - timestamp) < this.ventanaMs
        );
    }
}
