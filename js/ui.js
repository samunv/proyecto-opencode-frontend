/**
 * Clase encargada de manipular el DOM y la interfaz de usuario
 */
export class InterfazUsuario {
    /**
     * Inicializa los elementos del DOM necesarios
     */
    constructor() {
        this.cargador = document.getElementById('cargador');
        this.contenedorResultados = document.getElementById('contenedor-resultados');
        this.contenedorMensajes = document.getElementById('mensaje');
        this.estadoVacio = document.getElementById('estado-vacio');
        this._actualizarIconos();
    }

    /**
     * Muestra el spinner de carga (Obligatorio por regla de negocio)
     */
    mostrarCargador() {
        this.ocultarEstadoVacio();
        this.cargador.classList.remove('oculto');
        this.ocultarMensaje();
    }

    /**
     * Oculta el spinner de carga
     */
    ocultarCargador() {
        this.cargador.classList.add('oculto');
    }

    /**
     * Oculta la sección de estado vacío (carrusel y características)
     */
    ocultarEstadoVacio() {
        if (this.estadoVacio) {
            this.estadoVacio.classList.add('oculto');
        }
    }

    /**
     * Muestra la sección de estado vacío
     */
    mostrarEstadoVacio() {
        if (this.estadoVacio) {
            this.estadoVacio.classList.remove('oculto');
        }
        this.limpiarResultados();
        this.ocultarMensaje();
    }

    /**
     * Vacía el contenedor de resultados actual
     */
    limpiarResultados() {
        this.contenedorResultados.innerHTML = '';
    }

    /**
     * Muestra un mensaje al usuario
     * @param {string} texto Texto del mensaje
     * @param {boolean} esError Si es un error añade estilo rojo
     */
    mostrarMensaje(texto, esError = false) {
        const icono = esError ? 'alert-circle' : 'info';
        this.contenedorMensajes.innerHTML = '';

        const iconElement = document.createElement('i');
        iconElement.dataset.lucide = icono;
        this.contenedorMensajes.appendChild(iconElement);

        const spanText = document.createElement('span');
        spanText.textContent = texto;
        this.contenedorMensajes.appendChild(spanText);

        this.contenedorMensajes.className = `mensaje ${esError ? 'error' : ''}`;
        this._actualizarIconos(this.contenedorMensajes);
    }

    /**
     * Oculta el contenedor de mensajes
     */
    ocultarMensaje() {
        this.contenedorMensajes.classList.add('oculto');
    }

    /**
     * Recibe un array de objetos Libro y los inyecta en el DOM
     * @param {Array} libros Array de instancias de la clase Libro
     * @param {Object} gestorFavoritos Instancia del gestor de favoritos
     * @param {Function} callbackFavorito Función a ejecutar al pulsar favorito
     */
    renderizarLibros(libros, gestorFavoritos, callbackFavorito) {
        this.limpiarResultados();
        this.ocultarEstadoVacio();

        if (libros.length === 0) {
            this.mostrarMensaje('No se encontraron libros. Intenta otra búsqueda.');
            return;
        }

        const fragmentoHTML = this._crearFragmentoTarjetas(libros, gestorFavoritos, callbackFavorito);
        this.contenedorResultados.appendChild(fragmentoHTML);
        this._actualizarIconos(this.contenedorResultados);
    }

    /**
     * Actualiza el contador visual del botón de favoritos
     * @param {number} cantidad Número de favoritos
     */
    actualizarContadorFavoritos(cantidad) {
        const btnFavoritos = document.querySelector('.btn-favoritos');
        let contador = btnFavoritos.querySelector('.contador-favoritos');

        if (cantidad > 0) {
            if (!contador) {
                contador = document.createElement('span');
                contador.className = 'contador-favoritos';
                btnFavoritos.appendChild(contador);
            }
            contador.textContent = cantidad;
        } else if (contador) {
            contador.remove();
        }
    }

