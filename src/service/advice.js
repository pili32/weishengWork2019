import request from '../api/request'


//意见建议接口
//  意见建议查询列表
export const queryList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'advice/queryList', params);
	return res.data;
}
//回复意见建议
export const reply = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'advice/reply', params);
	return res.data;
}
//意见建议删除
export const deletes = async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'advice/delete', params);
	return res.data;
}
//意见建议增加
export const add = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'advice/add', params);
	return res.data;
}
//意见建议详情
export const Query = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'advice/Query', params);
	return res.data;
}

