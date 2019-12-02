import request from '../api/request'

// 查询字典列表
export const getDicList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'dataitem/list', params);
	return res.data;
}

// 查询字典类型列表
export const getDicType = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem', params);
	return res.data;
}

// 查询数据字典所属分类 
export const checkType = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dataItemCategory', params);
	return res.data;
}

//  新增字典
export const addDic = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'dataitem/add', params);
	return res.data;
}

//  字典删除
export const deleteDic = async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'dataitem/delete', params);
	return res.data;
}

//  根据字典code，查询字典明细列表 
export const dicMessage = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
	return res.data;
}

//  新增字典详情 
export const dicAllMessage = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtl/add', params);
	return res.data;
}

//  数据字典编辑
export const dataDicEdit = async params => {
	const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'dataitem/edit', params);
	return res.data;
}


//  数据字典详情编辑
export const dataDicMessageEdit = async params => {
	const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtl/edit', params);
	return res.data;
}

// 字典详情删除
export const dicMsgDelete = async params => {
	const res = await request.delete(process.env.INFOPLATFORM_API_HOST, '/dataitem/dtl/delete', params);
	return res.data;
}