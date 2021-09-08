module.exports = app => {
  const express = require('express')
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')
  const AdminUser = require('../../models/AdminUser')

  const router = express.Router({
    // 把url参数合并到router
    mergeParams: true
  })
  const Category = require('../../models/Category')
  // 保存
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  // 获取列表
  router.get('/', async (req, res) => {
    const queryOption = {}
    if(req.Model.modelName === 'Category') {
      queryOption.populate = 'parent'
    }
    const data = await req.Model.find().setOptions(queryOption).limit(10)
    res.send(data)
  })
  // 获取详情
  router.get('/:id',async (req, res) => {
    const data = await req.Model.findById(req.params.id).limit(10)
    res.send(data)
  })
  // 修改
  router.put('/:id',async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  // 删除
  router.delete('/:id',async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id)
    res.send({
      success: true
    })
  })
  // 获取上一级分类
  // router.delete('/categories/parent-options',async (req, res) => {
  //   const data = await Category.find().limit(10)
  //   res.send(data)
  // })
  // 登录校验中间件
  const authMiddleware = require('../../middleware/auth')
  const resourceMiddleware = require('../../middleware/resource')
  app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)

  const multer = require('multer')
  const upload = multer({ dest: __dirname + '/../../uploads' })
  app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = 'http://localhost:3000/uploads/' + file.filename
    res.send(file)
  })

  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body
    // 1.根据用户名找用户
    const user = await AdminUser.findOne({ username }).select('+password')
    assert(user, 422, '用户不存在')
    // if (!user) {
    //   return res.status(422).send({
    //     message: '用户不存在'
    //   })
    // }
    // 2.校验密码
    const isValid = require('bcrypt').compareSync(password, user.password)
    assert(isValid, 422, '密码错误')
    // if (!isValid) {
    //   return res.status(422).send({
    //     message: '密码错误'
    //   })
    // }
    // // 3.返回token
    const token = jwt.sign({id: user._id}, app.get('secret'))
    res.send({token})
  })

  // 错误处理
  app.use(async (err, req, res, next) => {
    console.log(err)
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}