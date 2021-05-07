# 文旅小程序通用框架说明

## 使用

### 1. 安装
```
npm run install
```

### 2. 运行小程序
```
npm run dev
```

### 3. 打包、发布小程序
```
npm run build
```

## 项目目录
源代码放置于src，开发时可使用@定位到src目录下，如 import AuthBtn from '@/components/auth-btn'
- apis: 请求接口地址、参数等信息
- common: 样式文件等
- components: 组件
- config: 项目配置信息
- pages: 页面文件
- static: 素材资源
- store: vuex store
- utils: helper工具等
- App.vue: 入口文件，放置全局方法、样式
- main.js: 入口文件，放置初始化方法
- manifest.json 小程序项目配置项，使用mp\-weixin字段配置，详情参考 https://uniapp.dcloud.io/collocation/manifest?id=mp-weixin
- pages.json 小程序页面配置，详情参考 https://uniapp.dcloud.io/collocation/pages

## 模版分类
综合来看，目前首页和第二页卡有模版定制的需求，在src/pages/index/home和src/pages/index/travel内规划了不同模版使用的页面，使用不同页面开发不同模版的页面。封成不同组件进行开发，home页和travel页只做组件组合的功能。

### 新建模板
1. 在build/templateConfig.js中添加一个模板名称，如{ name: '南川模板', id: 'nc'}
2. 在src/index/home下创建home-nc.vue。在src/index/travel下创建travel-nc.vue。在这两个vue文件里维护模板
3. ```npm run dev```选择模板进行开发
4. 开发完成后```npm run build```选择模板进行打包，打包后入口路径统一为pages/index/home/home


## 路由、页面跳转
routeUtil中封装了跳转的方法，使用方式 
```
  import { routeTo } from 'utils/routeUtil'
  routeTo({
    name: '',
    params: {id: 'abc'},
    type: 'redirect'
  })
```
参数设置：
+ name 跳转页面name、可在路由配置页src/config/routeConfig中查看
+ params 跳转参数，类型object
+ type 跳转类型： 默认navigate， 可选redirect、switchTab、reLaunch

## vuex
使用vuex进行数据管理，代码参考example页内使用vuex store进行数据管理button
建议： 内容不经常变化的数据可以使用store缓存一份，如景点信息。对于一些接口请求时间较长的数据（如需要计算距离或返回用户个人信息的相关内容），也可以先展示缓存内容，再请求一次接口刷新信息。

### 使用BaseStore和components/pages下的组件联合开发

** 严重建议使用以下方式进行开发。**

使用封装好的BaseStore设置store，baseStore封装了普通列表、分类列表、缓存详情简单详情等内容。

不满足情况的时候也可以添加标准vuex模式代码。

### store引入
```
  import { createStore, BaseList, BaseCachedDataMap, TempData } from './baseStore'
```
### store集成
```
  export default createStore({
    state: {
      bestSpotList: new BaseList(), // 初始化列表，name为bestSpotList
    },
    actions: {
      <!-- 首次请求列表数据 -->
      async fetchBestSpotList ({ dispatch }, payload = {}) {
        return dispatch('fetchList', {
          params: payload, // 请求参数
          api: apis.scenic.getBestSpotList, // 传入请求api
          name: 'bestSpotList' // 传入初始化的name
        })
      },
      <!-- 下一页 -->
      async fetchBestSpotListNextPage ({ dispatch }, payload = {}) {
        return dispatch('fetchListNextPage', {
          params: payload,  // 这里翻页不需要传入页码，baseStore自动计算
          api: apis.scenic.getBestSpotList, // 传入请求api
          name: 'bestSpotList' // 传入初始化的name
        })
      },
      <!-- 清除列表数据 -->
      clearBestSpotList ({ dispatch }, payload = {}) {
        dispatch('clearList', {
          name: 'bestSpotList'
        })
      }
    }
  })
```

### 导出namespace

```
  <!-- src/store/index.js -->
  import tourismScenic from './tourism-scenic'
  Vue.use(Vuex)
  const store = new Vuex.Store({
    modules: {
      // ...
      tourismScenic
    }
  })
  export default store
```

