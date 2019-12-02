import request from '../api/request'

//  管理员查询   卫生行政部门
export const adminSearchWs = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insList/queryListList', params);
	return res.data;
}

//  机构层级 option
export const insOptionList = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/insLayerOption', params);
	return res.data;
}

//  管理员查询  医疗卫生部门
export const adminSearchYl = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insMedical/queryListList', params);
	return res.data;
}