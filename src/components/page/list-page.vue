<template>
  <div :class="['list-page', platform, templateClass, h5Class]" :style ="wrapStyle">
    <NavigationBar v-if="customNavigationBar" :navType="customNavigationBarType" :alwaysShowHome="customNavigationBarShowHome"/>
    <ErrorPage v-if="showError" :error="error" @refresh = "handleRefresh" type="global"/>
    <slot name="top"></slot>
    <ScrollList v-if="showList" @reachBottom="reachBottom" :status="status" :tabHeight = "tabHeight">
      <ErrorPage v-if="listEmptyError" :error="listEmptyError" @navigate = "handleNavigate"/>
      <slot></slot>
    </ScrollList>
    <slot v-if="showList" name="bottom"></slot>
  </div>
</template>

<script>
import NavigationBar from '@/components/navigation/navigation-bar'
import ScrollList from '@/components/ui/scroll-list'
import ErrorPage from '@/components/page/error-page'

const BottomBarHeight = 120
const BottomBarIpxHeight = 50
export default {
  data () {
    return {
      ipxClass: '',
      platform: '',
      templateClass: '',
      h5Class: ''
    }
  },
  props: {
    wrapStyle: {
      type: String,
      default: ''
    },
    customNavigationBar: {
      type: Boolean,
      default: false
    },
    customNavigationBarType: {
      type: String,
      default: 'default'
    },
    customNavigationBarShowHome: {
      type: Boolean,
      default: false
    },
    inited: {
      type: Boolean,
      default: false
    },
    error: {
      type: Object,
      default: () => {
        return {
          errorType: '',
          errorMessage: ''
        }
      }
    },
    emptyErrorType: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: ''
    },
    globalLoading: {
      type: Boolean,
      default: true
    },
    hasBottomBar: {
      type: Boolean,
      default: false
    },
    hasTopBar: {
      type: Boolean,
      default: false
    },
    topBarHeight: {
      type: Number,
      default: 0
    }
  },
  computed: {
    showLoading () {
      return !this.inited && this.status === 'loading'
    },
    showError () {
      return this.error && !this.inited
    },
    listEmptyError () {
      if (this.emptyErrorType && this.status === 'empty') {
        return {
          errorType: this.emptyErrorType
        }
      } else return false
    },
    showList () {
      return this.inited
    },
    tabHeight () {
      const bottomHeight = this.hasBottomBar ? (this.ipxClass ? BottomBarHeight + BottomBarIpxHeight : BottomBarHeight) : 0
      const topHeight = this.topBarHeight || 0
      return bottomHeight + topHeight
    }
  },
  watch: {
    showLoading (cur, pre) {
      if (!this.globalLoading) return
      if (cur && !pre) {
        uni.showLoading()
      } else {
        uni.hideLoading()
      }
    }
  },
  components: {
    ScrollList,
    NavigationBar,
    ErrorPage
  },
  methods: {
    reachBottom () {
      this.$emit('reachBottom')
    },
    handleRefresh () {
      this.$emit('refresh')
    },
    handleNavigate () {
      this.$emit('navigate')
    }
  },
  created () {
    const { systemInfo } = uni.$globalData
    this.ipxClass = systemInfo.ipxClass
    this.platform = systemInfo.platform
    this.templateClass = `tmpl-${uni.$template}`
    this.h5Class = uni.$platform === 'h5' ? 'h5Class' : ''
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
</style>
