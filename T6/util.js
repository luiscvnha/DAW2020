// Devolve a data e hora no formato "YYYY-MM-DD HH:MM:SS"
function myDateTime() {
    const date = (new Date()).toISOString()
    return date.substring(0, 10) + ' ' + date.substring(11, 19)
}


// Imprime para a consola uma mensagem de log, com a etiqueta da data e hora
exports.log = log
function log(message) {
    console.log('[' + myDateTime() + '] ' + message)
}


// Devolve uma página de erro, com a mensagem passada como argumento
exports.errorPage = errorPage
function errorPage(message) {
    return `
        <html lang="pt">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>ToDo</title>
            <link rel="icon" href="favicon.png">
            <style>
                th, td { padding: 10px; }
                th { font-size: 100px; }
                td { font-size: 30px; }
            </style>
        </head>
        <body>
            <table>
                <tr>
                    <th rowspan="2">:(</th>
                    <td>Erro</td>
                </tr>
                <tr>
                    <td>${message}</td>
                </tr>
            </table>
        </body>
        </html>`
}


// Converte uma lista de tarefas em HTML correspondente a linhas de uma tabela
// O argumento 'option' determina se é adicionado um botão para editar ou para remover
function tasks2TableRows(tasks, option) {
    let r = ''
    var button = {}

    if (option === 'edit')
        button = (t) => { return `<button class="w3-button w3-bar w3-round-xlarge w3-teal w3-hover-pale-green" type="button" onclick="edit(${t.id})">Editar</button>` }
    else if (option === 'remove')
        button = (t) => { return `<button class="w3-button w3-bar w3-round-xlarge w3-teal w3-hover-pale-green" type="button" onclick="remove(${t.id})">Remover</button>` }
    else return r

    tasks.forEach(task => {
        r += `
            <tr id="tr-${task.id}">
                <td>${task.dateCreated}</td>
                <td>${task.dateDue}</td>
                <td>${task.who}</td>
                <td>${task.what}</td>
                <td>${task.type}</td>
                <td colspan="2">${button(task)}</td>
            </tr>`
    })

    return r
}


// Gera a página principal
exports.mainPage = mainPage
function mainPage(tasks) {
    // Dividir tarefas em ativas e completadas
    const active = []
    const resolved = []
    {
        let date = new Date()

        tasks.forEach(t => {
            if (new Date(t.dateDue) >= date)
                active.push(t)
            else
                resolved.push(t)
        })
    }

    // Geração da página html
    return `
        <html lang="pt">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>ToDo</title>
            <link rel="icon" href="favicon.png">
            <link rel="stylesheet" href="w3.css"/>
            <script src="client.js"></script>
        </head>
        <body>
            <div class="w3-container w3-indigo">
                <h1>ToDo</h1>
            </div>
            <table class="w3-table">
                <tr>
                    <td rowspan="2">
                        <div class="w3-container w3-green">
                            <h2>Adicionar tarefa</h2>
                        </div>
                        <br/>
                        <form class="w3-container">
                            <label class="w3-text-green" for="dateDue"><b>Data de vencimento: </b></label>
                            <input class="w3-input w3-border w3-light-grey" type="date" name="dateDue" id="dateDue-input"/>
                            <br/>
                            <label class="w3-text-green" for="who"><b>Quem: </b></label>
                            <input class="w3-input w3-border w3-light-grey" type="text" name="who" id="who-input"/>
                            <br/>
                            <label class="w3-text-green" for="what"><b>O quê: </b></label>
                            <input class="w3-input w3-border w3-light-grey" type="text" name="what" id="what-input"/>
                            <br/>
                            <label class="w3-text-green" for="type"><b>Tipo: </b></label>
                            <input class="w3-input w3-border w3-light-grey" type="text" name="type" id="type-input"/>
                            <br/><br/>
                            <button class="w3-button w3-round-xlarge w3-teal w3-hover-pale-green" type="button" onclick="add()">Adicionar</button>
                            <button class="w3-button w3-round-xlarge w3-red w3-hover-pale-red" type="reset">Limpar</button>
                        </form>
                        <br/>
                    </td>
                    <td>
                        <div class="w3-container w3-green">
                            <h2>Tarefas ativas</h2>
                        </div>
                        <br/>
                        <table class="w3-table w3-bordered w3-striped" id="activeTasks-table">
                            <tr>
                                <th>Data de criação</th>
                                <th>Data de vencimento</th>
                                <th>Quem</th>
                                <th>O quê</th>
                                <th>Tipo</th>
                                <th colspan="2"/>
                            </tr>
                            ${tasks2TableRows(active, 'edit')}
                        </table>
                        <br/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="w3-container w3-green">
                            <h2>Tarefas completadas</h2>
                        </div>
                        <br/>
                        <table class="w3-table w3-bordered w3-striped" id="resolvedTasks-table">
                            <tr>
                                <th>Data de criação</th>
                                <th>Data de vencimento</th>
                                <th>Quem</th>
                                <th>O quê</th>
                                <th>Tipo</th>
                                <th colspan="2"/>
                            </tr>
                            ${tasks2TableRows(resolved, 'remove')}
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>`
}
