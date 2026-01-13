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
    contributors: false,
    navbar: [
      {
        text: '仅供个人学习',
        link: '/study/',
        activeMatch: '^/study/',
      },
      {
        text: '工具网站',
        link: '/site-tools/tool',
        activeMatch: '^/site-tools/',
      },
      {
        text: '前端开发问题',
        link: '/front/',
        activeMatch: '^/front/',
      },
      {
        text: '鸿蒙开发',
        link: '/harmony/arkui',
        activeMatch: '^/harmony/',
      },
      {
        text: '安卓开发',
        link: '/android/',
        activeMatch: '^/android/',
      },
      {
        text: '微信开发',
        link: '/miniapp/',
        activeMatch: '^/miniapp/',
      },
      {
        text: '问题',
        link: '/problem/index',
        activeMatch: '^/problem/',
      },
      {
        text: '软件包使用',
        link: '/command/git',
        activeMatch: '^/command/',
      },
      {
        text: '工具配置',
        link: '/tool-config/vscode',
        activeMatch: '^/tool-config/',
      },
      {
        text: '插件',
        link: '/plugins/xlsx',
        activeMatch: '^/plugins/',
      },
    ],
    sidebar: {
      '/problem/': [],
      '/plugins/': [
        {
          text: 'xlsx',
          link: 'xlsx',
        },
      ],
      '/tool-config/': [
        {
          text: 'vscode配置',
          link: 'vscode',
        },
      ],
      '/harmony/': [
        {
          text: 'ArkUI',
          link: 'arkui',
        },
        {
          text: 'Deveco',
          link: 'deveco',
        },
      ],
      '/site-tools/': [
        {
          text: '工具',
          link: 'tool',
        },
        {
          text: 'UI相关',
          link: 'ui',
        },
      ],
      '/miniapp/': [
        {
          text: '问题',
          link: 'index',
        },
      ],
      '/front/': [
        {
          text: '综合',
          link: 'index',
        },
        {
          text: 'js问题',
          link: 'question',
        },
        {
          text: 'uniapp开发',
          link: 'uniapp',
        },
        {
          text: 'css效果',
          link: 'css-effect',
        },
      ],
      '/study/': [
        {
          text: '介绍',
          link: 'index',
        },
        {
          text: 'kali系统',
          link: 'kali',
        },
        {
          text: '网易云',
          link: 'wangyiyun',
        },
      ],
      '/command/': [
        {
          text: 'git命令',
          link: 'git',
        },
        {
          text: 'WebAssembly',
          link: 'webAssembly',
        },
      ],
    },
    sidebarDepth: 4,
  }),
  plugins: [
    prismjsPlugin({
      // 配置项
      lineNumbers: true,
      themes: {
        light: 'ateliersulphurpool-light',
        dark: 'one-dark',
      },
      collapsedLines: 15,
    }),
  ],
  lang: 'zh-CN',
  title: 'Coder.H',
})
