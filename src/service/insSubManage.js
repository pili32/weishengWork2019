import request from '../api/request'
//下级机构管理
// 新增
export const addSubIns= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/addSubIns', params);
	return res.data;
}
// 新增机构中的行政隶属option
export const admOption= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/admOption', params);
	return res.data;
}
// 新增机构中的行政隶属option
export const option= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/option', params);
	return res.data;
}
// // 新增机构中的行政隶属option
// export const admOption= async params => {
// 	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/admOption', params);
// 	return res.data;
// }
// 新增机构中的主管单位
export const queryUpperIns= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/queryUpperIns', params);
	return res.data;
}

 //业务账号管理列表查询
 export const bussinessAccountManage= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/bussinessAccountManage', params);
	return res.data;
}

//机构管理
//机构管理列表
export const queryByCondition = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/queryByCondition', params);
	return res.data;
}

//账号管理
export const createSubInsAccount = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/createSubInsAccount', params);
	return res.data;
}
//单位人员授权码
export const checkCodes = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/checkCode', params);
	return res.data;
}
//机构管理 启用/删除
export const updateStatus = async params => {
	const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insSubManage/updateStatus', params);
	return res.data;
}
//机构管理删除
export const deleteInSub = async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'insSubManage/deleteInSub', params);
	return res.data;
}
//机构管理 禁用/启用
export const usableBussinessAccount = async params => {
	const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insSubManage/usableBussinessAccount', params);
	return res.data;
}
//机构主体信息编辑
export const edit = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/edit', params);
	return res.data;
}
//机构管理停用和启用
export const insSubUsable = async params => {
	const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insSubManage/insSubUsable', params);
	return res.data;
}


//账号管理
// //账号管理列表查询
export const userList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/userList', params);
	return res.data;
}
// //账号管理列表查询
export const create= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'currentUnit/business/account/create', params);
	return res.data;
}
// //校验码更换
export const queryCheckCode= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/queryCheckCode', params);
	return res.data;
}





//跳转到本单位管理>分帐号管理
//分帐号管理初步渲染
// export const insNodeAccountList = async params => {
// 	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/insNodeAccountList', params);
// 	return res.data;
// }
export const query = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'currentUnit/branch/account/query', params);
	return res.data;
}
export const querys = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'currentUnit/business/account/query', params);
	return res.data;
}
//分帐号管理删除
export const deleteInsAccountNode = async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'insSubManage/deleteInsAccountNode', params);
	return res.data;
}
//分帐号管理新增
export const addInsNodeAccount = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/addInsNodeAccount', params);
	return res.data;
}
//分账号管理下拉框
export const queryNodeAccountOption = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'insSubManage/queryNodeAccountOption', params);
	return res.data;
}
//分账号管理下拉框后的列表
// export const selectList = async params => {
// 	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/selectList', params);
// 	return res.data;
// }
//修改手机号码
export const repalcePhone = async params => {
	const res = await request.put(process.env.Login_API_HOST, 'ins/repalcePhone', params);
	return res.data;
}//手机验证码获取
export const smsCode = async params => {
	const res = await request.post(process.env.COMMON_API_HOST, 'pub/smsCode', params);
	return res.data;
}

//分账号数据
export const queryBussinessAccount= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/queryBussinessAccount', params);
	return res.data;
}


//分账号增加
export const creates= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'currentUnit/branch/account/create', params);
	return res.data;
}
//生成账号
export const createInsAccountName= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/createInsAccountName', params);
	return res.data;
}
//生成账号
export const queryInsAccountNode= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/queryInsAccountNode', params);
	return res.data;
}


