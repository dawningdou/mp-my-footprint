<template>
  <view :class="['page', ipxClass, platform]">
    <view class="module">
      <button @tap="tap">点击获取用户地理位置</button>
      <view class="text">lat: {{location.latitude}}, lng: {{location.longitude}}</view>
      <navigator url="/pages/test"><button>使用测试地理位置</button></navigator>
    </view>
    <view class="module">
      <AuthBtn><view class="btn">用户授权</view></AuthBtn>
      <view class="text">nickName: {{nickName}}</view>
    </view>
    <view class = "module">
      <VideoPlayer
        videoSrc = "https://yihuiyijie-1258038039.file.myqcloud.com/%E4%B8%89%E5%8C%BA%E4%B8%89%E5%B7%9E%E5%A4%A7%E7%8E%AF%E7%BA%BF.mp4"
        poster = "https://wltong-1252759886.cos.ap-guangzhou.myqcloud.com/media/f19v85碧潭湖.jpg"
        wrapStyle = "width: 100%;height: 300rpx;"
        @play= "handleVideoPlay"
        :autoPlay= "false"
      />
    </view>
    <view class="module">
      <div>数据状态不需要维护时:</div>
      <button @click = "handleFetchData">不使用store直接fetch</button>
      <view v-if= "example1.id">{{example1.id}} - {{example1.title}}</view>
    </view>
    <view class = "module">
      <div>数据状态需要缓存时:</div>
      <button @click = "handleFetchCachedData">使用vuex store进行数据管理</button>
      <view v-if= "cachedExampleData">{{cachedExampleData.id}} - {{cachedExampleData.title}}</view>
    </view>
    <view class="module">
      <TimeLine :listData="lineList" />
    </view>
    <view class="module">
      <u-parse :content="article" @preview="preview" @navigate="navigate" className = "my-content"/>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AuthBtn from '@/components/auth-btn'
