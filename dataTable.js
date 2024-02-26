class DataTable {
    constructor(id) {
        this.id = id
        this.header = $(`${id} thead`).html().split('<tr>').map(data => '<tr>' + data).slice(1)
        this.body = $(`${id} tbody`).html().split('<tr>').map(data => '<tr>' + data)
        $(`${id}`).wrap('<div class="containerDataTable">')
        $(`${id}`).addClass('dataTable')

        $(`.containerDataTable`).prepend(this.generarSelect())

        $('html').on('click', '.buttonDataTable', this.cantPags)
        $('html').on('change', '.selectDataTable', this.cantPags)

        this.cantPags()
    }

    generarSelect() {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        let select = '<select class="selectDataTable" value="5">'
        nums.forEach(data => select += `<option value="${data}">${data}</option>`)
        return select + "</select>"
    }

    cantPags = () => {
        const cant = parseInt($('.selectDataTable').val())
        this.datosPaginados = []
        this.body.slice(1).forEach((data, index) => {
            if (index % cant === 0) {
                this.datosPaginados.push([])
            }
            this.datosPaginados[Math.floor(index / cant)].push(data)
        })
        this.crearBotones()
        this.cambiarPagina(0)
    }

    cambiarPagina() {
        const numPag = $('.buttonDataTable').html()
        if (numPag === "<<") $(`${this.id} tbody`).html(this.datosPaginados[0])
        else if (numPag === ">>") $(`${this.id} tbody`).html(this.datosPaginados[this.datosPaginados.length - 1])
        else $(`${this.id} tbody`).html(this.datosPaginados[numPag])
    }

    crearBotones() {
        if (!$('.buttonsDataTable').html()) $(`.containerDataTable`).append('<div class="buttonsDataTable">')
        $('.buttonsDataTable').html('')
        Object.keys(this.datosPaginados).forEach((data, index) => {
            $('.buttonsDataTable').append('<button class="buttonDataTable">' + (index + 1) + '</button>')
        })
    }

    mostrarEnRango(rango, actual) {
        const start = Math.max(1, actual - rango);
        const end = Math.min(data.length, actual + rango);
        const res = data.slice(start - 1, end);

        if (res[0] !== 1) res.unshift('<<');
        if (res[res.length - 1] !== data[data.length - 1]) res.push('>>');
        return res
    }
}