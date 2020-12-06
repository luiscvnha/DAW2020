var express = require('express')
var bodyParser = require('body-parser')
var templates = require('./html-templates')
var jsonfile = require('jsonfile')
var logger = require('morgan')
var fs = require('fs')

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

var app = express()

// set logger
app.use(logger('dev'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'))

app.get('/', function(req, res) {
    const d = new Date().toISOString().substring(0, 16)
    const files = jsonfile.readFileSync('./dbFiles.json')
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
    res.write(templates.fileList(files, d))
    res.end()
})

app.get('/files/upload', function(req, res) {
    const d = new Date().toISOString().substring(0, 16)
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
    res.write(templates.fileForm(d))
    res.end()
})

app.get('/files/download/:fname', (req, res) => {
    res.download('public/fileStore/' + req.params.fname)
})

app.post('/files', upload.array('myFile'), function(req, res) {
    const date = new Date().toISOString().substring(0, 16)
    const db = jsonfile.readFileSync('./dbFiles.json')

    const up = (file, desc) => {
        const oldPath = __dirname + '/' + file.path
        const newPath = __dirname + '/public/fileStore/' + file.originalname

        fs.rename(oldPath, newPath, (err) => { if (err) throw err })

        db.push(
            {
                date: date,
                name: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                desc: desc
            }
        )
        jsonfile.writeFileSync('./dbFiles.json', db)
    }

    if (req.files.length > 1) {
        for (let i = 0; i < req.files.length; ++i)
            up(req.files[i], req.body.desc[i])
    } else {
        up(req.files[0], req.body.desc)
    }

    res.redirect('/')
})

app.listen(7703, () => console.log('Servidor à escuta na porta 7703...'))
