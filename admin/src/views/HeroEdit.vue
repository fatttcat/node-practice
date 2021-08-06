<template>
  <div class="about">
    <h1>{{id ? '编辑' : '新建'}}英雄</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-tabs value="skills" type="border-card">
        <el-tab-pane label="基本信息" name="basic">
          <el-form-item label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="称号">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="form.categories" placeholder="请选择" multiple>
              <el-option
                v-for="item in categories"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难度">
            <el-rate :max="9" show-score v-model="form.scores.difficult" style="margin-top: .6rem"></el-rate>
          </el-form-item>
          <el-form-item label="技能">
            <el-rate :max="9" show-score v-model="form.scores.skill" style="margin-top: .6rem"></el-rate>
          </el-form-item>
          <el-form-item label="攻击">
            <el-rate :max="9" show-score v-model="form.scores.attack" style="margin-top: .6rem"></el-rate>
          </el-form-item>
          <el-form-item label="生存">
            <el-rate :max="9" show-score v-model="form.scores.survive" style="margin-top: .6rem"></el-rate>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              :action="$http.defaults.baseURL + '/upload'"
              :show-file-list="false"
              :on-success="handleSuccess"
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="顺风出装">
            <el-select v-model="form.items1" placeholder="请选择" multiple>
              <el-option
                v-for="item in items"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="逆风出装">
            <el-select v-model="form.items2" placeholder="请选择" multiple>
              <el-option
                v-for="item in items"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用技巧">
            <el-input type="textarea" v-model="form.usageTips"></el-input>
          </el-form-item>
          <el-form-item label="对抗技巧">
            <el-input type="textarea" v-model="form.battleTips"></el-input>
          </el-form-item>
          <el-form-item label="团战思路">
            <el-input type="textarea" v-model="form.teamTips"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="技能" name="skills">
          <el-button type="text" @click="form.skills.push({})"><i class="el-icon-plus"></i>添加技能</el-button>
          <el-row type="flex" style="flex-wrap: wrap;">
            <el-col :md="12" v-for="(item, index) in form.skills" :key="index">
              <el-form-item label="名称">
                <el-input v-model="item.name"></el-input>
              </el-form-item>
              <el-form-item label="图标">
                <el-upload
                  class="avatar-uploader"
                  :action="$http.defaults.baseURL + '/upload'"
                  :show-file-list="false"
                  :on-success="res => $set(item, 'icon', res.url)"
                >
                  <img v-if="item.icon" :src="item.icon" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="描述">
                <el-input type="textarea" v-model="item.description"></el-input>
              </el-form-item>
              <el-form-item label="小提示">
                <el-input type="textarea" v-model="item.tips"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="danger" @click="form.skills.splice(index, 1)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
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
        name: '',
        avatar: '',
        title: '',
        categories: [],
        scores: {
          difficult: 0
        },
        skills: []
      },
      categories: [],
      items: []
    }
  },
  created () {
    this.id && this.getDetail()
    this.getCategories()
    this.getItems()
  },
  methods: {
    handleSuccess (val) {
      this.form.avatar = val.url
    },
    async save () {
      let res
      if (this.id) {
        res = await this.$http.put(`/rest/heroes/${this.id}`, this.form)
      } else {
        res = await this.$http.post('/rest/heroes', this.form)
      }
      console.log(res)
      this.$router.push('/heroes/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    async getDetail () {
      const res = await this.$http.get(`/rest/heroes/${this.id}`)
      this.form = res.data
    },
    async getCategories() {
      const res = await this.$http.get('/rest/categories')
      this.categories = res.data
    },
    async getItems() {
      const res = await this.$http.get('/rest/items')
      this.items = res.data
    }
  }

}
</script>

<style scoped>
  >>>.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>