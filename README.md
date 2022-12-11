## 前言

![vue3+vite+vant移动端项目](https://qn.huat.xyz/mac/20221211135456.awebp)



随着vue3相关的生态不断的完善，相应的UI/router/pinia等都已成熟，新的项目也在考虑使用新版本开发了，记录一下用vue3+vite+ts+vant搭建移动端项目的流程。



## 初始化项目

[vite官方中文文档](https://cn.vitejs.dev/) 

> 兼容性注意： Vite 需要 [Node.js](https://nodejs.org/en/) 版本 14.18+，16+。然而，有些模板需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node 版本。
> 

使用 NPM:

```
npm create vite@latest
```

初始化项目可以参考： https://cn.vitejs.dev/guide/



ts问题及其修复

![image-20221211141431357](https://qn.huat.xyz/mac/20221211141431.png)

解决方式：

在和`main.ts`同级新建文件 `shims-vue.d.ts` ：

```ts
declare module "*.vue" {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}
```





## 配置别名

先配置一下别名，后续会用到

### 安装插件

安装：`npm i unplugin-vue-components -D`



### 配置 vite.config

`vite.config.ts` 配置如下：

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import path from 'path';

const resolve = (dir) => path.resolve(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
})
```



### 解决相关报错

1、`path` 和 `__dirname` 报错

安装 `npm i @types/node -D` 即可



2、解决ts路径别名识别问题

![image-20221211142650943](https://qn.huat.xyz/mac/20221211142651.png)

在 `compilerOptions` 下新增：

```ts
// 解析非相对模块的基础地址，默认是当前目录
"baseUrl": "./", 
// 路径映射，相对于baseUrl
"paths": { 
  "@/*": [
    "src/*"
  ]
}
```





## vue-router

Vue Router 是 [Vue.js](https://router.vuejs.org/zh/) 的官方路由。它与 Vue.js 核心深度集成，让用 Vue.js 构建单页应用变得轻而易举。功能包括：

-   嵌套路由映射
-   动态路由选择
-   模块化、基于组件的路由配置
-   路由参数、查询、通配符
-   展示由 Vue.js 的过渡系统提供的过渡效果
-   细致的导航控制
-   自动激活 CSS 类的链接
-   HTML5 history 模式或 hash 模式
-   可定制的滚动行为
-   URL 的正确编码

### 安装

```
npm install vue-router@4
```

### 配置

> 相关文件请自行新建，基本上都是空文件

src/router/index.ts

```ts
import { createRouter, createWebHashHistory } from 'vue-router'

export const constantRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
  },
  // 404 路由
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404/index.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

export default router
```

### 引入

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router).mount('#app')
```

### 404路由问题

**vue3对404配置进行了修改,必须要使用正则匹配**

![image-20221211143721245](https://qn.huat.xyz/mac/20221211143721.png)



```ts
{
  path: '/:pathMatch(.*)*',
  name: '404',
  component: () => import('@/views/404/index.vue'),
 },
```



原因：Vue Router不再使用`path-to-regexp`，而是实现了自己的解析系统，该系统允许路由排名并启用动态路由。由于我们通常会在每个项目中添加一条单独的包罗万象的路线，因此支持的特殊语法没有太大的好处。参数的编码是跨路线编码，无一例外使事情更容易预测。





## Pinia

[Pinia](https://pinia.vuejs.org/zh/) 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。如果你熟悉组合式 API 的话，你可能会认为可以通过一行简单的 `export const state = reactive({})` 来共享一个全局状态。对于单页应用来说确实可以，但如果应用在服务器端渲染，这可能会使你的应用暴露出一些安全漏洞。 而如果使用 Pinia，即使在小型单页应用中，你也可以获得如下功能：

- Devtools 支持
  - 追踪 actions、mutations 的时间线
  - 在组件中展示它们所用到的 Store
  - 让调试更容易的 Time travel
- 热更新
  - 不必重载页面即可修改 Store
  - 开发时可保持当前的 State
- 插件：可通过插件扩展 Pinia 功能
- 为 JS 开发者提供适当的 TypeScript 支持以及**自动补全**功能。
- 支持服务端渲染

### 安装

```
npm install pinia
```

### 引入

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router).use(createPinia()).mount('#app')
```

### 使用

在`src/store`中创建`counter.ts`，并写下基础模板：

```
import { defineStore } from 'pinia'

export const countStore = defineStore('countStore', {
  state: () => {
    return {
      msg: 'Hello Pinia',
      count: 0,
    }
  },
  getters: {
    oath(state) {
      return state.count > 3  ? '卜他年瓜瓞绵绵，尔昌尔炽' : '看此日桃花灼灼，宜室宜家'
    }
  },
  actions: {
    addCount() {
      this.count++
    },
  },
})

```

创建好仓库`countStore(仓库名)`后，在组件中进行使用

```vue
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
```



## CSS 预处理器安装

Vite 提供了对 `.scss`, `.sass`, `.less`, `.styl` 和 `.stylus` 文件的内置支持。没有必要为它们安装特定的 Vite 插件，但必须安装相应的预处理器依赖：

```
npm i sass -D
```

## 移动端适配

**viewport** 之前做移动端适配通常都是使用`lib-flexible`+`postcss-pxtorem`的方案，但是随着viewport单位得到越来越多浏览器的支持，lib-flexible 官方也基本已经废弃，建议大家都使用viewport方案: **postcss-px-to-viewport** 将px单位转换为视口单位的 (vw, vh, vmin, vmax) 的 [PostCSS](https://github.com/postcss/postcss) 插件,将px自动转换成viewport单位vw，vw本质上还是一种百分比单位，100vw即等于100%

### 安装

```
npm install postcss-px-to-viewport --save-dev
```

### 配置

在项目根目录下创建 postcss.config.cjs 文件

```js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      unitToConvert: 'px', // 需要转换的单位，默认为"px"
      viewportWidth: 375, // 设计稿的视口宽度
      exclude: [/node_modules/], // 解决vant375,设计稿750问题。忽略某些文件夹下的文件或特定文件
      unitPrecision: 5, // 单位转换后保留的精度
      propList: ['*'], // 能转化为vw的属性列表
      viewportUnit: 'vw', // 希望使用的视口单位
      fontViewportUnit: 'vw', // 字体使用的视口单位
      selectorBlackList: [], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
      minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
      mediaQuery: false, // 媒体查询里的单位是否需要转换单位
      replace: true, //  是否直接更换属性值，而不添加备用属性
      landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
      landscapeUnit: 'vw', // 横屏时使用的单位
      landscapeWidth: 1125, // 横屏时使用的视口宽度
    },
  },
}
```

这样就配置好了，开发可以根据设计稿的尺寸去配置viewportWidth属性就可以达到一比一的视图开发了，不在需要额外的继续尺寸。

## Vant

[Vant](https://vant-contrib.gitee.io/vant/#/zh-CN/home) 是一个**轻量、可靠的移动端组件库**，于 2017 年开源。

目前 Vant 官方提供了 [Vue 2 版本](https://vant-contrib.gitee.io/vant/v2)、[Vue 3 版本](https://vant-contrib.gitee.io/vant)和[微信小程序版本](http://vant-contrib.gitee.io/vant-weapp)，并由社区团队维护 [React 版本](https://github.com/3lang3/react-vant)和[支付宝小程序版本](https://github.com/ant-move/Vant-Aliapp)。



### 安装

```
npm i vant
```

### 按需引入

在基于 `vite`、`webpack` 或 `vue-cli` 的项目中使用 Vant 时，可以使用 [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) 插件，它可以自动引入组件，并按需引入组件的样式。

相比于常规用法，这种方式可以按需引入组件的 CSS 样式，从而减少一部分代码体积，但使用起来会变得繁琐一些。如果业务对 CSS 的体积要求不是特别极致，我们推荐使用更简便的常规用法。



#### 安装插件

```
npm i unplugin-vue-components -D
```

#### 配置插件

如果是基于 `vite` 的项目，在 `vite.config.js` 文件中配置插件：

```ts
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

