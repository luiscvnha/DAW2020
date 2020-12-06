function showImage(name, type) {
    if (type == 'image/png' || type == 'image/jpeg')
        var ficheiro = '<img src="/fileStore/' + name + '" width="80%"/>'
    else
        var ficheiro = '<p>' + name + ', ' + type + '</p>'
    
    var fileObj = $(`
        <div class="w3-row w3-margin-bottom">
            <div class="w3-col s6">
                ${ficheiro}
            </div>

            <div class="w3-col s6 w3-border">
                <div style="padding: 10px">
                    <p>Filename: ${name}</p>
                    <p>Mimetype: ${type}</p>
                </div>
            </div>
        </div>
    `)
    
    var download = $('<a class="w3-btn w3-teal" href="/files/download/' + name + '">Download</a>')

    $('#display').empty()
    $('#display').append(fileObj, download)
    $('#display').modal()
}
