const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)

const hashPassword = (password) => {
   const hash = bcrypt.hashSync(password, salt)
   return hash
}

const checkHashedPassword = (password, hashPassword) => {
   const passwd = bcrypt.compareSync(password, hashPassword)
   return passwd
}

module.exports = {
   hashPassword,
   checkHashedPassword
}