# Changelog

## 0.2.3

- 修 Windows 上浏览器起不来(#6):启动程序退出 0 不再当失败，接着等真正的浏览器开出调试端口。做法取自 alont1 的修复版。
- 调试端口交给浏览器自己选(`--remote-debugging-port=0`),从资料目录的 DevToolsActivePort 读出来再连。
- `browser.profileDir` 留空时，每次启动在 `bilibili-video/profiles` 下新建资料目录，关掉浏览器后删除;之前的 `bilibili-video/browser` 不再使用，可以手动删掉。直接在浏览器网页上登录的账号不会留到下次，登录请用授权面板。

## 0.2.2

- 浏览器没起来时，日志里记下浏览器程序路径、启动参数、存活时长和浏览器的错误输出。

## 0.2.1

- 在去掉了内置平台 World 的 Cortico 构建(如 Coopanion)里能加载了:弹幕解码改用包内自带的 protobuf 读取器。

## 0.2.0

- 适配 Cortico 0.2.0(world 契约 6):面板改名 WebUI,产物换成 `dist/webui.js`,构建脚本改为 `pnpm build:webui`。
- 定义加 `describe`,附 `describe.json` 给扩展市场读。
