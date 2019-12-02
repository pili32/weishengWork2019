import request from '../api/request'
//1:退休人员管理
    //1: 预传名单api列表
    export const retirePageMessage= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'retireRoster/retirePageMessage', params);
        return res.data;
    }
    //编辑
    export const retireEdit= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'retireRoster/retireEdit', params);
        return res.data;
    }
    //批量导入
    export const retireImportAll= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'retireRoster/retireImportAll', params);
        return res.data;
    }
      //单个导入
      export const retireImportOne= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'retireRoster/retireImportOne', params);
        return res.data;
    }
    //导出
    export const retireExport= async params => {
    const res = await request.download(process.env.INFOPLATFORM_API_HOST, 'retireRoster/retireExport', params);
    return res.data;
}
    //清空
    export const retireDeleteAll= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'retireRoster/retireDeleteAll', params);
        return res.data;
    }
    //退休人员统计接口
    export const retireRosterStatistics= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'retireRoster/retireRosterStatistics', params);
        return res.data;
    }
    //单个删除
    export const retireDelete= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'retireRoster/retireDelete', params);
        return res.data;
    }
    // 请求数据字典
    export const dtls= async params => {
        const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
        return res.data;
    }