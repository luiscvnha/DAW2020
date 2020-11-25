const fs = require('fs')
const util = require('./util.js')


exports.isStaticResource = isStaticResource
function isStaticResource(request) {
    switch (request.url) {
        case '/w3.css':
        case '/favicon.png':
        case '/client.js':
            return true
        default:
            return false
    }
}


exports.getStaticResource = getStaticResource
function getStaticResource(req, res) {
    let parts = req.url.split('/')
    const file = parts[parts.length-1]

    fs.readFile('public/' + file, (error, data) => {
        if (error) {
            util.log('Erro: ficheiro não encontrado (' + error + ')')
            res.statusCode = 404
            res.end()
        }
        else {
            res.statusCode = 200
            if (file === '/favicon.ico')
                res.setHeader('Content-Type', 'image/x-icon')
            res.end(data)
        }
    })
}
