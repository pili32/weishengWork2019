import request from '../api/request'

//  业务项目列表
export const getDicList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'business/list', params);
	return res.data;
}