export default {
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
};
```

参考： https://vant-contrib.gitee.io/vant/#/zh-CN/quickstart





#### 使用组件

完成以上两步，就可以直接在模板中使用 Vant 组件了，`unplugin-vue-components` 会解析模板并自动注册对应的组件。

```vue
<template>
  <van-button type="primary" />
</template>
```



#### 引入函数组件的样式

Vant 中有个别组件是以函数的形式提供的，包括 `Toast`，`Dialog`，`Notify` 和 `ImagePreview` 组件。在使用函数组件时，`unplugin-vue-components` 无法自动引入对应的样式，因此需要手动引入样式。

```js
// Toast
import { showToast } from 'vant';
import 'vant/es/toast/style';

// Dialog
import { showDialog } from 'vant';
import 'vant/es/dialog/style';

// Notify
import { showNotify } from 'vant';
import 'vant/es/notify/style';

// ImagePreview
import { showImagePreview } from 'vant';
import 'vant/es/image-preview/style';
```



#### 使用提示

- 请避免同时使用「全量引入」和「按需引入」这两种引入方式，否则会导致代码重复、样式错乱等问题。
- unplugin-vue-components 并不是 Vant 官方维护的插件，如果在使用过程中遇到问题，建议优先到 [antfu/unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) 仓库下反馈。



### 封装vant

1、新建`src/libs/plugins/index.ts`:

```ts
import registerVant from './vant'


export default function registerPlugins() {
  return {
    install(app: any) {
      registerVant(app)
    }
  }
}
```



2、新建`src/libs/plugins/vant.ts`:

主要是为了**导入函数组件的样式**

```
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';

/**
 * @description: 不用注册即可使用 参考  https://vant-contrib.gitee.io/vant/#/zh-CN/quickstart#3.-shi-yong-zu-jian
 * @param {any} app
 * @return {*}
 */
function registerVant(app: any) {

}

export default registerVant
```



3、`main.ts` 中注册

```ts
import { createApp } from 'vue'
import registerPlugins from '@/libs/plugins/index'
import App from './App.vue'

const app = createApp(App)

app.use(registerPlugins())

app.mount('#app')
```



后续如果需要在增加什么插件直接在`plugins`文件夹下添加就好了。

## axios封装

参考： [在项目中用ts封装axios，一次封装整个团队受益](https://juejin.cn/post/7071518211392405541)



## 安装eslint及相关插件

参考： https://blog.csdn.net/qq_53225741/article/details/127113104





## 项目地址

https://github.com/SuYxh/vue3-vite-vant-template
