import request from '../api/request'

//医疗卫生单位统计
export const ylCount = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'statistics/healthunit', params);
	return res.data;
}

//行政单位查询
export const xzCount = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'statistics/administrationIns', params);
	return res.data;
}