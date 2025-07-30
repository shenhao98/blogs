import { defineClientConfig } from '@vuepress/client';
import Icons from './components/Icons/Icons.vue';
import WangyiDecode from './components/WangyiDecode/WangyiDecode.vue';
// 引入ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
export default defineClientConfig({
	enhance({ app, router, siteData }) {
		app.component('Icons', Icons)
		app.component('WangyiDecode', WangyiDecode)
		app.use(ElementPlus)
	},
});
