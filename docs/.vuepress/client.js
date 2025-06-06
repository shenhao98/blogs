import { defineClientConfig } from '@vuepress/client';
import Icons from './components/Icons/Icons.vue';
export default defineClientConfig({
	enhance({ app, router, siteData }) {
		app.component('Icons', Icons)
	},
});
