<template>
  <ScrollList :tabHeight='tabHeight'>
    <view v-if='isWaterFall' class='water-fall' :style='{height: `${waterFallH}px`}' >
      <view
        class='absolute'
        v-for='(item, ind) in data'
        :key='item.title'
        :style='{height: item.height, width: item.width, left: item.left, top: item.top}'>

        <ImageTextAdp
          :iWdth='waterFallItemW'
          :src='item.src'
          :title='item.title'
          :imageLoad='imageLoad'
          :id='`${item.title}_${ind}`' />
      </view>
    </view>
  </ScrollList>
</template>

<script>
import Timage from '@/components/ui/t-image'
import ScrollList from '@/components/ui/scroll-list'
import ImageTextAdp from '@/components/list-item/image-text-adp'

let listF = 0
let listS = 0

export default {
  data () {
    return {
      data: this.listData,
      isWaterFall: false,
      waterFallH: 0,
      waterFallItemW: 0
    }
  },
  components: {
    Timage,
    ImageTextAdp,
    ScrollList
  },
  props: {
    listData: {
      type: Array,
      default: []
    },
    tabHeight: {
      type: String,
      default: ''
    },
    cStyle: {
      type: String,
      default: ''
    },
    pos: {
      type: String,
      default: 'relative'
    }
  },
  mounted () {
    const w = this.getWaterFallItemW()
    const listData = this.listData.map(v => {
      const h = 100 + 65

      v.width = `${w}px`
      v.height = `${h}px`

      if (listF <= listS) {
        const temp = listF

        listF += h + 20
        v.left = `${20}px`
        v.top = `${temp}px`
      } else {
        const temp = listS

        listS += h + 20
        v.left = `${40 + Number(w)}px`
        v.top = `${temp}px`
      }

      return v
    })

    this.data = listData
    this.waterFallH = listF >= listS ? listF : listS
    this.waterFallItemW = w
    this.isWaterFall = true
  },
  methods: {
    imageLoad (e) {
      const { width, height } = e.detail

      this.iHeight = this.waterFullItemW * height / width
    },
    getWaterFallItemW () {
      const systemInfo = uni.getSystemInfoSync()
      const { windowWidth } = systemInfo

      return (windowWidth - 60) / 2
    }
  }
}
</script>

<style lang='less' scoped>
.water-fall{
  position: relative;

  .absolute{
    position: absolute;
  }
}
</style>
