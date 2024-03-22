class DataTable {
    constructor(id, theme = 'td-gray-theme') {
        this.id = id;
        this.idContent = `${id}Content`;
        const { content, cantContent } = this.obtenerContenido();
        this.content = content;
        this.cantContent = cantContent;
        this.filteredColumn = '';
        this.antFiltered = '.';
        this.inicializarEstructura(theme);
        this.fnGene = this.fnGeneradora([]);
        this.isFiltred = false;

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
            $(this).closest('table').find(`tbody td:nth-child(${index + 1})`).each(function () {
                data.body.push($(this).text());
            });
            content.push(data)
        });

        const cantContent = content.length - 1
        return { content, cantContent };
    }

    inicializarEstructura(theme) {
        $(this.id).wrap(`<div id="${this.id.substring(1)}Content" class="containerDataTable ${theme}">`);
        $(this.id).addClass('dataTable');

        $(this.idContent).append('<div class="buttonsDataTable">');
        $(this.idContent).prepend(`<div class="flex">${this.generarSelect()}<div>Buscar:<input type="text" class="searchDataTable"></div></div>`);

        $('html').on('click', `${this.idContent} .buttonDataTable`, function (event) {
            this.cambiarPagina(parseInt($(event.target).attr('pag')));
        }.bind(this));

        $('html').on('change', `${this.idContent} .selectDataTable`, function (event) {
            this.cambiarPagina();
        }.bind(this));

        $('html').on('input', `${this.idContent} .searchDataTable`, function (event) {
            this.cambiarPagina();
        }.bind(this));

        $('html').on('click', `${this.idContent} .dataTable thead th`, function (event) {
            this.filteredColumn = $(event.target).html();
            this.isFiltred = true;
            this.cambiarPagina();
            this.isFiltred = false;
        }.bind(this));
    }

    generarSelect() {
        const nums = [5, 10, 25, 50, 100];
        let select = '<select class="selectDataTable">';
        nums.forEach(data => select += `<option value="${data}">${data}</option>`);
        return select + "</select>";
    }

    paginarDatos = (pagActual = 0, content) => {
        const cant = parseInt($(`${this.idContent} .selectDataTable`).val())
        const punto = pagActual * cant;
        const data = content.map(data => data.body.slice(punto, punto + cant));
        let res = "";
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
        const length = Math.ceil(content[0].body.length / parseInt($(`${this.idContent} .selectDataTable`).val()))
        for (let index = 0; index < length; index++) {
            botones.push(`<button pag="${index}" class="buttonDataTable 
            ${(pagActual === index) ? 'pagActual' : ''}">${index + 1}</button>`);
        }
        $(`${this.idContent} .buttonsDataTable`).html(this.mostrarEnRango(pagActual, botones).join(' '));
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
        const input = $(`${this.idContent} .searchDataTable`).val();
        return input === '' ? this.datosFiltrados() : this.datosFiltrados().map((data, dataIndex) => {
            const filteredRows = data.body.filter((row, rowIndex) => {
                for (let i = 0; i < this.content.length; i++) {
                    if (this.content[i].body[rowIndex].includes(input)) {
                        return true;
                    }
                }
                return false;
            });
            return {
                head: data.head,
                body: filteredRows
            };
        });
    }

    datosFiltrados() {
        if (this.filteredColumn === '' || !this.isFiltred) return this.content
        const index = this.content.findIndex(data => data.head === this.filteredColumn)
        const copia = JSON.parse(JSON.stringify(this.content))

        if (this.antFiltered != this.filteredColumn) this.fnGene = this.fnGeneradora(copia[index].body, index)
        this.antFiltered = this.filteredColumn
        copia[index].body = this.fnGene.next().value

        return copia
    }

    *fnGeneradora(data, index = 0) {
        $(`${this.id} thead .down`).removeClass('down');
        $(`${this.id} thead .up`).removeClass('up');
        while (true) {
            $(`${this.id} thead th:nth-child(${index + 1})`).addClass('up');
            yield data.slice().sort()
            $(`${this.id} thead .up`).toggleClass('up down');
            yield data.slice().sort((a, b) => b.localeCompare(a))
            $(`${this.id} thead .down`).removeClass('down');
            yield data
        }
    }
}