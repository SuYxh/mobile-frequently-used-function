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
