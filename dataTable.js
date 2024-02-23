class DataTable {
    constructor(id) {
        this.id = id
    }

    crearDataTable() {
        datos = document.getElementById('tbody').innerHTML.split('<tr>').map(data => '<tr>' + data)
        datos.splice(0, 1)
        limite = 2
        datosPaginados = []
        datos.forEach((data, index) => {
            if (index % limite === 0) {
                datosPaginados.push([])
            }
            datosPaginados[Math.floor(index / limite)].push(data)
        })
        document.getElementById('tbody').innerHTML = datosPaginados[0].join('')

        divButtons = document.getElementById('buttonsDataTable')
        datosPaginados.forEach((data, index) => {
            divButtons.innerHTML += '<button onclick="paginar(' + index + ')">' + (index + 1) + '</button>'
        })
    }
    
    paginar(pag) {
        document.getElementById('tbody').innerHTML = datosPaginados[pag].join('')
    }
}


