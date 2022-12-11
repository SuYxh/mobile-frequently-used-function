<template>
  <div class="not-found-page">
    <van-empty image="error" description="not-found" @click="goHome" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  setup() {
    const { push } = useRouter()

    const goHome = () => {
      push('/')
    }

    return {
      goHome
    }
  },
}
</script>

<style lang="scss" scoped>
.not-found-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
