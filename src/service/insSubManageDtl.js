import request from '../api/request'
//机构管理点进去的详细信息
// 1:基本信息
        //主体信息
export const queryInsBaseInfo= async params => {
	const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/queryInsBaseInfo', params);
	return res.data;
}
    //基本信息保存
    export const editSubInsBasic= async params => {
        const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/editSubInsBasic', params);
        return res.data;
    }
    //基本信息保存
    export const deleteInsName= async params => {
        const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/deleteInsName', params);
        return res.data;
    }
    //基本信息保删除
    //2:机构信息
    //状态
    export const fullyFilled= async params => {
        const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/fullyFilled', params);
        return res.data;
    }
    //保存
    export const saveInsInfo= async params => {
        const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/saveInsInfo', params);
        return res.data;
    }
    //查询
    export const queryInsInfo= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/queryInsInfo', params);
        return res.data;
    }
    
    //3:地址信息列表
    export const querySubInsAddr= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/querySubInsAddr', params);
        return res.data;
    }
    //地址信息保存
    export const editSubInsAddr= async params => {
        const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/editSubInsAddr', params);
        return res.data;
    }
    //添加
    export const addBranch= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/addBranch', params);
        return res.data;
    }
      //编辑
      export const editBranch= async params => {
        const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/editBranch', params);
        return res.data;
    }
        //删除
        export const deleteBranch= async params => {
        const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/deleteBranch', params);
        return res.data;
    }
    //类型
    export const branchTypeOption= async params => {
        const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/branchTypeOption', params);
        return res.data;
    }
    //无分院删除
    export const deleteBranches= async params => {
        const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/deleteBranches', params);
        return res.data;
    }

    //医院进入

    export const editInsInfo= async params => {
        const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/editInsInfo', params);
        return res.data;
    }
    //机构信息下拉框
    export const insInfoOption= async params => {
        const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/insInfoOption', params);
        return res.data;
    }


    //内设机构
    //内设机构 列表
    export const innerDepList= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/innerDepList', params);
        return res.data;
    }
    //内设机构 新增
    export const addDep= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/addDep', params);
        return res.data;
    }
    //内设机构 无内设机构
    export const deleteDep= async params => {
        const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/deleteDep', params);
        return res.data;
    }
    //内设机构 新增option
    export const depOption= async params => {
        const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/depOption', params);
        return res.data;
    }
    //内设机构  修改
    export const editDep= async params => {
        const res = await request.put(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/editDep', params);
        return res.data;
    }
    //删除
    export const deleteDepPiece= async params => {
        const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/deleteDepPiece', params);
        return res.data;
    }
    
    //信息状态
    export const queryFilled= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/queryFilled', params);
        return res.data;
    }  
   
    //社区卫生服务站列表
    export const queryStationList= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/queryStationList', params);
        return res.data;
    }  
     //社区卫生服务站删除
     export const deleteStation= async params => {
        const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/deleteStation', params);
        return res.data;
    }  
    //社区卫生服务站新增
    export const addStation= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/addStation', params);
        return res.data;
    }  
    //村卫生室列表
    export const queryRoomList= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/queryRoomList', params);
        return res.data;
    }  
     //村卫生室编辑
     export const editHealthRoom= async params => {
        const res = await request.post(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/editHealthRoom', params);
        return res.data;
    }  
    //村卫生室删除
    export const deleteRoom= async params => {
    const res = await request.delete(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/deleteRoom', params);
    return res.data;
} 
    //村卫生室数据
    export const OptionList= async params => {
        const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'insSubManageDtl/OptionList', params);
        return res.data;
    }   
    //数据字典
    export const dtls= async params => { 
        const res = await request.get(process.env.INFOPLATFORM_API_HOST, 'dataitem/dtls', params);
        return res.data;
    }

        
    
