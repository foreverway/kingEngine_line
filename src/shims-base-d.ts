import Vue from 'vue'
import { Base } from './utils/base'

declare module 'vue/types/vue' {
  interface Vue {
    $base: Base;
  }
}
