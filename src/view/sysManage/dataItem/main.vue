<template>
  <div style="height:100%;position:relative;">
    <Tabs type="line">
      <TabPane label="数据字典管理">
        <dataItem></dataItem>
      </TabPane>
      <TabPane label="字典详情管理">
        <dataItemDtls></dataItemDtls>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import dataItem from "./list.vue";
import dataItemDtls from "./dtls.vue";
export default {
  data() {
    return {
    };
  },
  components: {
    dataItem,
    dataItemDtls
  },
  mounted() {
  }
};
</script>

