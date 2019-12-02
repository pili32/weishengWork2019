<template>
  <Dropdown ref="dropdown" @on-click="handleClick" :class="hideTitle ? '' : 'collased-menu-dropdown'" :transfer="hideTitle" :placement="placement">
    <a class="drop-menu-a" type="text" @mouseover="handleMousemove($event, children)" :style="{textAlign: !hideTitle ? 'left' : ''}">
        <Icon :size="rootIconSize" :type="parentItem.icon" :color="textColor"/>
        <span class="menu-title" v-if="!hideTitle">{{ CurrShowTitle(parentItem) }}</span>
        <Icon style="float: right;" v-if="!hideTitle" type="ios-arrow-forward" :size="20"/>
    </a>
    <DropdownMenu ref="dropdown" slot="list">
      <template v-for="child in children">
        <collapsed-menu v-if="showChildren(child)" :icon-size="iconSize" :parent-item="child" :key="`drop-${child.name}`"></collapsed-menu>
        <DropdownItem v-else :key="`drop-${child.name}`" :name="child.name">
          <Icon :size="iconSize" :type="child.icon"/>
          <span class="menu-title">{{ CurrShowTitle(child) }}</span>
        </DropdownItem>
      </template>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
import { findNodeUpperByClasses,showTitle} from '@/libs/util'
export default {
  name: 'CollapsedMenu',
  props: {
    hideTitle: {
      type: Boolean,
      default: false
    },
    rootIconSize: {
      type: Number,
      default: 20
    },
    parentItem: {
      type: Object,
      default: () => {}
    },
    textColor:{
      type: String,
      default: "#ffffff"
    }
  },
  data () {
    return {
      placement: 'right-end',
      iconSize:18
    }
  },
  computed: {
    children () {
      return this.parentItem.children
    }
  },
  methods: {
    handleClick (name) {
      this.$emit('on-click', name)
    },
    handleMousemove (event, children) {
      const { pageY } = event
      const height = children.length * 38
      const isOverflow = pageY + height < window.innerHeight
      this.placement = isOverflow ? 'right-start' : 'right-end'
    },
    CurrShowTitle (item) {
      return showTitle(item)
    },
    showChildren (item) {
      return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
    },
    getNameOrHref (item, children0) {
      return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
    }
  },
  mounted () {
    let dropdown = findNodeUpperByClasses(this.$refs.dropdown.$el, ['ivu-select-dropdown', 'ivu-dropdown-transfer'])
    if (dropdown) dropdown.style.overflow = 'visible'
  }
}
</script>
