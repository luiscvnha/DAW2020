var http = require('http')
var url = require('url')
var axios = require('axios')
var aux = require('./_aux.js')

const PORT = 4000
const HEADERS = {'Content-Type': 'text/html; charset=utf-8'}


writeNavigation = function(res, nav, page) {
    var currPageNum = 1
    var lastPageNum = 1
    nav.forEach(link => {
        pageNum = parseInt(link.split('_page=')[1].split('>')[0])
        rel = link.split('rel="')[1].split('"')[0]
        if (rel == 'first') rel = 'Primeira'
        else if (rel == 'last') {rel = 'Última'; lastPageNum = pageNum;}
        else if (rel == 'next') rel = 'Próxima'
        else if (rel == 'prev') {rel = 'Anterior'; currPageNum += pageNum;}
        res.write('  [<a href="'+page+'?page='+pageNum+'">'+rel+'</a>]\n')
    })
    res.write('  --- Página: ' + currPageNum + '/' + lastPageNum + '\n')
    res.write('  <br/>\n')
    res.write('  <br/>\n')
}

http.createServer((req, res) => {
    aux.log(req.method + ': ' + req.url)

    if (req.method == 'GET') {
        if (req.url == '/') {
            res.writeHead(200, HEADERS)
            res.write(aux.indexPage)
            res.end()
        }
        else if (req.url.match(/\/alunos(\?page=[0-9]+)?$/)) {
            var page = url.parse(req.url, true).query.page
            if (page == undefined) page = 1
            axios.get('http://localhost:3001/alunos?_sort=id&_page=' + page)
                .then(resp => {
                    alunos = resp.data
                    nav = resp.headers.link.split(',')
                    res.writeHead(200, HEADERS)
                    res.write(aux.pageStart)
                    res.write('  <h2>Escola de Música: Lista de Alunos</h2>\n')
                    res.write('  <ul>\n')
                    alunos.forEach(a => 
                        res.write('    <li><a href="/alunos/'+a.id+'">'+a.id+' - '+a.nome+'</a></li>\n'))
                    res.write('  </ul>\n')
                    writeNavigation(res, nav, '/alunos')
                    res.write('  [<i><a href="/">Voltar</a></i>]')
                    res.write(aux.pageEnd)
                    res.end()
                })
                .catch(error => {
                    aux.log('Erro na obtenção da lista de alunos ('+error+')')
                    res.writeHead(404, HEADERS)
                    res.write(aux.errorPage('Erro a obter a lista de alunos'))
                    res.end()
                })
        }
        else if (req.url.match(/\/cursos(\?page=[0-9]+)?$/)) {
            var page = url.parse(req.url, true).query.page
            if (page == undefined) page = 1
            axios.get('http://localhost:3001/cursos?_sort=id&_page=' + page)
                .then(resp => {
                    cursos = resp.data
                    nav = resp.headers.link.split(',')
                    res.writeHead(200, HEADERS)
                    res.write(aux.pageStart)
                    res.write('  <h2>Escola de Música: Lista de Cursos</h2>\n')
                    res.write('  <ul>\n')
                    cursos.forEach(c =>
                        res.write('    <li><a href="/cursos/'+c.id+'">'+c.id+' - '+c.designacao+'</a></li>\n'))
                    res.write('  </ul>\n')
                    writeNavigation(res, nav, '/cursos')
                    res.write('  [<i><a href="/">Voltar</a></i>]')
                    res.write(aux.pageEnd)
                    res.end()
                })
                .catch(error => {
                    aux.log('Erro na obtenção da lista de cursos ('+error+')')
                    res.writeHead(404, HEADERS)
                    res.write(aux.errorPage('Erro a obter a lista de cursos'))
                    res.end()
                })
        }
        else if (req.url.match(/\/instrumentos(\?page=[0-9]+)?$/)) {
            var page = url.parse(req.url, true).query.page
            if (page == undefined) page = 1
            axios.get('http://localhost:3001/instrumentos?_sort=id&_page=' + page)
                .then(resp => {
                    instrumentos = resp.data
                    nav = resp.headers.link.split(',')
                    res.writeHead(200, HEADERS)
                    res.write(aux.pageStart)
                    res.write('  <h2>Escola de Música: Lista de Instrumentos</h2>\n')
                    res.write('  <ul>\n')
                    instrumentos.forEach(i =>
                        res.write('    <li><a href="/instrumentos/'+i.id+'">'+i.id+'</a></li>\n'))
                    res.write('  </ul>\n')
                    writeNavigation(res, nav, '/instrumentos')
                    res.write('  [<i><a href="/">Voltar</a></i>]')
                    res.write(aux.pageEnd)
                    res.end()
                })
                .catch(error => {
                    aux.log('Erro na obtenção da lista de instrumentos ('+error+')')
                    res.writeHead(404, HEADERS)
                    res.write(aux.errorPage('Erro a obter a lista de instrumentos'))
                    res.end()
                })
        }
        else if (req.url.match(/\/alunos\/A(E-)?[0-9]{3,5}$/)) {
            var id = req.url.split('/')[2]
            axios.get('http://localhost:3001/alunos/' + id)
                .then(resp => {
                    aluno = resp.data
                    res.writeHead(200, HEADERS)
                    res.write(aux.pageStart)
                    res.write('  <h2>Escola de Música: Aluno</h2>\n')
                    res.write('  <p>ID: ' + aluno.id + '</p>\n')
                    res.write('  <p>Nome: ' + aluno.nome + '</p>\n')
                    res.write('  <p>Data de Nascimento: ' + aluno.dataNasc + '</p>\n')
                    res.write('  <p>Curso: <a href="/cursos/'+aluno.curso+'">'+aluno.curso+'</a></p>\n')
                    res.write('  <p>Ano: ' + aluno.anoCurso + '</p>\n')
                    res.write('  <p>Instrumento: ' + aluno.instrumento + '</p>\n')
                    res.write('  [<i><a href="/alunos">Voltar</a></i>]')
                    res.write(aux.pageEnd)
                    res.end()
                })
                .catch(error => {
                    aux.log('Erro na obtenção do aluno '+id+' ('+error+')')
                    res.writeHead(404, HEADERS)
                    res.write(aux.errorPage('Erro a obter o aluno '+id))
                    res.end()
                })
        }
        else if (req.url.match(/\/cursos\/C[BS][0-9]{1,2}$/)) {
            var id = req.url.split('/')[2]
            axios.get('http://localhost:3001/cursos/' + id)
                .then(resp => {
                    curso = resp.data
                    res.writeHead(200, HEADERS)
                    res.write(aux.pageStart)
                    res.write('  <h2>Escola de Música: Curso</h2>\n')
                    res.write('  <p>ID: ' + curso.id + '</p>\n')
                    res.write('  <p>Designação: ' + curso.designacao + '</p>\n')
                    res.write('  <p>Duração: ' + curso.duracao + '</p>\n')
                    res.write('  <p>Instrumento: <a href="/instrumentos/'+curso.instrumento.id+'">'+curso.instrumento.id+'</a></p>\n')
                    res.write('  [<i><a href="/cursos">Voltar</a></i>]')
                    res.write(aux.pageEnd)
                    res.end()
                })
                .catch(error => {
                    aux.log('Erro na obtenção do curso '+id+' ('+error+')')
                    res.writeHead(404, HEADERS)
                    res.write(aux.errorPage('Erro a obter o curso '+id))
                    res.end()
                })
        }
        else if (req.url.match(/\/instrumentos\/[IX][0-9]{1,2}$/)) {
            var id = req.url.split('/')[2]
            axios.get('http://localhost:3001/instrumentos/' + id)
                .then(resp => {
                    instrumento = resp.data
                    res.writeHead(200, HEADERS)
                    res.write(aux.pageStart)
                    res.write('  <h2>Escola de Música: Instrumento</h2>\n')
                    res.write('  <p>ID: ' + instrumento.id + '</p>\n')
                    res.write('  <p>Nome: ' + instrumento['#text'] + '</p>\n')
                    res.write('  [<i><a href="/instrumentos">Voltar</a></i>]')
                    res.write(aux.pageEnd)
                    res.end()
                })
                .catch(error => {
                    aux.log('Erro na obtenção do instrumento '+id+' ('+error+')')
                    res.writeHead(404, HEADERS)
                    res.write(aux.errorPage('Erro a obter o instrumento '+id))
                    res.end()
                })
        }
        else {
            res.writeHead(404, HEADERS)
            res.write(aux.errorPage('Pedido não suportado ('+req.method+': '+req.url+')'))
            res.end()
        }
    }
    else {
        res.writeHead(404, HEADERS)
        res.write(aux.errorPage('Pedido não suportado ('+req.method+': '+req.url+')'))
        res.end()
    }

}).listen(PORT)

aux.log('Servidor à escuta na porta ' + PORT + '...')
