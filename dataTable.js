class DataTable {
    constructor(id) {
        this.id = id;
        const { content, cantContent } = this.obtenerContenido();
        this.content = content;
        this.cantContent = cantContent;
        this.inicializarEstructura();

        if (cantContent < 0) return;
        this.renderizarTabla();
    }

    obtenerContenido() {
        const content = [];

        $(`${this.id} thead th`).each(function (index) {
            const data = {
                body: [],
                head: $(this).text()
            };
            $(`${this.id} tbody td:nth-child(${index + 1})`).each(function () {
                data.body.push($(this).text());
            });
            content.push(data)
        });

        const cantContent = content.length - 1
        return { content, cantContent };
    }

    inicializarEstructura() {
        $(this.id).wrap('<div class="containerDataTable">');
        $(this.id).addClass('dataTable');

        $(`.containerDataTable`).append('<div class="buttonsDataTable">');
        $(`.containerDataTable`).prepend(this.generarSelect());
        $(`.containerDataTable`).prepend('<div>Buscar:<input type="text" class="searchDataTable"></div>');

        // Evento de cambio de pagina
        $('html').on('click', '.buttonDataTable', function (event) {
            this.cambiarPagina(parseInt($(event.target).attr('pag')));
        }.bind(this));

        // Evento de input para la busqueda de datos
        $('html').on('change', '.selectDataTable', this.renderizarTabla);

        // Evento de cambio de pagina
        $('html').on('input', '.searchDataTable', function (event) {
            this.buscar($(event.target).val());
        }.bind(this));
    }

    renderizarTabla() {
        this.crearBotones();
        this.cambiarPagina();
    }

    generarSelect() {
        const nums = [1, 5, 10, 25, 50, 100];
        let select = '<select class="selectDataTable" value="5">';
        nums.forEach(data => select += `<option value="${data}">${data}</option>`);
        return select + "</select>";
    }

    crearBotones(pagActual = 0) {
        let botones = [];
        this.content[0].body.forEach((data, index) => {
            botones.push(`<button pag="${index}" class="buttonDataTable 
            ${(pagActual === index) ? 'pagActual' : ''}">${index + 1}</button>`);
        })

        $('.buttonsDataTable').html(this.mostrarEnRango(pagActual, botones).join(' '));
    }

    paginarDatos = (pagActual = 0) => {
        const cant = parseInt($('.selectDataTable').val())
        const punto = pagActual * cant;
        const data = this.content.map(data => data.body.slice(punto, punto + cant));

        let res = ""
        for (let i = 0; i < data[0].length; i++) {
            res += '<tr>';
            for (let e = 0; e < data.length; e++) {
                res += `<td>${data[e][i]}</td>`;
            }
            res += '</tr>';
        }
        return res;
    }

    cambiarPagina = (numPag = 0) => {
        $(`${this.id} tbody`).html(this.paginarDatos(numPag));
        this.crearBotones(numPag);
    }

    mostrarEnRango(pagActual, data) {
        const rango = 2;
        const dataLength = data.length - 1;
        let inicio = Math.max(0, pagActual - rango);
        let fin = Math.min(dataLength, pagActual + rango);

        while ((fin - inicio + 1) < 5 && (inicio > 0 || fin < dataLength)) {
            inicio = Math.max(0, inicio - 1);
            fin = Math.min(dataLength, fin + 1);
        }

        // data = data.slice(inicio, fin + 1);
        data = data.filter((boton, index) => index >= inicio && index <= fin);
        // console.log(data);
        data.unshift(this.desplazarIzquierda(pagActual));
        data.push(this.desplazarDerecha(pagActual, dataLength));
        return data;
    }

    desplazarIzquierda(pagActual) {
        return `<button pag="0" ${(pagActual === 0) ? 'disabled' : ''} class="buttonDataTable"><<</button>`;
    }

    desplazarDerecha(pagActual, dataLength) {
        return `<button pag="${dataLength}" ${(pagActual === dataLength) ? 'disabled' : ''} class="buttonDataTable">>></button>`;
    }
}