import request from '../api/request'


// 消息管理列表渲染
export const queryList= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'message/queryList', params);
	return res.data;
}
// 消息管理新增
export const add= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'message/add', params);
	return res.data;
}
// 消息管理删除
export const deletes= async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'message/delete', params);
	return res.data;
}
// 消息管理发布
export const reloads= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'message/reload', params);
	return res.data;
}
// 消息管理撤销
export const revoke= async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'message/revoke', params);
	return res.data;
}