import request from '../api/request'

//数据字典请求
export const dtls= async params => {
    const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls/', params);
    return res.data;
}