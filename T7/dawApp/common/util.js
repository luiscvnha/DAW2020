/**
 * Devolve a data e hora no formato "YYYY-MM-DD HH:MM:SS"
 */

function dateTime() {
    const date = (new Date()).toISOString()
    return date.substring(0, 10) + ' ' + date.substring(11, 19)
}

module.exports.dateTime = dateTime
