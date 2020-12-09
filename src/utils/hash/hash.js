const bcrypt = require('bcryptjs')

class Hash {
  async generateHash (field) {
    return await bcrypt.hash(field, 10)
  }

  async compareHash (field, secondField) {
    return await bcrypt.compare(field, secondField)
  }
}

module.exports = Hash
