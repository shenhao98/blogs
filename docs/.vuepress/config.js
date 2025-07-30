import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'

export default defineUserConfig({
  bundler: viteBundler(),
  base: 'blogs',
  head: [
    ['script', { src: '//at.alicdn.com/t/c/font_4941112_ahcgieo04sl.js' }],
    ['link', { rel: 'icon', href: '/blogs/mianmian.png' }],
  ],
  theme: defaultTheme({
    logo: 'mianmian.png',
    navbar: [
      {
        text: '鸿蒙开发',
        prefix: '/harmony/',
        children: [
          'deveco.md',
          'arkui.md',
        ]
      },
      {
        text: '工具网站',
        prefix: '/site-tools/',
        children: [
          'ui.md',
          'tool.md',
        ]
      },
      {
        text: '前端开发问题',
        prefix: '/front/',
        children: [
          'question.md',
        ]
      },
      {
        text: '仅供个人学习',
        prefix: '/my-utils/',
        children: [
          'wangyiyun.md',
        ]
      },
    ],
  }),
  lang: 'zh-CN',
  title: 'Coder.H',
  plugins: [
    docsearchPlugin({
      // 配置项
    }),
  ],
})

