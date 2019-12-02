import request from '../api/request'
//本单位人员管理花名册

//1:在职人员管理
    //1: 在职人员列表

    export const servingOfficer= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'unitPersonalManagement/servingOfficer', params);
        return res.data;
    }
    //修改姓名
    export const updateName= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'unitPersonalManagement/updateName', params);
        return res.data;
    }
    //退休
    export const retire= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'unitPersonalManagement/retire', params);
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
    //2:在值人员查看
    
    export const View= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'unitPersonalManagement/View', params);
        return res.data;
    }
//2：退休人员管理
    //1: 退休人员列表

    export const retirePerson= async params => { 
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'unitPersonalManagement/retirePerson', params);
        return res.data;
    }


//移除人员管理

export const comeoutPerson= async params => { 
    const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'unitPersonalManagement/comeoutPerson', params);
    return res.data;
}

//请求数据字典

export const dtls= async params => { 
    const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
    return res.data;
}
//权限设置
export const setPermission= async params => { 
    const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'personPermission/setPermission', params);
    return res.data;
}