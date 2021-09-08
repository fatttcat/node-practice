<template>
  <div>
    <h1>分类列表</h1>
    <el-table :data="tableData">
      <el-table-column prop="_id" label="ID" width="220" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteItem(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await this.$http.get('/rest/adminUsers')
      this.tableData = res.data
      console.log(res)
    },
    editItem (row) {
      this.$router.push(`/admin_user/list/${row._id}`)
    },
    async deleteItem (id) {
       this.$confirm('是否确定要删除该分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$http.delete(`/rest/adminUsers/${id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList()
        })
    }
  }
}
</script>