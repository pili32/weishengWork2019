import request from '../api/request'

// 机构账号列表查询
export const getAccountList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/list', params);
	return res.data;
}

//  机构账户激活
export const activeAccount = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/active', params);
	return res.data;
}