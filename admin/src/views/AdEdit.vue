<template>
  <div class="about">
    <h1>{{id ? '编辑' : '新建'}}广告位</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="广告">
        <el-button type="text" @click="form.items.push({})"><i class="el-icon-plus"></i>添加广告</el-button>
        <el-row type="flex" style="flex-wrap: wrap;">
          <el-col :md="12" v-for="(item, index) in form.items" :key="index">
            <el-form-item label="跳转链接">
              <el-input v-model="item.url"></el-input>
            </el-form-item>
            <el-form-item label="图标">
              <el-upload
                class="avatar-uploader"
                :action="$http.defaults.baseURL + '/upload'"
                :show-file-list="false"
                :on-success="res => $set(item, 'image', res.url)"
              >
                <img v-if="item.image" :src="item.image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="danger" @click="form.items.splice(index, 1)">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
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
      form: {
        items: []
      },
    }
  },
  created () {
    this.id && this.getDetail()
  },
  methods: {
    async save() {
      let res
      if (this.id) {
        res = await this.$http.put(`/rest/ads/${this.id}`, this.form)
      } else {
        res = await this.$http.post('/rest/ads', this.form)
      }
      console.log(res)
      this.$router.push('/ad/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    async getDetail() {
      const res = await this.$http.get(`/rest/ads/${this.id}`)
      this.form = Object.assign({}, this.form, res.data)
    }
  }

}
</script>

<style>

</style>