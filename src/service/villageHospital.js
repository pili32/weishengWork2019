import request from '../api/request'
//村卫生室人员管理

//1:实名认证审核
    //1: 列表
    export const realnameCertificationAudit= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'villageHospital/realnameCertificationAudit', params);
        return res.data;
    }
    //移除
    export const comeoutVillageHospitalPerson= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'villageHospital/comeoutVillageHospitalPerson', params);
        return res.data;
    }
    //更换单位
    export const updateUnit= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'villageHospital/updateUnit', params);
        return res.data;
    }
    //在岗列表
    export const villageHospitalPerson= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'villageHospital/villageHospitalPerson', params);
        return res.data;
    }

    //删除
    export const del= async params => {
        const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'unitPersonalManagement/del', params);
        return res.data;
    }
    //单位查询
    export const branchsQuery= async params => {
        const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'villageHospital/branchsQuery', params);
        return res.data;
    }
        
    //请求数据字典

    export const dtls= async params => { 
        const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
        return res.data;
    }