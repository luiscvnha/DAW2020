//////////////////////////////
//    General Functions     //
//////////////////////////////

myDateTime = function() {
    var date = (new Date()).toISOString()
    return date.substring(0, 10) + ' ' + date.substring(11, 19)
}

exports.log = function(str) {
    console.log('[' + myDateTime() + '] ' + str)
}

//////////////////////////////
//           HTML           //
//////////////////////////////

exports.pageStart = pageStart = '\
<html lang="pt">\n\
<head>\n\
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n\
  <title>Escola de Música</title>\n\
</head>\n\
<body>\n'

exports.pageEnd = pageEnd = '\n\
</body>\n\
</html>'

exports.indexPage = 
    pageStart + '\
  <h2>Escola de Música</h2>\n\
  <ul>\n\
    <li><a href="/alunos">Lista de Alunos</a></li>\n\
    <li><a href="/cursos">Lista de Cursos</a></li>\n\
    <li><a href="/instrumentos">Lista de Instrumentos</a></li>\n\
  </ul>'
    + pageEnd

exports.errorPage = function(msg) {
    return pageStart + '\
  <h2>Erro :\'(</h2>\n\
  <h3>' + msg + '</h3>'
    + pageEnd
}
