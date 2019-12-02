import request from '../api/request'


// 行政机构信息编辑
export const list= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/list', params);
	return res.data;
}