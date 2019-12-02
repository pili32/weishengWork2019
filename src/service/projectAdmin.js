import request from '../api/request'

//  查询业务列表
export const getProjectList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'serviceProject/query', params);
	return res.data;
}

//  新增业务项目
export const addProject = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'serviceProject/add', params);
	return res.data;
}

//  删除业务项目
export const deletetProject = async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'serviceProject/delete', params);
	return res.data;
}

//  修改业务项目
export const editProject = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'serviceProject/edit', params);
	return res.data;
}

//  业务下拉框
export const dic = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
	return res.data;
}