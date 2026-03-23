/**
 * Clase encargada de inicializar el carrusel de imágenes
 */
export class Carrusel {
    /**
     * Obtiene la configuración del carrusel
     * @returns {Object} Configuración de Swiper
     */
    _obtenerConfiguracion() {
        return {
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
        };
    }

    /**
     * Inicializa el componente Swiper
     * @returns {Object|undefined} Instancia de Swiper o undefined
     */
    inicializar() {
        if (typeof Swiper !== 'undefined') {
            return new Swiper('.carrusel-inicio', this._obtenerConfiguracion());
        }
    }
}
