const express = require('express')

const app = express()

// 要写在注册路由的前面
app.use(require('cors')())
app.use(express.json())
app.use('/uploads',express.static(__dirname + '/uploads'))

require('./plugins/db')(app)
require('./routes/admin/index')(app)

app.listen(3000, () => {
  console.log('running')
})