import request from '../api/request'

//  登录
export const login = async params => {
	const res = await request.post(process.env.Login_API_HOST, 'ins/accountLogin', params);
	return res.data;
}

//  获取用户机构信息
export const getLoginMessage = async params => {
	const res = await request.get(process.env.Login_API_HOST, 'ins/getInsInfo', params);
	return res.data;
}

//  机构用户列表
export const getLoginList = async params => {
	const res = await request.get(process.env.Login_API_HOST, 'ins/getInsBusinessAccounts', params);
	return res.data;
}

// 机构用户切换登录
export const changeLogin = async params => {
	const res = await request.post(process.env.Login_API_HOST, 'ins/changeUser', params);
	return res.data;
}

//  机构用户更换手机号吗
export const changePhoneNumber = async params => {
	const res = await request.put(process.env.Login_API_HOST, 'ins/repalcePhone', params);
	return res.data;
}


//机构用户微信登录获取UUID
export const wxLogin = async params => {
	const res = await request.post(process.env.Login_API_HOST, 'ins/wechat/validUser', params);
	return res.data;
}

//机构用户微信登录轮询是否登录成功
export const wxIsLogin = async params => {
	const res = await request.post(process.env.Login_API_HOST, 'ins/wechat/isLogin', params);
	return res.data;
}

//机构用户微信登录
export const weChatLogin = async params => {
	const res = await request.post(process.env.Login_API_HOST, 'ins/wechat/index', params);
	return res.data;
}



// 机构用户短信登录
export const smsLogin = async params => {
	const res = await request.post(process.env.Login_API_HOST, 'ins/smsLogin', params);
	return res.data;
}

// 获取验证码
export const getCode = async params => {
	const res = await request.post(process.env.COMMON_API_HOST, 'pub/smsCode', params);
	return res.data;
}

//  注册页面绑定手机号
export const bindPhone = async params => {
	const res = await request.post(process.env.Login_API_HOST, 'ins/bindPhone', params);
	return res.data;
}

//  注册页面绑定微信
export const bindWeChat = async params => {
	const res = await request.post(process.env.Login_API_HOST, 'ins/bindWechat', params);
	return res.data;
}

//  注册页面激活码登录
export const acCode = async params => {
	const res = await request.put(process.env.Login_API_HOST, 'ins/account/active', params);
	return res.data;
}


//  机构账号信息添加
export const messageAdd = async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insAccountManage/edit', params);
	return res.data;
}

//  机构账号修改手机号吗
export const changeBindPhone = async params => {
	const res = await request.put(process.env.Login_API_HOST, 'ins/repalcePhone', params);
	return res.data;
}