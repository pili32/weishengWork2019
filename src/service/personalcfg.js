import request from '../api/request'


//政务账号接口
//  个人首页配置查询列表
export const queryList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'personalCfg/queryList', params);
	return res.data;
}
// 个人首页配置编辑
export const edit = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'personalCfg/edit', params);
	return res.data;
}
// 个人首页配置新增
export const add = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'personalCfg/add', params);
	return res.data;
}
// 个人首页配置删除
export const deletes = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'personalCfg/delete', params);
	return res.data;
}