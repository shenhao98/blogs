import { defineClientConfig } from '@vuepress/client'
import Icons from './components/Icons/Icons.vue'
import WangyiDecode from './components/WangyiDecode/WangyiDecode.vue'
import Cartoon from './components/Cartoon/Cartoon.vue'
// 引入ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('Icons', Icons)
    app.component('Cartoon', Cartoon)
    app.component('WangyiDecode', WangyiDecode)
    app.use(ElementPlus)
  },
})
