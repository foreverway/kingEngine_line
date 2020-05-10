import _Vue from 'vue'
import dateFormatFilter from './dateFormat'
import dictByItem from './dictByName'
const injectFilters = (Vue:typeof _Vue) => {
  Vue.filter('dateFormat', dateFormatFilter)
  Vue.filter('dictByItem', dictByItem)
}
export default injectFilters
