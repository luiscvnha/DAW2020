function load() {
    document.getElementById('defaultOpen').click()
}

function openTab(tabName, button) {
    // Tab fechada
    const tabcontent = document.getElementsByClassName('tab-content')
    for (let i = 0; i < tabcontent.length; ++i)
        tabcontent[i].style.display = 'none'

    const tablinks = document.getElementsByClassName("tab-link")
    for (let i = 0; i < tablinks.length; ++i)
        tablinks[i].style.backgroundColor = ''

    // Tab aberta
    document.getElementById(tabName).style.display = 'block'

    button.style.backgroundColor = '#009688'
}

function add() {
    // Parsing
    const entry = {
        numero: document.getElementById('number-input').value,
        nome: document.getElementById('name-input').value,
        git: document.getElementById('git-input').value,
        tpc: [
            document.getElementById('tpc-input-1').checked ? 1 : 0,
            document.getElementById('tpc-input-2').checked ? 1 : 0,
            document.getElementById('tpc-input-3').checked ? 1 : 0,
            document.getElementById('tpc-input-4').checked ? 1 : 0,
            document.getElementById('tpc-input-5').checked ? 1 : 0,
            document.getElementById('tpc-input-6').checked ? 1 : 0,
            document.getElementById('tpc-input-7').checked ? 1 : 0,
            document.getElementById('tpc-input-8').checked ? 1 : 0
        ]
    }

    // Criação do pedido
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 201) {
                const ans = JSON.parse(this.responseText)
                const table = document.getElementById('students-table')
                let tpc = ''
                ans.tpc.forEach(t => {
                    if (t == 1)
                        tpc += '<img class="ok" src="/images/ok.png" alt="1" width="24" height="24"/>'
                    else
                        tpc += '<img class="not" src="/images/not.png" alt="0" width="24" height="24"/>'
                })

                table.innerHTML += `
                    <tr>
                        <td>${ans.numero}</td>
                        <td>${ans.nome}</td>
                        <td><a href="${ans.git}" target="_blank">${ans.git}</a></td>
                        <td>${tpc}</td>
                        <td class="button-td">
                            <button class="w3-button w3-bar w3-small w3-padding-small w3-round-xlarge w3-green w3-hover-pale-green"
                                type="button" onclick="edit('${ans.numero}',this.parentNode.parentNode)">Editar</button>
                        </td>
                        <td class="button-td">
                            <button class="w3-button w3-bar w3-small w3-padding-small w3-round-xlarge w3-red w3-hover-pale-red"
                                type="button" onclick="remove('${ans.numero}',this.parentNode.parentNode)">Remover</button>
                        </td>
                    </tr>`

                alert('Aluno registado com sucesso')
            }
            else if (this.status === 404 || this.status === 409) {
                alert('ERRO ' + this.status + '\n' + this.responseText)
            }
        }
    }

    // Envio
    xhttp.open('POST', '/alunos', true)
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    xhttp.send(JSON.stringify(entry))
}

function edit(id, tr) {
    const nome = tr.cells[1].innerText
    const git = tr.cells[2].innerText
    let tpc = ''
    const imgs = tr.cells[3].getElementsByTagName('img')
    for (let i = 0; i < imgs.length; ++i) {
        if (imgs[i].alt == "1")
            tpc += `<input type="checkbox" checked/> ${i+1}`
        else
            tpc += `<input type="checkbox"/> ${i+1}`
    }

    tr.innerHTML = `
        <td>${id}</td>
        <td><input class="w3-input w3-border w3-light-grey" type="text" value="${nome}"/></td>
        <td><input class="w3-input w3-border w3-light-grey" type="text" value="${git}"/></td>
        <td>${tpc}</td>
        <td class="button-td">
            <button class="w3-button w3-bar w3-small w3-padding-small w3-round-xlarge w3-green w3-hover-pale-green"
                type="button" onclick="editConfirm('${id}',this.parentNode.parentNode)">Confirmar</button>
        </td>
        <td class="button-td">
            <button class="w3-button w3-bar w3-small w3-padding-small w3-round-xlarge w3-red w3-hover-pale-red"
                type="button" onclick="editCancel('${id}',this.parentNode.parentNode)">Cancelar</button>
        </td>`
}

