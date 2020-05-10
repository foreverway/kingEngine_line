<template>
  <div
    v-if="!item.meta || !item.meta.hidden"
    :class="['menu-wrapper', isCollapse ? 'simple-mode' : 'full-mode', {'first-level': isFirstLevel}]"
  >
    <template v-if="theOnlyOneChild && !theOnlyOneChild.children">
      <sidebar-item-link
        v-if="theOnlyOneChild"
        :to="resolvePath(theOnlyOneChild.menuPath)"
        :the-only-one-child="theOnlyOneChild"
      >
        <el-menu-item
          :index="theOnlyOneChild.id+''"
          :class="{'submenu-title-noDropdown': isFirstLevel}"
        >
          <svg-icon
            v-if="theOnlyOneChild.menuIcon&&!theOnlyOneChild.children"
            :name="theOnlyOneChild.menuIcon"
          />
          <span
            v-if="theOnlyOneChild.menuName"
            slot="title"
          >{{ theOnlyOneChild.menuName }}</span>
        </el-menu-item>
      </sidebar-item-link>
    </template>
    <el-submenu
      v-else
      :index="item.id+''"
      popper-append-to-body
    >
      <template slot="title">
        <svg-icon
          v-if="item.menuIcon"
          :name="item.menuIcon"
        />
        <span
          v-if="item.menuName"
          slot="title"
        >{{ item.menuName }}</span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.id+''"
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.menuPath)"
          class="nest-menu"
        />
      </template>
    </el-submenu>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'
import SidebarItemLink from './SidebarItemLink.vue'

@Component({
  name: 'SidebarItem',
  components: {
    SidebarItemLink
  }
})
export default class extends Vue {
  @Prop({ required: true }) private item!: any
  @Prop({ default: false }) private isCollapse!: boolean
  @Prop({ default: true }) private isFirstLevel!: boolean
  @Prop({ default: '' }) private basePath!: string

  get showingChildNumber() {
    if (this.item.children) {
      const showingChildren = this.item.children.filter((item: any) => {
        if (item.meta && item.meta.hidden) {
          return false
        }
        return true

      })
      return showingChildren.length
    }
    return 0
  }

  get theOnlyOneChild() {
    if (this.showingChildNumber > 1) {
      return null
    }
    if (this.item.children) {
      for (let child of this.item.children) {
        if (!child.meta || !child.meta.hidden) {
          return child
        }
      }
    }
    // If there is no children, return itself with path removed,
    // because this.basePath already conatins item's path information
    return { ...this.item, path: '' }
  }

  private resolvePath(routePath: string) {
    return path.resolve(this.basePath, routePath)
  }
}
</script>

<style lang="scss">
.el-submenu.is-active > .el-submenu__title {
  color: $subMenuActiveText !important;
}

.full-mode {
  .nest-menu .el-submenu>.el-submenu__title,
  .el-submenu .el-menu-item {
    min-width: $sideBarWidth !important;
    background-color: $subMenuBg;

    &:hover {
      background-color: $subMenuHover !important;
    }
  }
}

.simple-mode {
  &.first-level {
    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;

      .el-tooltip {
        padding: 0 !important;
      }
    }

    .el-submenu {
      overflow: hidden;

      &>.el-submenu__title {
        padding: 0px !important;

        .el-submenu__icon-arrow {
          display: none;
        }

        &>span {
          visibility: hidden;
        }
      }
    }
  }
}
  .el-menu-item.is-active {
      background:$menuActiveText!important
  }
  .el-menu-item.is-active .svg-icon,
  .el-menu-item.is-active span{
    color:#fff!important;
  }
</style>

<style lang="scss" scoped>
.svg-icon {
  margin-right: 8px;
}

.simple-mode {
  .svg-icon {
    margin-left: 20px;
  }
}
</style>
