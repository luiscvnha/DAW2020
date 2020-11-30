/**
 * Student controller
 */

var Student = require('../models/student')


module.exports.list = function() {
    return Student
        .find({}, { _id: 0 })
        .sort({ nome: 1 })
        .exec()
}

module.exports.lookUp = function(id) {
    return Student
        .findOne({ numero: id }, { _id: 0 })
        .exec()
}

module.exports.insert = function(entry) {
    const newStudent = new Student(entry)
    return newStudent.save()
}

module.exports.update = function(id, entry) {
    return Student
        .findOneAndUpdate(
            { numero: id },
            { nome: entry.nome, git: entry.git, tpc: entry.tpc },
            { useFindAndModify: false, new: true })
        .exec()
}

module.exports.remove = function(id) {
    return Student
        .deleteOne({ numero: id })
        .exec()
}
