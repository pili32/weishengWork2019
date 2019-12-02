import request from '../api/request'
//白名单
//  列表查询
export const queryList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'whiteList/queryList', params);
	return res.data;
}
//  新增
export const add = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'whiteList/add', params);
	return res.data;
}
//  批量启用
export const batchEnableOrNot = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'whiteList/batchEnableOrNot', params);
	return res.data;
}
//  修改
export const update = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'whiteList/update', params);
	return res.data;
}
//  删除
export const deletes = async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'whiteList/delete', params);
	return res.data;
}