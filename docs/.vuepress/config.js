import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'

export default defineUserConfig({
  bundler: viteBundler(),
  base: 'blogs',
  theme: defaultTheme({
    logo: 'xaizai.png',
    navbar: [
      {
        text: '首页',
        link: '/',
      },
       {
        text: '导航',
        link: '/',
      },
    ],
    sidebar: [
      // SidebarItem
      {
        text: 'Foo',
        prefix: '/foo/',
        link: 'https://github.com',
      },
      // 字符串 - 页面文件路径
      '/bar/README.md',
    ],
  }),
  lang: 'zh-CN',
  title: '你好， VuePress ！',
  description: '这是我的第一个 VuePress 站点',
  plugins: [
    docsearchPlugin({
      // 配置项
    }),
  ],
})

