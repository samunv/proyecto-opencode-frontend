export class InterfazUsuario {
    constructor() {
        this.cargador = document.getElementById('cargador');
        this.contenedorResultados = document.getElementById('contenedor-resultados');
        this.contenedorMensajes = document.getElementById('mensaje');
        this.estadoVacio = document.getElementById('estado-vacio');
        this._actualizarIconos();
    }

    /** Muestra el spinner de carga (Obligatorio por regla de negocio) */
    mostrarCargador() {
        if (this.estadoVacio) {
            this.estadoVacio.classList.add('oculto');
        }
        this.cargador.classList.remove('oculto');
        this.ocultarMensaje();
    }

    /** Oculta el spinner de carga */
    ocultarCargador() {
        this.cargador.classList.add('oculto');
    }

    /** Vacía el contenedor de resultados actual */
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
        this.contenedorMensajes.innerHTML = `<i data-lucide="${icono}"></i> <span>${texto}</span>`;
        this.contenedorMensajes.className = `mensaje ${esError ? 'error' : ''}`;
        this._actualizarIconos(this.contenedorMensajes);
    }

    /** Oculta el contenedor de mensajes */
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
        
        div.innerHTML = `
            <img src="${libro.urlPortada}" alt="Portada de ${libro.titulo}" class="portada-libro" loading="lazy">
            <h3 class="titulo-libro" title="${libro.titulo}">${libro.titulo}</h3>
            <p class="autor-libro"><i data-lucide="user"></i> ${libro.autor}</p>
            <span class="anio-libro"><i data-lucide="calendar"></i> ${libro.anioPublicacion}</span>
        `;
        
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