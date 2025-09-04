import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { prismjsPlugin } from '@vuepress/plugin-prismjs'
export default defineUserConfig({
  bundler: viteBundler(),
  base: '/blogs/',
  head: [
    ['script', { src: '//at.alicdn.com/t/c/font_4941112_ahcgieo04sl.js' }],
    ['link', { rel: 'icon', href: '/blogs/mianmian.png' }],
  ],
  theme: defaultTheme({
    logo: 'mianmian.png',
    navbar: [
      {
        text: '仅供个人学习',
        link: '/study/',
      },
      {
        text: '工具网站',
        link: '/site-tools/tool',
      },
      {
        text: '前端开发问题',
        link: '/front/',
      },
      {
        text: '鸿蒙开发',
        link: '/harmony/arkui',
      },
      {
        text: '问题',
        link: '/problem/index',
      },
      {
        text: '工具命令',
        link: '/command/git',
      },
    ],
    sidebar: {
      '/problem/': [
      ],
      '/harmony/': [
        {
          text: "ArkUI",
          link: 'arkui'
        },
        {
          text: "Deveco",
          link: 'deveco'
        },
      ],
      '/site-tools/': [
        {
          text: "工具",
          link: 'tool'
        },
        {
          text: "UI相关",
          link: 'ui'
        },
      ],
      '/front/': [
        {
          text: "综合",
          link: 'index'
        },
        {
          text: "js问题",
          link: 'question'
        },
        {
          text: "uniapp开发",
          link: 'uniapp'
        },
        {
          text: "css效果",
          link: 'css-effect'
        },
      ],
      '/study/': [
        {
          text: "介绍",
          link: "index"
        },
        {
          text: "kali系统",
          link: "kali"
        },
        {
          text: "网易云",
          link: 'wangyiyun'
        }
      ],
      '/command/': [
        {
          text: "git命令",
          link: "git"
        },
      ],
    },
    sidebarDepth: 4
  }),
  plugins: [
    prismjsPlugin({
      // 配置项
      lineNumbers: true,
      themes: {
        light: 'ateliersulphurpool-light',
        dark: 'one-dark'
      },
      collapsedLines: 15
    }),
  ],
  lang: 'zh-CN',
  title: 'Coder.H',
})

