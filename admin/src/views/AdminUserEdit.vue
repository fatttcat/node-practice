<template>
  <div class="about">
    <h1>{{id ? '编辑' : '新建'}}管理员</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.password"></el-input>
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
  },
  methods: {
    async save() {
      let res
      if (this.id) {
        res = await this.$http.put(`/rest/adminUsers/${this.id}`, this.form)
      } else {
        res = await this.$http.post('/rest/adminUsers', this.form)
      }
      console.log(res)
      this.$router.push('/admin_user/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    async getDetail() {
      const res = await this.$http.get(`/rest/adminUsers/${this.id}`)
      this.form = res.data
    }
  }

}
</script>

<style>

</style>