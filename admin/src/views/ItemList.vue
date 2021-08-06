<template>
  <div>
    <h1>物品列表</h1>
    <el-table :data="tableData">
      <el-table-column prop="_id" label="ID" width="220" />
      <el-table-column prop="name" label="物品名称" />
      <el-table-column prop="icon" label="图标">
        <template slot-scope="scope">
          <img v-if="scope.row.icon" :src="scope.row.icon" alt="" style="height: 3em;">
        </template>
      </el-table-column>
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
      const res = await this.$http.get('/rest/items')
      this.tableData = res.data
      console.log(res)
    },
    editItem (row) {
      this.$router.push(`/items/list/${row._id}`)
    },
    async deleteItem (id) {
       this.$confirm('是否确定要删除该分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$http.delete(`/rest/items/${id}`)
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