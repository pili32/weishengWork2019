import request from '../api/request'

//  查询机构信息报表
export const searchUnitReport = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'portal/insMainReport', params);
	return res.data;
}

//  查询人员构成
export const searchPerson = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'portal/personalReport', params);
	return res.data;
}

// 每月注册人数
export const registerPerson = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'portal/registerByMonthReport', params);
	return res.data;
}

// 通知公告列表
export const adList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'newsNotice/queryPageList', params);
	return res.data;
}