<!-- Owner: src/definition.ts, src/world.ts -->

# cortico-world-bilibili-video

[Cortico](https://github.com/Pal-AI-Lab/Cortico) 的 B 站视频 World(id `bilibili-video`),一个独立的扩展包。
它开一个登录了 B 站的浏览器窗口,这个窗口就是直播画面:bot 在里面逛 B 站、挑视频、看视频,观众看同一个窗口。

## 两种状态

浏览器窗口默认关着,World 启动不开它。打开的途径:控制台「播放状态」面板的「打开浏览器」按钮、bot 的
`bilibili_video_browser open`、或 bot 直接 `bilibili_video_open` / `bilibili_video_search`。操作员开关和手动关窗口都投
`bilibili-video.state` 事件告诉 bot。

| 状态 | 进入 | 工具 |
|---|---|---|
| 窗口没开 | 启动时;`bilibili_video_browser close`;窗口被关 | `bilibili_video_browser`、`bilibili_video_open`、`bilibili_video_search` |
| 逛页面 | 窗口打开;`bilibili_video_exit`;操作员在窗口里换页 | `bilibili_video_open`(BV 号、网址、上次列表的序号,或回首页)、`bilibili_video_search`、`bilibili_video_related`、`bilibili_video_comments`、`bilibili_video_scroll`、`bilibili_video_snapshot` |
| 看视频 | `bilibili_video_play` | `bilibili_video_pause`、`bilibili_video_seek`、`bilibili_video_look`、`bilibili_video_quality`、`bilibili_video_exit` |

所有工具都作用在可见窗口上:搜索是真的打开搜索页再读页面上的卡片;按序号打开先把那张卡片滚进视口;读评论先滚到评论区。
打开视频页不播放;`bilibili_video_play` 进入网页全屏并播放。

操作员直接在窗口里换视频或暂停、继续,World 按主框架导航和播放器状态识别出来,投一条 `bilibili-video.state`
事件说明,不替 bot 做决定:换过的视频等 bot 自己 `bilibili_video_play`。

## 观察帧

看视频时,每隔 `observe.minIntervalSec`(默认 5 秒)投一条 `bilibili-video.scene`,在投递那一刻生成
(`pushDeferred`),所以上一轮模型跑得久,这一张就覆盖更长的一段:

1. 播放器以 `observe.captureFps` 抽帧进候选池(页内 canvas 画 `<video>`,每帧一张单格 JPEG 和 64×36 亮度图)。
   烧在画面里的黑边先裁掉:96×54 的探针找出最亮像素仍是黑的整列整行,裁剪框取最近四次探测的并集,黑边持续约 2 秒才收缩。
   竖屏画面把格子转成竖的(`cellHeight`×`cellWidth`),`bilibili_video_look` 用同一个裁剪框。
2. 格数 = 间隔 × `frameDensity`,封顶 `maxFrames`;采样点从最新帧往回按公比 `ratio` 等比排布(0.618 即黄金分割),每个点在自己的半间距内吸附到亮度差超过 `cutThreshold` 的切换帧。
3. dHash 汉明距离小于 `dedupeHamming` 的帧只留一张,黑场只留一张;剩几帧用几格(1×1、2×1、2×2、3×2、3×3),行优先按时间排。
4. 正文:现在的时刻、每格的时刻、检测到的画面切换与黑场、进入的章节、这段的字幕、这段的视频弹幕(引用上限 `danmaku.maxPerScene`,其余只计数)。

字幕来自页面自己请求的 `x/player/wbi/v2` 里的字幕列表(优先 `ai-zh`),文件由页面用登录态去取;
弹幕来自页面自己拉的 `dm/wbi/web/seg.so` 分段(protobuf,6 分钟一包),按弹幕 id 去重。两者都是旁听页面响应,
World 不自己调 B 站接口。画面里烧进去的硬字幕由模型从帧里读。

## 登录

控制台「B 站授权」面板:生成二维码,手机 B 站扫码,确认后 World 从 `qrcode/poll` 的响应里拿到整套 cookie,
存到 `<数据目录>/bilibili-video/cookies.json`;浏览器每次启动和每次导航前经 DevTools 协议注入。
不登录只能看 360P、拿不到字幕列表。「核验登录」调 `x/web-interface/nav` 看 cookie 是否仍有效。
「数据」页签可清除 cookie。

## 卡住、画质与 CDN

播放没有推进超过 `playback.stallSec`(默认 6 秒)投一条 `bilibili-video.state`,带缓冲到的位置和当前画质;恢复再投一条。
`bilibili_video_quality` 不带参数列出播放器画质菜单的档位,带 `level` 就点菜单里的那一档;标「大会员」或「登录即享」的档位点了不生效。
`browser.uposHost` 填了主机名(海外常用 `upos-hz-mirrorakam.akamaized.net`)时,World 用 DevTools 的请求拦截把
`upos-*.bilivideo.com` 的分片请求改到那台主机;留空由播放器自己选 CDN。

## 浏览器

默认启动本机 Chrome 或 Edge,资料目录 `<数据目录>/bilibili-video/browser`;`browser.cdpUrl` 填了就接管一个
用 `--remote-debugging-port` 起的浏览器。OBS 用窗口捕获取这个窗口;声音走浏览器的默认输出设备。

World 自己启动的浏览器带 `--disable-backgrounding-occluded-windows --disable-renderer-backgrounding
--disable-background-timer-throttling`,窗口被挡住也照常渲染和滚动。接管的浏览器要自己带上这三个参数,
否则窗口被挡住或最小化时页面停止渲染:滚动不生效、评论区不加载、抽到的帧停在老位置。

从某些宿主进程(沙箱、服务)启动的 Chrome 窗口在屏幕上是黑的,页面照常工作但观众看不到;由 bot 进程本身启动不受影响,
排查时用 `cdpUrl` 接管一个手动启动的窗口。

## 安装

```bash
corepack pnpm install
corepack pnpm build:console
cd <Cortico>/extensions && corepack pnpm add --ignore-workspace <本目录的绝对路径>
```

整进程重启后在控制台启用「B 站视频」,扫码登录。

## 开发

```bash
corepack pnpm typecheck
corepack pnpm test
```

测试只覆盖不碰浏览器的部分:选帧与网格、弹幕段解码与字幕解析、cookie 解析。

## 许可

MIT。
