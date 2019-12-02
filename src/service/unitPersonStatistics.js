import request from '../api/request'

// 本单位统计查询   人员查询
export const unitPersonSearch = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'PersonalInfo/QueryListList', params);
	return res.data;
}

//   数据字典查询IdentityType
export const dic = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
	return res.data;
}