### page内请求、获取数据
```
  components: {
    ListPage
  },
  computed: {
    ...mapState('scenic', [
      'scenicList'
    ]),
    scenicListData () {
      console.log('scenicList', this.scenicList)
      return this.scenicList.data
    }
  },
  methods: {
    ...mapActions('scenic', [
      'fetchScenicList',
      'fetchScenicListNextPage'
    ]),
    loadNextPage () { // 这里翻页不需要传入页码，baseStore自动计算
      this.fetchScenicListNextPage()
    },
    handleRefresh () {
      this.fetchScenicList()
    }
  },
  onUnload () {
    <!-- 清除列表信息，如果需要缓存，则不清 -->
    // this.clearScenicList()
  }
```

配合ListPage组件，将数据传入

```
   <ListPage
    :status = "scenicList.status"
    :error = "scenicList.error"
    :inited = "scenicList.inited"
    @refresh = "handleRefresh"
    @reachBottom = "loadNextPage"
  ></ListPage>
```

在/pages/scenic下的list、detail、list-bj页面分别用了列表页+普通列表数据、详情页+详情数据、列表页+分类数据进行数据管理，/pages/index/personal/about页使用了详情页+简单详情数据进行管理。


## request
src/utils/request 封装了网络请求方法，可以使用request.\$get和request.\$post方法请求数据。
request方法封装了统一格式的错误信息，建议使用try catch捕获error，再根据需求处理。
```
try {
  await request.$get('/xn/wxapp/api/scenic_detail', {
    a: 1,
    b: 2
  })
} catch (err) {
  console.log(err)
}
```
request相关设置在src/config/request下，可以设置请求的hosts、url拼接参数和header。
```
  hosts: {
    prod: 'https://gw.wltong.cn',
    dev: 'https://tgw.wltong.cn'
  },
  url: {
    wxa_appid: APPID,
    wxa_session: true
  },
  header: {
    gateway: null
    // gateway: {
    //   id: 'AKIDC6k08jLdn5NnDE7djM22eXNZEpRLN8N9yWaa',
    //   key: 'f1mzqSGl8321ZKk3kVh2j6tpk1s8j3k9RZy8T8e'
    // }
  }
```
## 样式

### 字体
某些文字需要ios上显示字体pingfang，安卓为默认字体。
在需要这些字体的页面里加上
** 使用ListPage、DetailPage的页面不需要添加这些class **

```
  // 页面根元素
    <template>
      <view :class="[platform]">
      // ...
    </template>
```

再在元素class里加上其中之一即可，分别对应pingfang semibold,pingfang meduim, pingfang regular, pingfang light

```
f-semibold
f-medium
f-regular
f-light
```
如```class="f-light"```

可参考src/index/example.vue

### iPhone X适配

在src/App.vue的style中设置了iPhone X的适配方式是底部加高68rpx
在需要适配的页面加上ipxClass相关代码即可

```
  // 页面根元素
    <template>
      <view :class="[ipxClass]">
      // ...
    </template>
```

## 组件
### BannerSwiper
可适用于1张图片或多张图片(可以包含video)，默认一张图片时不可滚动。
使用方法：
```
  <BannerSwiper :list = "foodDetailData.img" :showProgress = "true"/>
```
+ list传入img数组，数据项为图片地址src。
+ list长度为1时默认图片不可拖动
+ showIndicator展示右下角页码样式，showProcess展示进度条样式
+ 监听tapItem事件会得到当前选中项信息

### rich-text-parse
用于展示html富文本类型的文章，使用方法见示例页。

+ 自定义样式可以在引用此组件的页面修改，但是不要加scoped，如
```
<style rel="stylesheet/scss" lang='scss'>
.wxParse.my-content {
  .p {
    font-size: 24rpx;
  }
}
</style>
```
可以参考src/pages/index/article页实现

+ 使用自定义样式时需加上组件属性className，防止污染其他页面
+ 更多使用规则可以参考https://ext.dcloud.net.cn/plugin?id=364

### vplayer视频播放器
用于播放视频、直播

