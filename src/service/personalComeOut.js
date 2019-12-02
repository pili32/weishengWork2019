import request from '../api/request'

//转出申请审批
//列表查询
export const list = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'personalComeOut/list', params);
	return res.data;
}
//批量转出
export const ManyAgree = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'personalComeOut/ManyAgree', params);
	return res.data;
}
//不同意
export const disagree = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'personalComeOut/disagree', params);
	return res.data;
}
//删除
export const del = async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'personalComeOut/del', params);
	return res.data;
}
//同意
export const agree = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'personalComeOut/agree', params);
	return res.data;
}

//请求数据字典

export const dtlss= async params => { 
    const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
    return res.data;
}