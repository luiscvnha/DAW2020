const http = require('http')
const axios = require('axios')
const stt = require('./static')
const util = require('./util.js')

const PORT = 7777


// Criação do servidor
const toDoServer = http.createServer((req, res) => {
    // Logger
    util.log(req.method + ' ' + req.url)

    // Tratamento do pedido
    if (stt.isStaticResource(req)) {
        stt.getStaticResource(req, res)
    } else switch (req.method) {
        case 'GET':
            // GET / ------------------------------------------------------------------------------
            if (req.url === '/') {
                axios.get('http://localhost:3000/tasks')
                    .then(response => {
                        const tasks = response.data
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(util.mainPage(tasks))
                    })
                    .catch(error => {
                        util.log(error)
                        res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
                        res.end(util.errorPage('Não foi possível obter a lista de tarefas'))
                    })
            }
            // GET /task/:id ----------------------------------------------------------------------
            else if (/\/task\/[0-9]+$/.test(req.url)) {
                const id = req.url.split('/')[2];
                axios.get('http://localhost:3000/tasks/' + id)
                    .then(response => {
                        const task = response.data
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
                        res.end(JSON.stringify(task))
                    })
                    .catch(error => {
                        util.log(error)
                        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
                        res.end('Não foi possível obter a tarefa')
                    })
            }
            else {
                res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(util.errorPage(req.method + ' ' + req.url + ' não suportado neste serviço'))
            }
            break
        case 'POST':
            // POST /task -------------------------------------------------------------------------
            if (req.url === '/task') {
                let data = ''
                req.on('data', chunk => { data += chunk })
                req.on('end', () => {
                    const task = JSON.parse(data)
                    axios.post('http://localhost:3000/tasks', task)
                        .then(response => {
                            const task = response.data
                            res.writeHead(201, {'Content-Type': 'application/json; charset=utf-8'})
                            res.end(JSON.stringify(task))
                        })
                        .catch(error => {
                            util.log(error)
                            res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
                            res.end('Não foi possível acrescentar a tarefa à lista')
                        })
                })
            }
            else {
                res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(util.errorPage(req.method + ' ' + req.url + ' não suportado neste serviço'))
            }
            break
        case 'PUT':
            // PUT /task/:id ----------------------------------------------------------------------
            if (/\/task\/[0-9]+$/.test(req.url)) {
                const id = req.url.split('/')[2];
                let data = ''
                req.on('data', chunk => { data += chunk })
                req.on('end', () => {
                    const task = JSON.parse(data)
                    axios.put('http://localhost:3000/tasks/' + id, task)
                        .then(response => {
                            const task = response.data
                            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
                            res.end(JSON.stringify(task))
                        })
                        .catch(error => {
                            util.log(error)
                            res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
                            res.end('Não foi possível atualizar a tarefa')
                        })
                })
            }
            else {
                res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(util.errorPage(req.method + ' ' + req.url + ' não suportado neste serviço'))
            }
            break
        case 'DELETE':
            // DELETE /task/:id -------------------------------------------------------------------
            if (/\/task\/[0-9]+$/.test(req.url)) {
                const id = req.url.split('/')[2];
                axios.delete('http://localhost:3000/tasks/' + id)
                    .then(response => {
                        const task = response.data
                        console.log(JSON.stringify(task))
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
                        res.end()
                    })
                    .catch(error => {
                        util.log(error)
                        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
                        res.end('Não foi possível remover a tarefa')
                    })
            }
            else {
                res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(util.errorPage(req.method + ' ' + req.url + ' não suportado neste serviço'))
            }
            break
        default:
            res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
            res.end(util.errorPage(req.method + " não suportado neste serviço"))
    }
})

toDoServer.listen(PORT)
util.log('Servidor à escuta na porta ' + PORT + '...')
