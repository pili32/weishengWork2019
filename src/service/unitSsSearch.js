import request from '../api/request'

//  卫生行政部门查询
export const wsUnitSearch = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insListSelect/queryListList', params);
	return res.data;
}

//  医疗卫生单位查询
export const ylUnitSearch = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insMedicalSelect/queryListList', params);
	return res.data;
}

// 查询机构详细信息
export const unitMessage = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/queryInsBaseInfo', params);
	return res.data;
}

// 获取字典详情
export const getDic = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
	return res.data;
}