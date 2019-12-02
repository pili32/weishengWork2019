<template>
  <Submenu :name="`${parentName}`">
    <template slot="title">
      <Icon :type="parentItem.icon || ''" :size="16"></Icon>
      <span>{{ ShowTitle(parentItem) }}</span>
    </template>
    <template v-for="item in children">
      <template v-if="item.children && item.children.length === 1">
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <MenuItem v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`">
          <Icon :type="item.children[0].icon || ''" :size="iconSize"></Icon>
          <span>{{ showTitle(item.children[0]) }}</span>
        </MenuItem>
      </template>
      <template v-else>
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <MenuItem v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`">
          <Icon :type="item.icon || ''" :size="iconSize"></Icon>
          <span>{{ ShowTitle(item) }}</span>
        </MenuItem>
      </template>
      <!-- <template v-if="item.children">
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <MenuItem v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`">
            <Icon :type="item.icon || ''" :size="iconSize"></Icon>
            <span>{{ ShowTitle(item) }}</span>
        </MenuItem>
      </template>-->
    </template>
  </Submenu>
</template>
<script>
import { showTitle } from "@/libs/util";
export default {
  name: "SideMenuItem",
  props: {
    parentItem: {
      type: Object,
      default: () => {}
    },
    iconSize: {
      type: Number,
      default: 20
    }
  },

  computed: {
    parentName() {
      return this.parentItem.name;
    },
    children() {
      return this.parentItem.children;
    }
  },
  created() {
  },
  methods: {
    ShowTitle(item) {
      return showTitle(item);
    },
    showChildren(item) {
      return (
        item.children &&
        (item.children.length > 1 || (item.meta && item.meta.showAlways))
      );
      // return item.children
    },
    getNameOrHref(item, children0) {
      return item.flag && item.flag.indexOf('thirdProject') > -1
        ? `isTurnByHref_${item.url}`
        : children0
        ? item.children[0].name
        : item.name;
    }
  }
};
</script>
