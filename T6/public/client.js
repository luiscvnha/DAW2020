function add() {
    // Parsing
    const entry = {
        dateCreated: (new Date()).toISOString().substring(0, 10),
        dateDue: document.getElementById('dateDue-input').value,
        who: document.getElementById('who-input').value,
        what: document.getElementById('what-input').value,
        type: document.getElementById('type-input').value
    }

    if (entry.dateDue === '' || entry.who === '' || entry.what === '' || entry.type === '') {
        alert('ERRO\nCampo(s) vazio(s)')
        return
    }
    if (! /[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(entry.dateDue)) {
        alert('ERRO\nFormato de data inválido\n(formato válido: YYYY-MM-DD)')
        return
    }

    // Criação do pedido
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 201) {
                const task = JSON.parse(this.responseText)
                let table
                let button

                if (new Date(task.dateDue) > new Date()) {
                    table = document.getElementById('activeTasks-table')
                    button = `<button class="w3-button w3-bar w3-round-xlarge w3-teal w3-hover-pale-green" type="button" onclick="edit(${task.id})">Editar</button>`
                }
                else {
                    table = document.getElementById('resolvedTasks-table')
                    button = `<button class="w3-button w3-bar w3-round-xlarge w3-teal w3-hover-pale-green" type="button" onclick="remove(${task.id})">Remover</button>`
                }
    
                table.innerHTML += `
                    <tr id="tr-${task.id}">
                        <td>${task.dateCreated}</td>
                        <td>${task.dateDue}</td>
                        <td>${task.who}</td>
                        <td>${task.what}</td>
                        <td>${task.type}</td>
                        <td colspan="2">${button}</td>
                    </tr>`
            }
            else if (this.status === 404) {
                alert('ERRO\n' + this.responseText)
            }
        }
    }

    // Envio
    xhttp.open('POST', '/task', true)
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    xhttp.send(JSON.stringify(entry))
}


function edit(id) {
    const tableRow = document.getElementById('tr-' + id)

    const dateCreated = tableRow.cells[0].innerText
    const dateDue = tableRow.cells[1].innerText
    const who = tableRow.cells[2].innerText
    const what = tableRow.cells[3].innerText
    const type = tableRow.cells[4].innerText

    tableRow.innerHTML = `
        <td>${dateCreated}</td>
        <td><input class="w3-input w3-border" type="date" value="${dateDue}"/></td>
        <td><input class="w3-input w3-border" type="text" value="${who}"/></td>
        <td><input class="w3-input w3-border" type="text" value="${what}"/></td>
        <td><input class="w3-input w3-border" type="text" value="${type}"/></td>
        <td><button class="w3-button w3-bar w3-round-xlarge w3-blue w3-hover-pale-blue" type="button" onclick="editConfirm(${id})">Confirmar</button></td>
        <td><button class="w3-button w3-bar w3-round-xlarge w3-red w3-hover-pale-red" type="button" onclick="editCancel(${id})">Cancelar</button></td>`
}


function editConfirm(id) {
    // Parsing
    const tableRow = document.getElementById('tr-' + id)

    const entry = {
        dateCreated: tableRow.cells[0].innerText,
        dateDue: tableRow.cells[1].querySelector('input').value,
        who: tableRow.cells[2].querySelector('input').value,
        what: tableRow.cells[3].querySelector('input').value,
        type: tableRow.cells[4].querySelector('input').value,
        id: id
    }

    if (entry.dateDue === '' || entry.who === '' || entry.what === '' || entry.type === '') {
        alert('ERRO\nCampo(s) vazio(s)')
        return
    }
    if (! /[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(entry.dateDue)) {
        alert('ERRO\nFormato de data inválido\n(formato válido: YYYY-MM-DD)')
        return
    }

    // Criação do pedido
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const task = JSON.parse(this.responseText)

                tableRow.innerHTML = `
                    <td>${task.dateCreated}</td>
                    <td>${task.dateDue}</td>
                    <td>${task.who}</td>
                    <td>${task.what}</td>
                    <td>${task.type}</td>
                    <td colspan="2"><button class="w3-button w3-bar w3-round-xlarge w3-teal w3-hover-pale-green" type="button" onclick="edit(${task.id})">Editar</button></td>`
            }
            else if (this.status === 404) {
                alert('ERRO\n' + this.responseText)
            }
        }
    }

    // Envio
    xhttp.open('PUT', '/task/' + id, true)
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    xhttp.send(JSON.stringify(entry))
}


function editCancel(id) {
    // Criação do pedido
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const task = JSON.parse(this.responseText)
                const tableRow = document.getElementById('tr-' + id)

                tableRow.innerHTML = `
                    <td>${task.dateCreated}</td>
                    <td>${task.dateDue}</td>
                    <td>${task.who}</td>
                    <td>${task.what}</td>
                    <td>${task.type}</td>
                    <td colspan="2"><button class="w3-button w3-bar w3-round-xlarge w3-teal w3-hover-pale-green" type="button" onclick="edit(${task.id})">Editar</button></td>`
            }
            else if (this.status === 404) {
                alert('ERRO\n' + this.responseText)
            }
        }
    }

    // Envio
    xhttp.open('GET', '/task/' + id, true)
    xhttp.send()
}


function remove(id) {
    const tableRow = document.getElementById('tr-' + id)

    tableRow.cells[5].outerHTML = `<td><button class="w3-button w3-bar w3-round-xlarge w3-blue w3-hover-pale-blue" type="button" onclick="removeConfirm(${id})">Sim</button></td>`
    tableRow.innerHTML += `<td><button class="w3-button w3-bar w3-round-xlarge w3-red w3-hover-pale-red" type="button" onclick="removeCancel(${id})">Não</button></td>`
}


function removeConfirm(id) {
    // Criação do pedido
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const tableRow = document.getElementById('tr-' + id)
                const table = tableRow.parentNode

                table.removeChild(tableRow)
            }
            else if (this.status === 404) {
                alert('ERRO\n' + this.responseText)
            }
        }
    }

    // Envio
    xhttp.open('DELETE', '/task/' + id, true)
    xhttp.send()
}


function removeCancel(id) {
    const tableRow = document.getElementById('tr-' + id)

    tableRow.deleteCell(6)
    tableRow.cells[5].outerHTML = `<td colspan="2"><button class="w3-button w3-bar w3-round-xlarge w3-teal w3-hover-pale-green" type="button" onclick="remove(${id})">Remover</button></td>`
}
