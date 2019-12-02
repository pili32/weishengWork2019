import request from '../api/request'


//个人核心信息管理api
// 个人核心信息管查询列表
export const query = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'personalUser/queryByCondition', params);
	return res.data;
}

// 个人核心信息管查询列表删除
export const deletes = async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'personalUser/delete', params);
	return res.data;
}
// 请求数据字典
export const dtls= async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
	return res.data;
}