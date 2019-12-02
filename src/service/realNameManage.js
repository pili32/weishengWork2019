import request from '../api/request'


//本单位实名认证审核(非预传审核名单页面)
// 实名认证审核列表查询
export const list= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'realNameManage/list', params);
	return res.data;
}
//本单位人员名审核通过
export const pass= async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'realNameManage/pass', params);
	return res.data;
}
//本单位人员名审核编辑
export const editOn= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'realNameManage/edit', params);
	return res.data;
}
//本单位人员名审核退回
export const goback= async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'realNameManage/goback', params);
	return res.data;
}

//   数据字典查询IdentityType
export const dtls = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
	return res.data;
}
