import request from '../api/request'

//  行政机构列表查询
export const administrationAdminList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/list', params);
	return res.data;
}

//  行政机构信息分类
export const administrationAdminType= async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'admManage/editOption', params);
	return res.data;
}

//  行政机构信息删除
export const administrationAdminDelete= async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'admManage/delete', params);
	return res.data;
}

//  行政机构条件查询
export const conditionSearch= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/search', params);
	return res.data;
}

//  机构类别
export const conditionType= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/insOption', params);
	return res.data;
}

//  行政机构信息编辑
export const conditionMessageChange= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/edit', params);
	return res.data;
}



//  行政机构具体信息
export const administrationMessage= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/basicInfo', params);
	return res.data;
}

//  行政机构具体信息修改
export const administrationMessageChange= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/editBasicInfo', params);
	return res.data;
}

//  行政机构位置信息查询
export const administrationAddressMessage= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/queryAddr', params);
	return res.data;
}

//  行政机构位置信息修改
export const administrationAddressChange= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/editAddr', params);
	return res.data;
}

//  查询对应国家司局下拉列表
export const searchOrgList= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/innerOption', params);
	return res.data;
}

//  新增内设机构信息
export const newAdd= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/addInnerIns', params);
	return res.data;
}

//  行政机构内设机构列表
export const list= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/innerInsList', params);
	return res.data;
}

// 内设机构编辑
export const changeOrg = async params => {
	const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'admManage/editInnerIns', params);
	return res.data;
}

// 内设机构有无
export const setOrg = async params => {
	const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'admManage/editHasBranchesStatus', params);
	return res.data;
}

// 内设机构删除
export const deleteOrg = async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'admManage/deleteAdmInnerIns', params);
	return res.data;
}

//  机构信息完成确认
export const finishOrgMessage = async params => {
	const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'admManage/fullyFilled', params);
	return res.data;
}

// 机构信息完成状态
export const orgFinishStatus = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'admManage/queryFilled', params);
	return res.data;
}

//请求数据字典

export const dic= async params => { 
    const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
    return res.data;
}
