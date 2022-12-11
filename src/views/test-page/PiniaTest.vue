<template>
  <div class="pinia-page">
    <h1>{{ store.msg }}</h1>
    <p>{{ store.oath }}</p>
    <div>
      <span>当前count: {{ count }}</span>
    </div>

    <div class="operation">
      <div>
        <van-button type="primary" @click="handleAdd"> + </van-button>
        <van-button type="success" @click="handleCutDown"> - </van-button>
      </div>
      <div class="margin">
        <van-button type="default" @click="changeMsgAndCount">change msg and count</van-button>
      </div>
      <div class="margin">
        <van-button type="warning" @click="changeCount">changeCount</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { countStore } from '@/store/counter'
const store = countStore()

// 进行解构
const { count } = storeToRefs(store);

const handleAdd = () => {
  // 数据修改方式一
  store.count++;
}

const handleCutDown = () => {
  // 数据修改方式二
  store.$patch({
    count: store.count - 1
  })
 
}

const changeMsgAndCount = () => {
  // 数据修改方式三
 store.$patch((state) => {
    state.count = 99;
    state.msg = 'I\'m Iron Man'
  });
}

const changeCount = () => {
  // 数据修改方式四 通过 action
  store.addCount()
}

</script>

<style lang="scss" scoped>
.pinia-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;

  .operation {
    margin-top: 20px;

    .margin {
      margin-top: 20px;
    }

    button {
      margin-right: 12px;
    }
  }
}
</style>
