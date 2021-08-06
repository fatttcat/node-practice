<template>
  <div class="about">
    <h1>{{id ? '编辑' : '新建'}}分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="上级分类">
        <el-select v-model="form.parent" placeholder="请选择">
          <el-option
            v-for="item in parentCategories"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {},
      parentCategories: []
    }
  },
  created () {
    this.id && this.getDetail()
    this.getParentOptions()
  },
  methods: {
    async save() {
      let res
      if (this.id) {
        res = await this.$http.put(`/rest/categories/${this.id}`, this.form)
      } else {
        res = await this.$http.post('/rest/categories', this.form)
      }
      console.log(res)
      this.$router.push('/categories/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    async getDetail() {
      const res = await this.$http.get(`/rest/categories/${this.id}`)
      this.form = res.data
    },
    async getParentOptions() {
      const res = await this.$http.get(`/rest/categories`)
      this.parentCategories = res.data
      console.log(res)
    }
  }

}
</script>

<style>

</style>