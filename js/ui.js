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
        if (this.estadoVacio) {
            this.estadoVacio.classList.add('oculto');
        }
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
     * @param {Libro[]} libros Array de instancias de la clase Libro
     */
    renderizarLibros(libros) {
        this.limpiarResultados();
        
        if (libros.length === 0) {
            this.mostrarMensaje('No se encontraron libros. Intenta otra búsqueda.');
            return;
        }

        const fragmentoHTML = this._crearFragmentoTarjetas(libros);
        this.contenedorResultados.appendChild(fragmentoHTML);
        this._actualizarIconos(this.contenedorResultados);
    }

    /**
     * Construye las tarjetas evitando reflows en cada iteración
     * @param {Libro[]} libros Array de datos
     * @returns {DocumentFragment} Elemento DOM listo para inyectar
     */
    _crearFragmentoTarjetas(libros) {
        const fragmento = document.createDocumentFragment();
        
        libros.forEach(libro => {
            const tarjeta = this._construirHTMLTarjeta(libro);
            fragmento.appendChild(tarjeta);
        });
        
        return fragmento;
    }

    /**
     * Construye el HTML individual de una tarjeta
     * Función corta de responsabilidad única
     * @param {Libro} libro Modelo de datos
     * @returns {HTMLElement} Div de la tarjeta
     */
    _construirHTMLTarjeta(libro) {
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