function editConfirm(id, tr) {
    // Parsing
    const entry = {
        numero: id,
        nome: tr.cells[1].querySelector('input').value,
        git: tr.cells[2].querySelector('input').value,
        tpc: []
    }
    const checkboxes = tr.cells[3].getElementsByTagName('input')
    for (let i = 0; i < checkboxes.length; ++i)
        entry.tpc.push(checkboxes[i].checked ? 1 : 0)

    // Criação do pedido
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const ans = JSON.parse(this.responseText)
                let tpc = ''
                ans.tpc.forEach(t => {
                    if (t == 1)
                        tpc += '<img class="ok" src="/images/ok.png" alt="1" width="24" height="24"/>'
                    else
                        tpc += '<img class="not" src="/images/not.png" alt="0" width="24" height="24"/>'
                })

                tr.innerHTML = `
                    <td>${ans.numero}</td>
                    <td>${ans.nome}</td>
                    <td><a href="${ans.git}" target="_blank">${ans.git}</a></td>
                    <td>${tpc}</td>
                    <td class="button-td">
                        <button class="w3-button w3-bar w3-small w3-padding-small w3-round-xlarge w3-green w3-hover-pale-green"
                            type="button" onclick="edit('${ans.numero}',this.parentNode.parentNode)">Editar</button>
                    </td>
                    <td class="button-td">
                        <button class="w3-button w3-bar w3-small w3-padding-small w3-round-xlarge w3-red w3-hover-pale-red"
                            type="button" onclick="remove('${ans.numero}',this.parentNode.parentNode)">Remover</button>
                    </td>`
            }
            else if (this.status === 404) {
                alert('ERRO 404\n' + this.responseText)
            }
        }
    }

    // Envio
    xhttp.open('PUT', '/alunos/' + id, true)
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    xhttp.send(JSON.stringify(entry))
}

function editCancel(id, tr) {
    // Criação do pedido
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const ans = JSON.parse(this.responseText)
                let tpc = ''
                ans.tpc.forEach(t => {
                    if (t == 1)
                        tpc += '<img class="ok" src="/images/ok.png" alt="1" width="24" height="24"/>'
                    else
                        tpc += '<img class="not" src="/images/not.png" alt="0" width="24" height="24"/>'
                })

                tr.innerHTML = `
                    <td>${ans.numero}</td>
                    <td>${ans.nome}</td>
                    <td><a href="${ans.git}" target="_blank">${ans.git}</a></td>
                    <td>${tpc}</td>
                    <td class="button-td">
                        <button class="w3-button w3-bar w3-small w3-padding-small w3-round-xlarge w3-green w3-hover-pale-green"
                            type="button" onclick="edit('${ans.numero}',this.parentNode.parentNode)">Editar</button>
                    </td>
                    <td class="button-td">
                        <button class="w3-button w3-bar w3-small w3-padding-small w3-round-xlarge w3-red w3-hover-pale-red"
                            type="button" onclick="remove('${ans.numero}',this.parentNode.parentNode)">Remover</button>
                    </td>`
            }
            else if (this.status === 404) {
                alert('ERRO 404\n' + this.responseText)
            }
        }
    }

    // Envio
    xhttp.open('GET', '/alunos/' + id, true)
    xhttp.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    xhttp.send()
}

function remove(id, tr) {
    tr.cells[4].innerHTML = `
        <button class="w3-button w3-bar w3-small w3-padding-small w3-round-xlarge w3-green w3-hover-pale-green"
            type="button" onclick="removeConfirm('${id}',this.parentNode.parentNode)">Sim</button>`

    tr.cells[5].innerHTML = `
        <button class="w3-button w3-bar w3-small w3-padding-small w3-round-xlarge w3-red w3-hover-pale-red"
            type="button" onclick="removeCancel('${id}',this.parentNode.parentNode)">Não</button>`
}

function removeConfirm(id, tr) {
    // Criação do pedido
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const table = tr.parentNode
                table.removeChild(tr)
            }
            else if (this.status === 404) {
                alert('ERRO 404\n' + this.responseText)
            }
        }
    }

    // Envio
    xhttp.open('DELETE', '/alunos/' + id, true)
    xhttp.send()
}

function removeCancel(id, tr) {
    tr.cells[4].innerHTML = `
        <button class="w3-button w3-bar w3-small w3-padding-small w3-round-xlarge w3-green w3-hover-pale-green"
            type="button" onclick="edit('${id}',this.parentNode.parentNode)">Editar</button>`

    tr.cells[5].innerHTML = `
        <button class="w3-button w3-bar w3-small w3-padding-small w3-round-xlarge w3-red w3-hover-pale-red"
            type="button" onclick="remove('${id}',this.parentNode.parentNode)">Remover</button>`
}
