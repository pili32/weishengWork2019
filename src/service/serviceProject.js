import request from '../api/request'

//业务项目管理
//业务项目管理列表
export const query = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'serviceProject/query', params);
	return res.data;
}
//业务项目管理编辑
export const edit = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'serviceProject/edit', params);
	return res.data;
}
//业务项目管理新增
export const add = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'serviceProject/add', params);
	return res.data;
}
//业务项目管理删除
export const deletes = async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'serviceProject/delete', params);
	return res.data;
}