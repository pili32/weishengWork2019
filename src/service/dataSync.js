import request from '../api/request'


//同步内容接口
//  还原
export const recover = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'sync/recover', params);
	return res.data;
}
// 查询明细
export const show = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'sync/show', params);
	return res.data;
}
// 同步
export const sync = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'sync/sync', params);
	return res.data;
}
// 版本列表
export const list = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'sync/list', params);
	return res.data;
}
//表格类型及属性 
export const queryDataItem = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'sync/queryDataItem', params);
	return res.data;
}