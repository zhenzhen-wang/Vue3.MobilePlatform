# Vue3.MobilePlatform

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 项目说明：
1. 项目封装了多个自定义组件，如：手机号码验证，手写签名等
2. 目录component中组件为自定义组件，根据vant做了二次封装，都是以base开头
3. directive指令：permission，用于控制不同权限人员UI的可见范围
4. 在路由导航守卫中，构造企业微信网页授权链接，获取code
5. 在strore/parameter中，通过pinia对企业微信的uerid做持久化，保存于sessionStorage中
6. utils/http中对Axios做了二次封装，便于使用
7. 请求企业新接口，借助nginx做转发解决跨域，本项目后端api已做跨域处理
8. 编写docekfile文件，将程式发布到linux docker中
9. 项目运行UI界面如下文档：
[项目案例UI展示.docx](https://github.com/zhenzhen-wang/Vue3.MobilePlatform/files/10191392/UI.docx)

