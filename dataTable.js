class DataTable {
    constructor(id) {
        this.id = id
        this.header = $(`${id} thead`).html().split('<tr>').map(data => '<tr>' + data).slice(1)
        this.body = $(`${id} tbody`).html().split('<tr>').map(data => '<tr>' + data).slice(1)

        this.inicializarEstructura()
    }

    inicializarEstructura() {
        $(`${this.id}`).wrap('<div class="containerDataTable">')
        $(`${this.id}`).addClass('dataTable')

        $(`.containerDataTable`).append('<div class="buttonsDataTable">')
        $(`.containerDataTable`).prepend(this.generarSelect())

        $('html').on('click', '.buttonDataTable', function (event) {
            this.cambiarPagina($(event.target).attr('pag'))
        }.bind(this))

        $('html').on('change', '.selectDataTable', this.paginarDatos)

        this.paginarDatos()
    }

    generarSelect() {
        const nums = [1, 5, 10, 25, 50, 100]
        let select = '<select class="selectDataTable" value="5">'
        nums.forEach(data => select += `<option value="${data}">${data}</option>`)
        return select + "</select>"
    }

    paginarDatos = () => {
        const cant = parseInt($('.selectDataTable').val())

        this.datosPaginados = []
        this.body.forEach((data, index) => {
            if (index % cant === 0) {
                this.datosPaginados.push([])
            }
            this.datosPaginados[Math.floor(index / cant)].push(data)
        })

        this.crearBotones()
        this.cambiarPagina(0)
    }

    cambiarPagina = (data) => {
        $(`${this.id} tbody`).html(this.datosPaginados[data])
        this.crearBotones(data)
    }

    crearBotones(pagActual = 0) {
        let botones = []

        this.datosPaginados.forEach((data, index) => {
            botones.push(`<button pag="${index}" class="buttonDataTable">${index + 1}</button>`)
        })
        botones = this.mostrarEnRango(parseInt(pagActual), botones)


        $('.buttonsDataTable').html(botones.join(' '))
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

        data = data.filter((boton, index) => index >= inicio && index <= fin);

        data.unshift(this.desplazarIzquierda(pagActual))
        data.push(this.desplazarDerecha(pagActual, dataLength))
        return data
    }

    desplazarIzquierda(pagActual) {
        return `<button pag="0" ${(pagActual === 0) ? 'disabled' : ''} class="buttonDataTable"><<</button>`
    }

    desplazarDerecha(pagActual, dataLength) {
        return `<button pag="${dataLength}" ${(pagActual === dataLength) ? 'disabled' : ''} class="buttonDataTable">>></button>`
    }
}