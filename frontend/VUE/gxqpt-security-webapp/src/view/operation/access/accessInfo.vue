<template>
  <Layout>
    <Content>
      <Breadcrumb>
        <BreadcrumbItem>接入管理</BreadcrumbItem>
        <BreadcrumbItem>部署信息</BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <Form
          ref="formValidate"
          inline
          :label-width="100"
          :model="searchCondition">
          <FormItem label="使用主机：">
            <Input v-model="searchCondition.hostName" style="width:200px" />
            <!--<Select v-model="searchCondition.hostId" style="width:200px">
              <Option v-for="item in serverList" :value="item.hostId" :key="item.hostId">{{item.hostName}}</Option>
            </Select>-->
          </FormItem>
          <FormItem :label-width="20">
            <Button type="primary" @click="preSearch">查询</Button>
            <router-link to="/accessList">
              <Button type="primary">返回</Button>
            </router-link>
          </FormItem>
        </Form>
        <hy-table
          highlight-row
          border
          :current="pageInfo.pageNo"
          :columns="tableList.columns"
          :data="tableList.data"
          :total="Number(pageInfo.total)"
          pageType="small"
          show-elevator
          show-sizer
          class="access-list"
          @on-page-change="pageChange" />
        <Modal
          v-model="showDetail"
          :mask-closable="false"
          title="部署内容详情">
          <Form
          :label-width="100"
          :model="details">
            <FormItem label="所属应用：">
              <Input
                type="text"
                :value="details.appName"
                disabled>
              </Input>
            </FormItem>
            <FormItem label="使用主机：">
              <Input
                type="text"
                :value="details.hostName"
                disabled>
              </Input>
            </FormItem>
            <FormItem label="部署目录：">
              <Input
                type="text"
                :value="details.installPath"
                disabled>
              </Input>
            </FormItem>
            <FormItem label="分配内存：">
              <Input
                type="text"
                :value="`${details.mem}MB`"
                disabled>
              </Input>
            </FormItem>
            <FormItem label="分配硬盘：">
              <Input
                type="text"
                :value="`${details.harddisk}MB`"
                disabled>
              </Input>
            </FormItem>
            <FormItem label="访问地址：">
              <Input
                type="text"
                :value="details.indexUrl"
                disabled>
              </Input>
            </FormItem>
            <FormItem label="状态：">
              <Input
                type="text"
                :value="details.statusText"
                disabled>
              </Input>
            </FormItem>
            <FormItem label="版本：">
              <Input
                type="text"
                :value="details.version"
                disabled>
              </Input>
            </FormItem>
            <FormItem label="备注：">
              <Input
                type="text"
                :value="details.remark"
                disabled>
              </Input>
            </FormItem>
          </Form>
          <Button type="primary" slot="footer" @click="showDetail = false">关闭</Button>
        </Modal>
      </Card>
    </Content>
  </Layout>
</template>

<script>
import api from '@/api/axiosApi'
import operationApiList from '@/api/operationApiList'

function defaultDisplay(h, params, key) {
  return h('span', params.row[key] || '--')
}
export default {
  data () {
    const slgLineStyle =  {
      maxHeight: '36px',
      overflow: 'hidden',
      margin: '10px 0',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
    return {
      searchCondition: {
        // 使用主机id
        hostName: ''
      },
      pageInfo: {
        pageNo: 0,
        pageSize: 10,
        total: 0
      },
      tableList: {
        columns: [{
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center'
        },
        {
          title: '使用主机',
          key: 'hostName',
          render: (h, params) => {
            return defaultDisplay(h, params, 'hostName')
          }
        },
        {
          title: '分配内存(MB)',
          key: 'mem',
          render: (h, params) => {
            return defaultDisplay(h, params, 'mem')
          }
        },
        {
          title: '分配硬盘(MB)',
          key: 'harddisk',
          render: (h, params) => {
            return defaultDisplay(h, params, 'harddisk')
          }
        },
        {
          title: '部署时间',
          key: 'createTime',
          render: (h, params) => {
            if (params.row.createTime) {
              const time = new Date(params.row.createTime)
              return h('span', `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`)
            }
          }
        },
        {
          title: '备注',
          key: 'remark',
          render: (h, params) => {
            const html = params.row.remark || '--'
            return h('div', {
                style: {...slgLineStyle},
                attrs: {
                  title: html
                }
            },html)
          }
        },
        {
          title: '操作',
          key: 'address',
          render: (h, params) => {
            const vm = this
            const id = params.row.id
            return h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click () {
                  vm.showDetails(id)
                }
              }
            }, '详情')
          }
        }],
        data: []
      },
      serverList: [],
      showDetail: false,
      details: {}
    }
  },
  methods: {
    preSearch() {
      this.pageInfo.pageNo = 1
      this.search()
    },
    pageChange(pageNo, pageSize) {
      this.pageInfo.pageNo = pageNo
      this.pageInfo.pageSize = pageSize
      this.search()
    },
    // 获取主机列表
    getHostName() {
      const vm = this
      api(operationApiList.getHostName)
      .then(res => {
        if (res.data.errcode === 0) {
          vm.serverList = res.data.data
        }
      }, error => {console.log(error)})
    },
    // 获取部署信息的列表
    search () {
      const vm = this
      api(operationApiList.hostInstallPage, {
        data: {
          appId: vm.$route.query.id,
          ...vm.searchCondition
        },
        pageNo: vm.pageInfo.pageNo,
        pageSize: vm.pageInfo.pageSize
      }).then(res => {
        if (res.data.errcode === 0) {
          const result = res.data.data
          vm.pageInfo.pageNo = result.pageNum
          vm.pageInfo.total = result.total
          vm.tableList.data = result.list
        }
      }, error => {console.log(error)})
    },
    // 弹出框显示详情
    showDetails (id) {
      const vm = this
      vm.showDetail = true
      api(operationApiList.hostInstallGetDetail, {
        id: id
      }).then(res => {
        if (res.data.errcode === 0) {
          vm.details = res.data.data
          let statusText = '--'
          switch (String(vm.details.status)) {
            case '1':
              statusText = '故障中'
              break
            case '2':
              statusText = '升级中'
              break
            case '3':
              statusText = '运行中'
              break
          }
          vm.details.statusText = statusText
        }
      }, error => {console.log(error)})
    }
  },
  mounted () {
    this.getHostName()
    this.search()
  }
}
</script>
