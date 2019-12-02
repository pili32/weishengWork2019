import request from '../api/request'


//机构账号管理
// 新增
export const searchIns= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/search', params);
	return res.data;
}
// 账号激活
export const active= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/active', params);
	return res.data;
}
// 账号修改
export const edit= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/edit', params);
	return res.data;
}
// 机构层级
export const layerOption= async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/layerOption', params);
	return res.data;
}
// 禁用/启用
export const prohibit= async params => {
	const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/prohibit', params);
	return res.data;
}
//  修改密码
export const resetPsd= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/resetPsd', params);
	return res.data;
}
// 点击管理修改账号
export const accountManange= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/accountManange', params);
	return res.data;
}
//回收
export const recycle= async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/recycle', params);
	return res.data;
}
//点我生成
export const createInsAccountName= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/createInsAccountName', params);
	return res.data;
}
//分账号数据
export const queryBussinessAccount= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/queryBussinessAccount', params);
	return res.data;
}
//点击生成
export const createSubInsAccount= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManage/createSubInsAccount', params);
	return res.data;
}