参数设置：
+ wrapStyle 设置播放器样式
+ liveSrc/videoSrc 直播/视频地址
+ poster 视频未播放时封面图
+ autoPlay 自动播放(wifi环境下)
+ loop 循环播放
+ muted 静音
+ showMuteBtn/showFullScreenBtn 显示静音、全凭按钮
+ placeholder 占位图（直播/视频地址为空时）

事件：
+ play: 视频播放
+ pause: 视频暂停
+ ended: 视频结束
+ fullscreenchange: 视频全屏
+ error: 视频出错

### 翻页列表
一个纵向scroll-view list组件
+ 默认纵向铺满
+ 支持传入tabHeight(rpx)，组件高度就会减掉这个高度
+ 通过传入status改变底部loading状态
+ 监听滚动到底部事件

#### 使用方法

```
    <view style="height: 100rpx">搜索结果</view>
    <ScrollList tabHeight="100" :name="listName" @reachBottom="reachBottom" :status="status">
      <!-- 内嵌slot -->
      <view class="item" v-for="item in list">
        <image :src="item.img" />
        <view class="text">{{item.name}}</view>
      </view>
    </ScrollList>
```

##### slot
组件内部请自行填充列表和样式

##### name属性
非必填，用于区分多个scroll-list

##### reachBottom事件
用户滑动触底触发，注入的参数为name属性传入的值，以便区分多个scroll-list的事件

##### status属性
列表底部的loading状态

|枚举值|含义|
| --------- | ---- |
| hidden| 隐藏 |
| loading	| 正在加载 |
| failed | 加载失败，请稍后重试 |  
| empty | 暂无数据 |  
| finished | 已无更多内容 |  

##### loading图标
可以根据需要替换 ```/static/images/components/ui/loading.png``` loading图标

### time-line 时间轴组件
固定样式

<img src="../assets/time-line.jpeg" width="300px" style="margin:auto">

```
  <TimeLine :detailPath="detailPath" :listData="listData" />
```

##### detailPath

detailPath非必填，类型为String，点击某天的查看详情，跳转到详情页的path

跳转的时候会带上相应的id和name参数

##### listData

listData必填，类型为Array，数组元素为对象，属性包含

|属性名|必填|类型|备注| 例子
| --------- | ---- | --- | --------------------|----------|
|day_title| 否 | string | 日期 |  第一天 |
|day_info	|否 | string | 日期描述 | |
|list| 是| Array | 景点列表 | ||

list包含的元素类型为Object

|list子元素属性名|必填|类型|备注| 例子
| --------- | ---- | --- | --------------------|----------|
|name| 是 | string | 景点名称 | 金佛山风景区 |
|id	|是 | string |  | |
|img| 是| Array | 景点图片 | |
|desc| 是| Array | 景点描述 | 国家5A级风景区 |
|comment_info| 否 | Object | 景点列表 | ||

comment_info评论内容包含的元素类型为Object

| comment_info子元素属性名 |必填|类型|备注| 例子
| --------- | ---- | --- | --------------------|----------|
|head_img_url| 否 | string | 用户头像 |  |
|nick	|是 | string | 用户昵称 | |
|content| 是| string | 评论内容 | ||

### 图片组件

由于文旅类小程序会大面积使用图片，且管理后台上传图片时可能误传过大的图片导致加载过慢，建议在提测阶段统一使用t-image组件，图片加载过慢时会警告或报错。
#### 使用

```
  <Timage t-style="border-radius: 6rpx;" :src="item.img" mode="aspectFit" class="image" lazy-load="true" />
  // script
  import Timage from '@/components/ui/t-image'
```

跟image唯一的区别就是前面加了个T，和style前加了个t-。在正式上线前可以方便的全局查找替换掉

除了src，其他的都是非必填

#### 定义超时时长

超时时长ImageTimout定义在
```
'@/config/timeoutConfig' 
```
默认警告时长为800ms，报错为1600ms

#### 自定义统计

可以在小程序后台--统计--自定义统计中加上```img-timeout```事件，接收```type```、```time```和```src```字段。组件默认会发送统计，在后台配置后可以看到数据。
