import request from '../api/request'

//通知公告模块接口

//  通知新增
export const Add = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'newsNotice/addNews', params);
	return res.data;
}

//  通知分页
export const PageList = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'newsNotice/queryPageList', params);
	return res.data;
}
//  通知删除
export const deleteNews = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'newsNotice/deleteNews', params);
	return res.data;
}
//  通知编辑
export const editNews = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'newsNotice/editNews', params);
	return res.data;
}
// //  通知编辑
// export const editNews = async params => {
// 	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'newsNotice/deleteNews', params);
// 	return res.data;
// }