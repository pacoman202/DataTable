class DataTable {
    constructor(id) {
        this.id = id;
        const { content, cantContent } = this.obtenerContenido();
        this.content = content;
        this.cantContent = cantContent;
        this.inicializarEstructura();

        if (cantContent < 0) return;
        this.cambiarPagina();
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

        $('html').on('click', '.buttonDataTable', function (event) {
            this.cambiarPagina(parseInt($(event.target).attr('pag')));
        }.bind(this));

        $('html').on('change', '.selectDataTable', this.cambiarPagina);

        $('html').on('input', '.searchDataTable', function (event) {
            this.cambiarPagina();
        }.bind(this));
    }

    generarSelect() {
        const nums = [5, 10, 25, 50, 100];
        let select = '<select class="selectDataTable">';
        nums.forEach(data => select += `<option value="${data}">${data}</option>`);
        return select + "</select>";
    }

    paginarDatos = (pagActual = 0, content) => {
        const cant = parseInt($('.selectDataTable').val())
        const punto = pagActual * cant;
        const data = content.map(data => data.body.slice(punto, punto + cant));
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
        const content = this.buscar();
        $(`${this.id} tbody`).html(this.paginarDatos(numPag, content));
        this.crearBotones(numPag, content);
    }

    crearBotones(pagActual = 0, content) {
        let botones = [];
        const length = Math.ceil(content[0].body.length / parseInt($('.selectDataTable').val()))
        for (let index = 0; index < length; index++) {
            botones.push(`<button pag="${index}" class="buttonDataTable 
            ${(pagActual === index) ? 'pagActual' : ''}">${index + 1}</button>`);
        }
        $('.buttonsDataTable').html(this.mostrarEnRango(pagActual, botones).join(' '));
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

        data = data.slice(inicio, fin + 1);

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

    buscar() {
        const input = $('.searchDataTable').val();
        return input === '' ? this.content : this.content.map((data, dataIndex) => {
            const filteredRows = data.body.filter((row, rowIndex) => {
                // Verificar si otras filas en el mismo índice de otros elementos también contienen el input
                for (let i = 0; i < this.content.length; i++) {
                    if (this.content[i].body[rowIndex].includes(input)) {
                        return true; // Si se encuentra en otra fila del mismo índice, devolver verdadero
                    }
                }

                return false; // Si no se encuentra en ninguna otra fila, devolver falso
            });

            return {
                head: data.head,
                body: filteredRows
            };
        });
    }

}