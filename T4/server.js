var http = require('http')
var fs = require('fs')

const PORT = 7777
const CONTENT_TYPE = 'text/html; charset=utf-8'

errorPage = function(msg) {
  return '\
<html lang=\"pt\">\n\
  <head>\n\
    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n\
    <title>Erro</title>\n\
  </head>\n\
  <body>\n\
    <h3>' + msg + '</h3>\n\
  </body>\n\
</html>'
}

myDateTime = function() {
  var date = (new Date()).toISOString()
  return date.substring(0, 10) + ' ' + date.substring(11, 19)
}

log = function(str) {
  console.log('[' + myDateTime() + '] ' + str)
}

http.createServer(function (req, res) {
  log(req.method + ': ' + req.url)

  if (req.url.match(/\/$/)) {
    fs.readFile('site/index.html', function(err, data) {
      res.writeHead(200, {'Content-Type': CONTENT_TYPE})
      res.write(data)
      res.end()
    })

  } else if (req.url.match(/\/arqs\/d1e[0-9]{1,4}$/)) {
    var id = req.url.split('/')[2]
    fs.readFile('site/arqs/arq-' + id + '.html', function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': CONTENT_TYPE})
        res.write(errorPage('O arquivo não existe.'))
      } else {
        res.writeHead(200, {'Content-Type': CONTENT_TYPE})
        res.write(data)
      }
      res.end()
    })

  } else {
    res.writeHead(404, {'Content-Type': CONTENT_TYPE})
    res.write(errorPage('O URL não corresponde ao esperado.'))
    res.end()
  }

}).listen(PORT)

log('Servidor à escuta na porta ' + PORT + '...')
