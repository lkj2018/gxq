<template>
	<Modal title="服务报告" width="720" v-model="showModal" :mask-closable="false">
		<div style="text-align:center">
			<Form ref="detail" :model="detail" :label-width="100" class="clearfix">
				<Row :gutter="40">
					<Col span="24">
					<FormItem label="时间：">
						<Input v-model="detail.reportTime" disabled></Input>
					</FormItem>
					</Col>
					<Col span="24">
					<FormItem label="服务过程：">
						<Input v-model="detail.serviceProcess" type="textarea" :autosize="{minRows: 2,maxRows: 5}" disabled></Input>
					</FormItem>
					</Col>
					<Col span="24">
					<FormItem label="结果：">
						<Input v-model="detail.result" type="textarea" :autosize="{minRows: 2,maxRows: 5}" disabled></Input>
					</FormItem>
					</Col>
					<Col span="24">
					<FormItem label="备注：">
						<Input v-model="detail.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" disabled></Input>
					</FormItem>
					</Col>
					<Col span="24">
					<FormItem label="服务报告：">
						<Row class="marginBottom" v-for="fileItem in detail.fileDTOS" :key="fileItem.id" v-if="fileItem.bussType=='service_report'">
							<Col span="20">
								<Input :value="fileItem.fileName" disabled></Input>
							</Col>
							<Col span="4">
							<Button type="primary" @click="downloadFile(fileItem.fileUrl,fileItem.fileName)" style="float: right;">下载</Button>
							</Col>
						</Row>
						<Input v-if="isShowReport" value="无附件" disabled></Input>
					</FormItem>
					</Col>
					<Col span="24">
						<FormItem label="服务成果：">
							<Row class="marginBottom" v-for="fileItem in detail.fileDTOS" :key="fileItem.id" v-if="fileItem.bussType=='service_result'">
								<Col span="20">
									<Input :value="fileItem.fileName" disabled></Input>
								</Col>
								<Col span="4">
									<Button type="primary" @click="downloadFile(fileItem.fileUrl,fileItem.fileName)" style="float: right;">下载</Button>
								</Col>
							</Row>
							<Input v-if="isShowResult" value="无附件" disabled></Input>
						</FormItem>
					</Col>
				</Row>
			</Form>
		</div>
		<div slot="footer" style="text-align: center;">
			<Button type="default" @click="showModal = false">关闭</Button>
		</div>
	</Modal>
</template>

<script>
	import api from '@/api/axiosApi'
	import operationApiList from '@/api/operationApiList'

	export default {
		data() {
			return {
				showModal: false,
				detail: {},
				isShowReport: true,
				isShowResult: true,
			}
		},
		methods: {
			// 打开弹窗的方法
			open(id) {
				this.getDetail(id)
				this.showModal = true
				this.isShowReport = true
				this.isShowResult = true
			},
			getDetail(id) {
				const vm = this
				api(operationApiList.getServiceDetailById, {
						id: id
					})
					.then(res => {
						if(res.data.errcode === 0) {
							vm.detail = res.data.data;
							if(vm.detail.fileDTOS.length>0){
								let fileArray = vm.detail.fileDTOS;
								for(let i in fileArray){
									if(fileArray[i].bussType=='service_result'){
										vm.isShowResult=false;
									};
									if(fileArray[i].bussType=='service_report'){
										vm.isShowReport=false;
									};
								}
							}
						}
					}, error => {
						console.log(error)
					})
			},
			downloadFile(url,filename){
				let urlDownload = "/api/file/file/download?url=" + url + "&filename=" + filename;
				window.open(urlDownload);
			},
		}
	}
</script>

<style lang="less" scoped>
	.download,
	.download:hover {
		width: 100px;
		height: 32px;
		line-height: 30px;
		color: #fff;
		float: left;
		background: #5cadff;
	}
	.marginBottom{
		margin-bottom: 10px;
	}
</style>