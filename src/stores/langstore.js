import { defineStore } from 'pinia'

export const useLangStore = defineStore('lang', {
  state: () => ({
    lang: navigator.language.startsWith('tr') ? 'tr' : 'en'  // Tarayıcı diline göre default
  }),
  actions: {
    setLang(newLang) {
      this.lang = newLang
    }
  }
})