    /**
     * Actualiza el icono del botón de favorito en una tarjeta
     * @param {string} titulo Título del libro
     * @param {boolean} esFavorito Si está marcado como favorito
     */
    actualizarBotonFavorito(titulo, esFavorito) {
        const tarjetas = this.contenedorResultados.querySelectorAll('.tarjeta-libro');

        tarjetas.forEach(tarjeta => {
            const tituloTarjeta = tarjeta.querySelector('.titulo-libro');
            if (tituloTarjeta && tituloTarjeta.textContent === titulo) {
                const btnFav = tarjeta.querySelector('.btn-fav-tarjeta');
                if (btnFav) {
                    btnFav.classList.toggle('activo', esFavorito);
                    const iconoFav = btnFav.querySelector('i');
                    if (iconoFav) {
                        iconoFav.dataset.lucide = esFavorito ? 'heart' : 'heart';
                    }
                    this._actualizarIconos(btnFav);
                }
            }
        });
    }

    /**
     * Construye las tarjetas evitando reflows en cada iteración
     * @param {Array} libros Array de datos
     * @param {Object} gestorFavoritos Instancia del gestor de favoritos
     * @param {Function} callbackFavorito Función callback para favoritos
     * @returns {DocumentFragment} Elemento DOM listo para inyectar
     */
    _crearFragmentoTarjetas(libros, gestorFavoritos, callbackFavorito) {
        const fragmento = document.createDocumentFragment();

        libros.forEach(libro => {
            const esFav = gestorFavoritos ? gestorFavoritos.esFavorito(libro.titulo) : false;
            const tarjeta = this._construirHTMLTarjeta(libro, esFav, callbackFavorito);
            fragmento.appendChild(tarjeta);
        });

        return fragmento;
    }

    /**
     * Construye el HTML individual de una tarjeta con botón de favorito
     * @param {Object} libro Modelo de datos
     * @param {boolean} esFavorito Si está en favoritos
     * @param {Function} callbackFavorito Función callback
     * @returns {HTMLElement} Article de la tarjeta
     */
    _construirHTMLTarjeta(libro, esFavorito, callbackFavorito) {
        const div = document.createElement('article');
        div.className = 'tarjeta-libro';

        const img = document.createElement('img');
        img.src = libro.urlPortada;
        img.alt = `Portada de ${libro.titulo}`;
        img.className = 'portada-libro';
        img.loading = 'lazy';
        div.appendChild(img);

        const h3 = document.createElement('h3');
        h3.className = 'titulo-libro';
        h3.title = libro.titulo;
        h3.textContent = libro.titulo;
        div.appendChild(h3);

        const pAutor = document.createElement('p');
        pAutor.className = 'autor-libro';
        const iconoAutor = document.createElement('i');
        iconoAutor.dataset.lucide = 'user';
        pAutor.appendChild(iconoAutor);
        pAutor.appendChild(document.createTextNode(` ${libro.autor}`));
        div.appendChild(pAutor);

        const spanAnio = document.createElement('span');
        spanAnio.className = 'anio-libro';
        const iconoAnio = document.createElement('i');
        iconoAnio.dataset.lucide = 'calendar';
        spanAnio.appendChild(iconoAnio);
        spanAnio.appendChild(document.createTextNode(` ${libro.anioPublicacion}`));
        div.appendChild(spanAnio);

        const btnFav = document.createElement('button');
        btnFav.className = `btn-fav-tarjeta ${esFavorito ? 'activo' : ''}`;
        btnFav.setAttribute('aria-label', esFavorito ? 'Eliminar de favoritos' : 'Añadir a favoritos');

        const iconoFav = document.createElement('i');
        iconoFav.dataset.lucide = 'heart';
        btnFav.appendChild(iconoFav);

        btnFav.addEventListener('click', (evento) => {
            evento.stopPropagation();
            if (callbackFavorito) {
                callbackFavorito(libro);
            }
        });

        div.appendChild(btnFav);

        return div;
    }

    /**
     * Actualiza los iconos de Lucide en el DOM
     * @param {HTMLElement} nodo Nodo raíz para buscar iconos
     */
    _actualizarIconos(nodo = document) {
        if (window.lucide) {
            window.lucide.createIcons({ root: nodo });
        }
    }
}
