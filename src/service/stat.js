import request from '../api/request'

// 查询卫生单位退休人员统计
export const wsReCount = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'report/retiredPersonWsReport', params);
	return res.data;
}

// 卫生在职人员统计
export const wsOnCount = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'report/servingPersonWsReport', params);
	return res.data;
}

// 行政退休人员统计
export const xzReCount = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'report/retiredPersonXzReport', params);
	return res.data;
}

// 行政在职人员统计
export const xzOnCount = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'report/servingPersonXzReport', params);
	return res.data;
}