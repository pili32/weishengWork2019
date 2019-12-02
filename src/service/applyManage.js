import request from '../api/request'


//注册机构审核接口
//  审核通过
export const edit = async params => {
	const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insApply/edit', params);
	return res.data;
}
//  退回
export const cancel = async params => {
	const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insApply/cancel', params);
	return res.data;
}
// 详情
export const queryDetail = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insApply/queryDetail', params);
	return res.data;
}
// 列表
export const queryList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insApply/queryList', params);
	return res.data;
}
// 民科企业库
export const querySyncIns = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insApply/querySyncIns', params);
	return res.data;
}
//queryInsList 系统内机构
export const queryInsList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insApply/queryInsList', params);
	return res.data;
}
//行政机构 三级联动
export const insOptionList = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/insLayerOption', params);
	return res.data;
}


//数据字典请求
export const dtls= async params => {
    const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls/', params);
    return res.data;
}