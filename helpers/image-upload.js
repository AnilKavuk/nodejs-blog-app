const multer = require("multer")
const path = require('path');
const generateName = require("./random-generate-name");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/')
    },
    filename: (req, file, cb) => {
        cb(null, generateName(6) + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

module.exports.upload = upload              