import TimeLine from '@/components/ui/time-line'
import request from '@/utils/request'
import uParse from '@/components/rich-text-parse/parse'
import VideoPlayer from '@/components/video-player'
const IMAGE_LIST = ['https://yihuiyijie-1258038039.file.myqcloud.com/hotel/index/%E6%95%A6%E7%85%8C%E5%AE%BE%E9%A6%86.jpg',
  'https://yihuiyijie-1258038039.file.myqcloud.com/hotel/big/qlh4Wk3HfCB1-uiUEgqtKtmfz8qq8mNGN9aeMH1BSd1QrkDYcjhmt0p6K-CN4GKZGWo_0qnKp5W536Cb3AAVowozPxbDt7FvNPTx2O7KQfI.jpg',
  'https://yihuiyijie-1258038039.file.myqcloud.com/hotel/big/U0mk0uzGHE__RAaDQvpU5ZGtZOAA22nfzsCbK3Zh98ZKDKcUBpLtixvsrKsbtZQhGWo_0qnKp5W536Cb3AAVowozPxbDt7FvNPTx2O7KQfI.jpg'
]
export default {
  data () {
    return {
      title: 'Hello',
      imageList: IMAGE_LIST,
      article: "<p>200万年前，金佛山缓冲第四纪冰期侵袭，保留了大量的古生植物。其中，银杉、方竹、杜鹃王、银杏、大树茶独秀于林，一起被誉为“金佛山五绝”。<br/></p><p><br/></p><p>银杉：古老孑遗植物，第四纪冰川后遗留至今的稀世珍宝，濒危珍稀植物，世界一绝，中国独有。因其珍贵，被誉为“植物熊猫”；因其久远，被称为“植物活化石”；金佛山是植物种群最集中、数量最大的原生产地，有1978株。天朗气清时，银杉窄窄的暗绿色叶背，折射出两条耀眼的白线，满树银光闪闪，银杉美名由此而来。相传，上世纪六七十年代，某国想将我国的银杉带回本国研究，先是提出以一架飞机来换一株银杉树，被拒后还派出间谍潜入金佛山，试图偷盗。</p><p><img src='https://wltong-1252759886.cos.ap-guangzhou.myqcloud.com/media/s6i0q7.原始森林.jpg'/></p><p>方竹：以金佛山命名的稀有竹类品种，生长海拔1200-2000米，金佛山是其原产地和现代地理分布中心，面积大、最集中、最完整，有5亿多株。古称巴竹，1940年，被正式命名为“金佛山方竹”。具有不发于春而茂于秋、由高处往低处生笋、成竹内圆外方等特点；方竹笋纤维细脆，富含蛋白质、氨基酸、钙、铁、硒、锌等多种微量元素和维生素，被誉为“竹类之冠”“笋中之王”和“人类肠道清洁夫”。宋代始为朝廷贡品。</p><p><img src='https://wltong-1252759886.cos.ap-guangzhou.myqcloud.com/media/povop6.怡心亭.JPG'/></p><p>银杏：植物中的大熊猫，乔木类植物中最古老的树种，生长于两亿年前，由于第四纪冰川影响，原生古银杏在世界上基本绝迹，唯有中国少量生存；金佛山德隆镇叫杨家沟，生长有3000多株，是迄今为止全世界发现年轮结构最完整、跨度最长、植株数量最多、单株树龄最高的野生银杏群落。其种银杏王树龄2500岁，高26米，胸围11.6米，是世界上最古老银杏，也是金佛山的镇山之宝。</p><p><br/></p><p>杜鹃王：金佛山杜鹃有54个品种、60多万株，树龄多在600年左右，其中一株高13.8米、胸围3.77米的杜鹃，比云南杜鹃王还要大1.17米，刷新了“杜鹃王”记录，是国内树齡最古老、树干最雄壮、树冠最宽阔的千年乔木杜鹃。</p><p><img src='https://wltong-1252759886.cos.ap-guangzhou.myqcloud.com/media/zoo1k16.金佛山上 杜鹃花开.JPG'/></p><p>大树茶：世界一绝，中国独有。金佛山是中国茶树发源地之一，有着世界上面积最大的野生大茶树群落，主要生长在海拔1000-1500米山区，德隆镇茶树村分布最集中，仅存2000多株，最大一株树龄2700年，被誉为“茶树鼻祖”。金佛山大树茶保留了纯正的古茶原始基因，茶叶身长、叶面宽、叶肉厚，叶绿素、茶浓度、茶多酚含量均高于其他茶类，被国际茶文化研究会誉为“天赐佛茶”。千百年来，古稀老人上树采茶、欢歌采茶，演绎着古树与老人的和谐长生之舞。</p><p><img src='https://wltong-1252759886.cos.ap-guangzhou.myqcloud.com/media/f19v85碧潭湖.jpg'/></p><p><br/></p>",
      lineList: [
        {
          day_title: 'ABC单独的',
          list: [
            {
              name: '呵呵呵',
              img: 'https://wltong-1252759886.picgz.myqcloud.com/media/ce8ciWechatIMG67.jpeg?imageMogr2/thumbnail/1080x/format/jpg',
              desc: '走过历史的连廊'
            }
          ]
        }
      ],
      example1: {}
    }
  },
  computed: {
    ...mapState({
      location: state => state.location.location,
      nickName: state => state.user.nickName
    }),
    ...mapState('example', [
      'exampleDetailMap'
    ]),
    cachedExampleData () {
      console.log(this.exampleDetailMap)
      return this.exampleDetailMap[this.id] && this.exampleDetailMap[this.id].data
    }
  },
  components: {
    AuthBtn,
    uParse,
    VideoPlayer,
    TimeLine
  },
  onLoad () {
    // for test
    this.id = 1
  },
  methods: {
    ...mapActions([
      'getLocation',
      'fetchCachedData'
    ]),
    ...mapActions('example', [
      'fetchExampleCachedData'
    ]),
    preview () {
      console.log('preview')
    },
    navigate () {
      console.log('navigator')
    },
    tap () {
      this.getLocation()
      console.log('location', this.location)
    },
    handleFetchCachedData () {
      this.fetchExampleCachedData({ id: this.id })
    },
    handleVideoPlay () {
      console.log('play')
    },
    async handleFetchData () {
      try {
        this.example1 = await request.$get('/example/detail', {
          id: this.id
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang='scss' scoped>
.module {
  padding: 40rpx 0;
  border-bottom: 20rpx solid #eee;
}
.btn {
  width: 100%;
  font-size: 18px;
  text-align: center;
  line-height: 2.55555556;
  border-radius: 5px;
  background: #F8F8F8;
  &::after {
    content: " ";
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid rgba(0, 0, 0, 0.2);
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
    border-radius: 10px;
  }
}
</style>
<style lang = 'less' >
.wxParse.my-content {
  .p {
    font-size: 24rpx;
  }
}
</style>
