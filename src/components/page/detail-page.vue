<template>
  <div :class="['detail-page', platform, templateClass, h5Class, ipxClass, hasBottomBar ? 'padding-bottom' : '']" :style ="wrapStyle">
    <NavigationBar
      v-if="customNavigationBar"
      :navType="customNavigationBarType"
      :alwaysShowHome="customNavigationBarShowHome"
      :title="title"
      :backgroundColor="customNavigationBarBgColor"
    />
    <slot v-if="showData"></slot>
    <ErrorPage v-if="showError" :error="error" @refresh = "handleRefresh" />
    <slot v-if="showData" name="bottom"></slot>
  </div>
</template>

<script>
import NavigationBar from '@/components/navigation/navigation-bar'
import ErrorPage from '@/components/page/error-page'
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
    customNavigationBarBgColor: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
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
    status: {
      type: String,
      default: ''
    },
    hasBottomBar: {
      type: Boolean,
      default: false
    },
    globalLoading: {
      type: Boolean,
      default: true
    }
  },
  components: {
    NavigationBar,
    ErrorPage
  },
  computed: {
    showLoading () {
      return !this.inited && this.status === 'loading'
    },
    showError () {
      return this.error && !this.inited
    },
    showData () {
      return this.inited
    }
  },
  watch: {
    status (cur, pre) {
      if (!this.showData && cur === 'loading' && pre !== 'loading') {
        uni.showLoading()
      } else {
        uni.hideLoading()
      }
    }
  },
  methods: {
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
.padding-bottom {
  padding-bottom: 120rpx;
}
</style>
