<template>
  <div class="http-page">
    <van-button type="primary" @click="send">获取天气信息</van-button>
    <div v-if="weather.length" class="weather-wrap">
      {{ weather }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import request from '@/libs/request/request'

interface ReqType {
  city: string
  key: string
}

interface ResType {
  city: string
  realtime: any
  future: any[]
}

const weather = ref<any[]>([])

const getWeatherByArea = (data: ReqType) => {
  return request<ReqType, ResType>({
    url: '/simpleWeather/query',
    method: 'GET',
    data,
    interceptors: {
      requestInterceptors (res) {
        console.log('接口请求拦截')

        return res
      },
      responseInterceptors (result) {
        console.log('接口响应拦截')
        return result
      },
    },
  })
}

const send = async () => {
  const res = await getWeatherByArea({
    key: '785603bcf4dca9d2af8a59a2e34964be',
    city: '北京',
  })
  weather.value = res.result?.future ?? []
  console.log(res)
  console.log(res.result)
}

</script>
<style lang="scss" scoped>
.http-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;

  .weather-wrap {
    margin-top: 32px;
  }
}
</style>
