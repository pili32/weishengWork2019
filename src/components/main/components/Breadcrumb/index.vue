<template>
    <Breadcrumb>
        <BreadcrumbItem :to="'/'+item.name" v-for="(item,index) in Breadcrumbs" :key="index" v-if="index==0">
            <Icon :type="item.meta.icon"></Icon><span>{{item.meta.title}}</span>
        </BreadcrumbItem>
        <BreadcrumbItem v-for="(item,index) in Breadcrumbs" :key="index" v-if="index>0">
            <Icon :type="item.meta.icon"></Icon><span>{{item.meta.title}}</span>
        </BreadcrumbItem>
    </Breadcrumb>
</template>
<style lang="less">
    .ivu-breadcrumb{
        display: inline-block;
        font-size: 13px;
    }
</style>

<script>
import { mapState} from 'vuex'
export default {
    computed:{
        ...mapState({
            Breadcrumbs: state => state.app.breadCrumbList
        })
    }
}
</script>

