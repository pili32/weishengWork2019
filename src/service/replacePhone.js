import request from '../api/request'

//  查询账户手机号
export const searchPhone = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'personalAccountManage/queryPhoneNumber', params);
	return res.data;
}

//  更换手机号
export const replacePhone = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'personalAccountManage/modifyPhoneNumber', params);
	return res.data;
}