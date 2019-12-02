import request from '../api/request'


//接口账号接口
//  列表分页查询
export const list = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'openapiUser/list', params);
	return res.data;
}
//  接口账号修改
export const update = async params => {
	const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'openapiUser/update', params);
	return res.data;
}
//  接口账号删除
export const deletes = async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'openapiUser/delete', params);
	return res.data;
}
//  接口账号新增
export const add = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'openapiUser/add', params);
	return res.data;
}