var express = require('express')
var router = express.Router()
var Student = require('../controllers/student')
var {dateTime} = require('../common/util')

/**
 * GET /
 */

router.get('/', function(req, res) {
    Student.list()
        .then(data => res.render('index', {
            date: dateTime(),
            list: data
        }))
        .catch(err => res.render('error', {
            date: dateTime(),
            error: err
        }))
})

/**
 * GET /alunos
 */

router.get('/alunos', function(req, res) {
    Student.list()
        .then(ans => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
            res.end(JSON.stringify(ans))
        })
        .catch(err => {
            res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
            res.end('Não foi possível obter a lista de alunos')
        })
})

/**
 * GET /alunos/:id
 */

router.get('/alunos/:id', function(req, res) {
    Student.lookUp(req.params.id)
        .then(ans => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
            res.end(JSON.stringify(ans))
        })
        .catch(err => {
            res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
            res.end('Não foi possível obter o aluno')
        })
})

/**
 * POST /alunos
 */

router.post('/alunos', function(req, res) {
    Student.lookUp(req.body.numero)
        .then(s => {
            if (s == null) {
                Student.insert(req.body)
                    .then(ans => {
                        res.writeHead(201, {'Content-Type': 'application/json; charset=utf-8'})
                        res.end(JSON.stringify(ans))
                    })
                    .catch(err => {
                        res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
                        res.end('Não foi possível adicionar o aluno')
                    })
            } else {
                res.writeHead(409, {'Content-Type': 'text/plain; charset=utf-8'})
                res.end('Já existe um aluno com o número "' + req.body.numero + '"')
            }
        })
        .catch(e => {
            res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
            res.end('Não foi possível adicionar o aluno')
        })
})

/**
 * PUT /alunos/:id
 */

router.put('/alunos/:id', function(req, res) {
    Student.update(req.params.id, req.body)
        .then(ans => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
            res.end(JSON.stringify(ans))
        })
        .catch(err => {
            res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
            res.end('Não foi possível atualizar o aluno')
        })
})

/**
 * DELETE /alunos/:id
 */

router.delete('/alunos/:id', function(req, res) {
    Student.remove(req.params.id)
        .then(ans => {
            res.writeHead(200)
            res.end()
        })
        .catch(err => {
            res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
            res.end('Não foi possível eliminar o aluno')
        })
})


module.exports = router
