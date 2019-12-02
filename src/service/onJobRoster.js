import request from '../api/request'


//1:在职人员管理
    //1: 预传名单api列表
    export const pageMessage= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'onJobRoster/pageMessage', params);
        return res.data;
    }
    //编辑
    export const edit= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'onJobRoster/edit', params);
        return res.data;
    }
    //批量导入
    export const importAll= async params => {
        const res = await request.upload(process.env.INFOPLATFORM_API_HOST, 'onJobRoster/importAll', params);
        return res.data;
    }
      //单个导入
      export const importOne= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'onJobRoster/importOne', params);
        return res.data;
    }
    //导出
    export const exports= async params => {
    const res = await request.download(process.env.INFOPLATFORM_API_HOST, 'onJobRoster/export', params);
    return res.data;
}
    //清空
    export const deleteAll= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'onJobRoster/deleteAll', params);
        return res.data;
    }
    //在职人员统计接口
    export const onJobRosterStatistics= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'onJobRoster/onJobRosterStatistics', params);
        return res.data;
    }
    //单个删除
    export const delets= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'onJobRoster/delete', params);
        return res.data;
    }
    //   数据字典查询IdentityType
export const dtls = async params => {
	const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
	return res.data;
}

