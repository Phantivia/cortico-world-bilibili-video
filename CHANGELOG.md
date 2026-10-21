# Changelog

## 0.2.2

- 浏览器没起来时，日志里记下浏览器程序路径、启动参数、存活时长和浏览器的错误输出。

## 0.2.1

- 在去掉了内置平台 World 的 Cortico 构建(如 Coopanion)里能加载了:弹幕解码改用包内自带的 protobuf 读取器。

## 0.2.0

- 适配 Cortico 0.2.0(world 契约 6):面板改名 WebUI,产物换成 `dist/webui.js`,构建脚本改为 `pnpm build:webui`。
- 定义加 `describe`,附 `describe.json` 给扩展市场读。
