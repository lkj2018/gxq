<template>
	<Layout>
		<Content>
			<Breadcrumb>
				<BreadcrumbItem>安全保障平台</BreadcrumbItem>
				<BreadcrumbItem>程序发布管理</BreadcrumbItem>
				<BreadcrumbItem>发布新版本</BreadcrumbItem>
			</Breadcrumb>
			<Card>
				<Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
					<FormItem label="系统名称：" prop="name">
						<Select v-model="formData.name">
							<Option v-for="(name, idx) in visibleForSelf" :value="name.name" :key="idx">{{name.name}}</Option>
						</Select>
					</FormItem>
					<FormItem label="版本号：" prop="versionId">
						<Input v-model="formData.versionId" :maxlength="50"></Input>
					</FormItem>
					<FormItem label="版本名称：" prop="versionName">
						<Input v-model="formData.versionName" :maxlength="100"></Input>
					</FormItem>
					<FormItem label="发布服务器：" prop="serverIp">
						<Input v-model="formData.serverIp"></Input>
					</FormItem>
					<FormItem label="发布文件" prop="file">
						<!--<hy-upload ref="uploadFile" :format="['apk']" :on-format-error="formatErrorFun" :on-success="setFile" :on-remove="removeFile" :before-upload="beforeUpload"></hy-upload>-->
						<hy-upload ref="uploadFile" :on-success="setFile" :on-remove="removeFile" :before-upload="beforeUpload" :format="['jar','html','css', 'js','jpg', 'png', 'mp3','mp4']"></hy-upload>
					</FormItem>
				</Form>
				<Form ref="upgradeConentData" :model="formData" :rules="ruleValidate" :label-width="100">
					<FormItem label="升级内容：" prop="upgradeConent">
						<Row>
							<Col span="24">
							<UE v-on:editorUpdate="editorUpdate" :defaultMsg="defaultMsg" :config="config" :id="ue1" ref="ue"></UE>
							</Col>
						</Row>
					</FormItem>
				</Form>
				<Row>
					<Col span="24" class="text-center">
					<Button type="default" size="large" @click="goBack">取消</Button>
					<Button type="primary" size="large" style="margin-left: 20px;" @click="validateForm">确定</Button>
					</Col>
				</Row>
			</Card>
		</Content>
	</Layout>
</template>

<script>
	import UE from '@/components/ue/ue'
	import api from '@/api/axiosApi'
	import apiList from '@/api/securityApiList'
	import hyUpload from '@/components/hengyun/hyUpload'
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				// systemNames: [],
				formData: {},
				ruleValidate: {
					name: [{
						required: true,
						message: '系统名称不可以为空',
						trigger: 'blur'
					}],
					versionId: [{
						required: true,
						message: '版本号不可以为空',
						trigger: 'blur'
					}],
					versionName: [{
						required: true,
						message: '版本名称不可以为空',
						trigger: 'blur'
					}],
					serverIp: [{
						required: true,
						message: '发布服务器不可以为空',
						trigger: 'blur'
					}, {
						message: 'ip地址不合法',
						trigger: 'blur',
						validator (rule, value, callback) {
							if (value.match(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/)) {
								callback()
							} else {
								callback(new Error('ip地址不合法'))
							}
						}
					}],
					file: [{
						required: true,
						message: '发布文件不可以为空',
						trigger: 'blur'
					}],
					upgradeConent: [{
						required: true,
						message: '升级内容不可以为空',
						trigger: 'change'
					}],
				},
				defaultMsg: '',
				config: {
					initialFrameWidth: null,
					initialFrameHeight: 350
				},
				ue1: "ue1", // 不同编辑器必须不同的id
			}
		},
		components: {
			UE,
			hyUpload
		},
		computed: {
			...mapState([
				'visibleForSelf'
			])
		},
		methods: {
			editorUpdate(dataString) {
				this.formData.upgradeConent = dataString;
				this.$refs['upgradeConentData'].validate((valid) => {});
			},
			getUEContent() { //获取富文本框内容
				this.formData.upgradeConent = this.$refs.ue.getUEContent(); // 调用子组件方法
			},
			getUEContentTxt() { //获取富文本框纯文本内容
				let content = this.$refs.ue.getUEContentTxt(); // 调用子组件方法
				return
			},
			setFile(response, file, fileList) {
				this.formData.upgradeFileId = response.data.list[0].id;
				this.formData.upgradeFileName = response.data.list[0].submittedFileName;
				this.formData.upgradeFileUrl = response.data.list[0].url;
				this.formData.file = 'ok';
				this.validForm();
				this.$Message.success('上传成功!');
			},
			removeFile(file, fileList) {
				if(!fileList.length) {
					this.formData.file = '';
				}
				this.validForm();
			},
			save() {
				api(apiList.CreateProgram, this.formData).then((res) => {
					console.log(res);
					if(res.status = 200) {
						this.$router.push('/programRelease');
					}
				}, (err) => {
					//dong something...
				})
			},
			beforeUpload(file, fileList) {
				this.$refs.uploadFile.$children[0].clearFiles();
				this.formData.file = '';
			},
			validateForm() {
				this.getUEContent();
				let formDataIsTrue = false;
				let upgradeConentDataIsTrue = false;
				this.$refs['formData'].validate((valid) => {
					if(valid) {
						formDataIsTrue=true;
					}
				});
				this.$refs['upgradeConentData'].validate((valid) => {
					if(valid) {
						upgradeConentDataIsTrue=true;
					}
				});
				if(formDataIsTrue && upgradeConentDataIsTrue){
					this.save();
				};
			},
			formatErrorFun (file, fileList) {
			  this.$Message.error('文件类型错误，请上传apk类型的文件!');
			},
			validForm() {
				this.$refs['formData'].validate();
			},
			goBack() {
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang="less" scoped>
	.w168 {
		width: 168px;
	}
</style>