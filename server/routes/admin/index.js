module.exports = app => {
  const express = require('express')
  const router = express.Router({
    // 把url参数合并到router
    mergeParams: true
  })
  const Category = require('../../models/Category')
  // 保存
  router.post('/',async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  // 获取列表
  router.get('/',async (req, res) => {
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
  app.use('/admin/api/rest/:resource',async (req, res, next) => {
    const modelName = require('inflection').classify(req.params.resource)
    req.Model = require(`../../models/${modelName}`)
    next()
  }, router)

  const multer = require('multer')
  const upload = multer({ dest: __dirname + '/../../uploads' })
  app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = 'http://localhost:3000/uploads/' + file.filename
    res.send(file)
  })
}