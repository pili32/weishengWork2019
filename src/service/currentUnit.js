import request from '../api/request'
//业务账号管理
// 新增
export const create= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'currentUnit/business/account/create', params);
	return res.data;
}
//校验码生成
export const creates= async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'currentUnit/checkcode/create', params);
	return res.data;
}
////校验码查询
export const query= async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'currentUnit/checkcode/query', params);
	return res.data;
}