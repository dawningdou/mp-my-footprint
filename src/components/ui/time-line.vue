<template>
  <div class="time-line">
    <!-- 每日行程 -->
    <div class="day" v-for="(day, dayIdx) in listData" :key="dayIdx">
      <!-- 只有 1 天时不展示 D1 第一天 -->
      <div class="day-name" v-if="listData.length > 1">
        <div class="en">{{day.day_title}}</div>
        <div class="cn">{{day.day_info}}</div>
      </div>

      <!-- 景区信息 -->
      <div class="scenic" v-for="(scenic, scenicIdx) in day.list" :key="scenicIdx">
        <!-- 装饰虚线 -->
        <div class="decoration">
          <div class="dot"></div>
          <div class="dashed"></div>
        </div>

        <div class="row">
          <div class="scenic-name">{{scenic.name}}</div>
          <div
            class="link-detail"
            v-if="scenic.id && scenic.is_click"
            @click="navToScenicDetail(scenic.id, scenic.name)">查看详情</div>
        </div>
        <image :class="['image', 'background-' + (scenicIdx % 7 + 1)]" :src="scenic.img" />
        <div class="desc">{{scenic.desc}}</div>

        <!-- 评论 -->
        <div class="comment" v-if="scenic.comment_info.content">
          <div class="user">
            <image
              v-if="scenic.comment_info.head_img_url"
              :class="['head-img', 'background-' + (scenicIdx % 7 + 1)]"
              :src="scenic.comment_info.head_img_url" />
            <image
              v-else
              :class="['head-img', 'background-' + (scenicIdx % 7 + 1)]"
              src="/static/images/personal/user.png" />
            <div class="nick">{{scenic.comment_info.nick || '游客'}}</div>
          </div>
          <div class="content">{{scenic.comment_info.content}}</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      type: Array,
      default () {
        return []
      }
    },
    detailPath: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    navToScenicDetail (id, name) {
      if (this.detailPath && id) {
        const url = `${this.detailPath}?id=${id}&name=${name || ' '}`
        uni.navigateTo({ url })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang='scss' scoped>

$margin: 40rpx;
$padding: 40rpx;

.time-line {
  .day {
    margin: $margin $margin $margin*3 $margin;
  }

  .day-name {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    z-index: 3;

    .en {
      flex-shrink: 0;
      width: 70rpx;
      height: 70rpx;
      background: #3BC66B;
      border-radius: 50%;

      line-height: 70rpx;
      text-align: center;
      font-size: 26rpx;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: #FFFFFF;
    }

    .cn {
      margin-left: 30rpx;
      font-size: 40rpx;
      font-family: PingFangTC-Semibold;
      font-weight: 600;
      color: #222222;
      line-height: 40rpx;
      @include single-line-text;
    }
  }

  .scenic {
    position: relative;
    padding-left: $padding;
    padding-top: 50rpx;
    // padding-bottom: 50rpx;
    // margin-left 计算：大圆圈直径 / 2 => 使 scenic 左边缘与大圆圈垂直居中对齐
    // margin: 50rpx 0 50rpx 70 / 2rpx;
    margin: 0 0 0 70 / 2rpx;
    font-size: 0;

    .decoration {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      top: 60rpx;
      // 使虚线容器与大圆圈垂直居中对齐
      left: -8rpx;
      width: 16rpx;
      height: 100%;
      // padding-top 计算: (景区名字字号 - 小圆点直径) / 2 => 小圆点与景区名字水平居中对齐
      // padding: (32 - 16) / 2rpx 0 (32 - 16) / 2rpx 0;

      .dashed {
        width: 1rpx;
        height: 100%;
        border-left: dashed 1px #979797;
        opacity: 0.5;
      }

      .dot {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background-color: #3BC66B;
      }
    }

    .row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: baseline;

      .scenic-name {
        font-size: 32rpx;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: #222222;
        line-height: 32rpx;
        @include single-line-text;
      }

      .link-detail {
        flex-shrink: 0;
        font-size: 28rpx;
        font-family: PingFangSC-Light;
        font-weight: 300;
        color: #40C76F;
        line-height: 28rpx;
      }
    }

    .image {
      width: 100%;
      height: 334rpx;
      margin-top: $margin;
      border-radius: 6rpx;
    }

    .desc {
      margin-top: 20rpx;
      line-height: 32 + 24rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Light;
      font-weight: 300;
      color: #222222;
    }
  }

  .comment {
    box-sizing: border-box;
    width: 100%;
    padding: 30rpx;
    margin-top: 20rpx;
    background-color: #F8F8F8;
    border-radius: 6rpx;

    .user {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      .head-img {
        flex-shrink: 0;
        width: 64rpx;
        height: 64rpx;
        border: 1rpx solid #F3F3F7;
        border-radius: 36rpx;
      }

      .nick {
        margin-left: 30rpx;
        font-size: 26rpx;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #999999;
        line-height: 26rpx;
        @include single-line-text;
      }
    }

    .content {
      margin-top: 30rpx;
      line-height: 30 + 16rpx;
      font-size: 30rpx;
      font-family: PingFangSC-Light;
      font-weight: 300;
      color: #444444;
    }
  }
}
</style>
