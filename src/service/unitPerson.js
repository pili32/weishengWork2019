import request from '../api/request'


//  本单位人员查询
export const unitPersonList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/list', params);
	return res.data;
}