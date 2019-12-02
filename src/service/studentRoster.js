import request from '../api/request'
//在校生管理

//1:预传在校生名单
    //1: 列表
    export const pageMessage= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'studentRoster/pageMessage', params);
        return res.data;
    }
    //2：统计接口
    export const studentRosterStatistics= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'studentRoster/studentRosterStatistics', params);
        return res.data;
    }
    //3：导入
    export const importOne= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'studentRoster/importOne', params);
        return res.data;
    }
    //4：编辑
    export const edit= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'studentRoster/edit', params);
        return res.data;
    }
    //5：清空
    export const deleteAll= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'studentRoster/deleteAll', params);
        return res.data;
    }
    //6：单个删除
    export const deletes= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'studentRoster/delete', params);
        return res.data;
    }
    // //导出
    // export const export= async params => {
    //     const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'studentRoster/export', params);
    //     return res.data;
    // }
    //批量导出
    export const exports= async params => {
        const res = await request.download(process.env.INFOPLATFORM_API_HOST, 'studentRoster/export', params);
        return res.data;
    }

    // 2:实名认证审核
        // 1:查询列表
        export const list= async params => {
            const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'studentRealName/list', params);
            return res.data;
        }

    // 3:在校生管理
        // 1：在校生列表
      export const student= async params => {
            const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'studentManagement/student', params);
            return res.data;
        }
        //修改姓名
        export const updateName= async params => {
            const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'unitPersonalManagement/updateName', params);
            return res.data;
        }
        //删除
        export const del= async params => {
            const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'unitPersonalManagement/del', params);
            return res.data;
        }
        //转出
        export const comeout= async params => {
            const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'unitPersonalManagement/comeout', params);
            return res.data;
        }
        
    // 4：移除列表
      export const comeoutStudent= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'studentManagement/comeoutStudent', params);
        return res.data;
    }
    //数据字典
    export const edits= async params => {
        const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
        return res.data;
    }