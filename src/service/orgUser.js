import request from '../api/request'


//政务账号接口
//  政务账号列表
export const queryList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'orgUsers/queryList', params);
	return res.data;
}
//编辑政务账号
export const edit = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'orgUsers/edit', params);
	return res.data;
}
//增加政务账号
export const add = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'orgUsers/add', params);
	return res.data;
}
//删除政务账号
export const deletes = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'orgUsers/delete', params);
	return res.data;
}
//修改政务账号启用状态
export const updateEntableMark = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'orgUsers/updateEntableMark', params);
	return res.data;
}