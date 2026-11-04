<!-- Owner: src/definition.ts, src/world.ts -->

# B 站视频 · Bilibili Video

[中文](#中文) · [English](#english)

让 Coo 在一个登录了 B 站的浏览器窗口里逛 B 站、挑视频、看视频。
Lets Coo browse and watch bilibili videos in a signed-in browser window.

## 中文

[Cortico](https://github.com/Pal-AI-Lab/Cortico) 的 World(id `bilibili-video`)。它开一个登录了 B 站的浏览器窗口,这个窗口就是直播画面:Coo 在里面搜视频、读评论、看视频,观众用 OBS 捕获同一个窗口,和 Coo 看同一个画面。看视频时,Coo 定时收到这段画面的拼图、字幕和视频自带的弹幕。

此乃直播测试验证之后的world，和其他 Persona / 非直播场景的兼容性有待测试。

### 功能

- 打开或关闭浏览器窗口,World 页签和 Coo 都能开关。
- 逛页面:搜索视频、打开视频页或首页、按上次列表的序号打开、看相关推荐、读评论区(热评在前)、上下滚动、截一张窗口图。
- 看视频:网页全屏播放、暂停、跳到某一秒或前后跳一段、取当前画面的大图并放大局部、查看和切换画质。
- 观看时每隔几秒把这段画面拼成一张分镜图(1 到 9 格,裁掉黑边、去掉重复画面、标出画面切换与黑场),连同这段的 CC 或 AI 字幕、视频自带的历史弹幕推给 Coo。
- 操作员直接在窗口里换视频、暂停或继续,窗口被关,视频播完,播放卡住与恢复,Coo 都会收到通知。换过的视频等 Coo 自己决定播不播。
- 扫码登录 B 站,登录态保存下来,每次开浏览器自动带上。

### 安装前准备

1. **Chrome 或 Edge**。World 自己启动浏览器,会在这些位置找:
   - Windows:`Program Files`、`Program Files (x86)` 或 `%LOCALAPPDATA%` 下的 `Google\Chrome\Application\chrome.exe`,以及 `Program Files`、`Program Files (x86)` 下的 `Microsoft\Edge\Application\msedge.exe`。
   - macOS:`/Applications/Google Chrome.app`、`/Applications/Microsoft Edge.app`。
   - Linux:`/usr/bin/google-chrome`、`/usr/bin/chromium`、`/usr/bin/chromium-browser`、`/usr/bin/microsoft-edge`。

   装在别处时,在配置里把 `browser.executableFile` 填成浏览器程序的完整路径。一个都没找到时,面板和 Coo 的工具回执会提示「这台电脑上没找到 Chrome 或 Edge」。
2. **B 站账号和手机上的 B 站 App**,用来扫码登录。不登录也能用,但看不到需要登录的清晰度,也拿不到字幕。登录在安装后的 World 页签里做,见下面「使用」。
3. **直播时**:在 OBS 里加一个「窗口捕获」源,选这个浏览器窗口。声音走浏览器的默认输出设备。

### 安装

在 Cortico 或 Coopanion 的扩展页搜 `cortico-world-bilibili-video` 安装,重启后在 World 总览里启用「B 站视频」。

命令行装法:

```bash
cd <Cortico>/extensions
corepack pnpm add cortico-world-bilibili-video
```

### 使用

1. 启用后打开 World 页签的「B 站授权」面板,点「生成二维码」,用手机 B 站扫码并确认。面板显示「已登录」和账号名就好了。「核验登录」检查登录是否仍有效,「登出」清掉登录。
2. 浏览器窗口默认关着。在「播放状态」面板点「打开浏览器」,或者让 Coo 自己打开(Coo 打开视频或搜索时也会顺手打开)。窗口停在 B 站首页。
3. 之后由 Coo 操作:搜视频、点开、读评论,挑中了就开始播放。「播放状态」面板显示当前页面、视频、进度、字幕和最近一张观察帧。
4. 看视频时 Coo 定时收到观察帧,像一起看片的人那样搭话,没什么可说就不说。操作员可以直接在窗口里换视频或暂停,Coo 会收到通知。
5. 不看了点「关闭浏览器」,或者让 Coo 关掉。

登录态存在数据目录的 `bilibili-video/cookies.json`,「数据」页签里的「登录 cookie」可以清除。

### 配置

常用项在 World 页签的配置里,也可以写在部署 `config.json` 的 `worlds.bilibili-video`。

| 键 | 默认 | 说明 |
|---|---|---|
| `browser.executableFile` | 空 | 浏览器程序路径;留空自动找 Chrome 或 Edge |
| `browser.cdpUrl` | 空 | 填调试地址(如 `http://127.0.0.1:9333`)就接管一个已开的浏览器,不自己启动 |
| `browser.profileDir` | 空 | 留空每次启动新建资料目录,关掉后删除;填了就一直用这个目录 |
| `browser.windowWidth` / `windowHeight` | 1280 / 720 | 浏览器窗口大小 |
| `browser.uposHost` | 空 | 视频分片 CDN 主机,海外常用 `upos-hz-mirrorakam.akamaized.net`;改后重启 World 生效 |
| `observe.minIntervalSec` | 5 | 两张观察帧之间最短的间隔(秒) |
| `observe.maxFrames` | 9 | 一张观察帧的格数上限 |
| `danmaku.enabled` / `maxPerScene` | true / 12 | 观察帧里附视频弹幕,以及每张引用几条 |
| `subtitle.enabled` | true | 观察帧里附字幕 |
| `playback.stallSec` | 6 | 播放不推进超过这么久算卡住 |

其余见 [`src/config.ts`](https://github.com/Phantivia/cortico-world-bilibili-video/blob/main/src/config.ts)。选帧、字幕与弹幕的来源、浏览器启动参数等实现细节见 [docs/internals.md](https://github.com/Phantivia/cortico-world-bilibili-video/blob/main/docs/internals.md)。

### 限制与常见问题

- 观看时每隔几秒就有一张观察帧让 Coo 跑一轮,token 用得快。调大 `observe.minIntervalSec` 或调小 `observe.maxFrames` 能省一些。
- 直接在浏览器网页上登录的账号不会留到下次(每次启动用新的资料目录)。登录请用「B 站授权」面板。
- 标「大会员」或「登录即享」的画质档位点了不生效。播放老是卡,让 Coo 降一档画质;海外网络可以试 `browser.uposHost`。
- 用 `browser.cdpUrl` 接管自己开的浏览器时,启动参数要带上 `--disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-background-timer-throttling`,否则窗口被挡住或最小化后页面停止渲染。
- 从某些宿主进程(沙箱、服务)启动的 Chrome 窗口在屏幕上是黑的,页面照常工作但观众看不到。遇到时用 `browser.cdpUrl` 接管一个手动启动的窗口。
- 观察帧里的「视频弹幕」是这个视频以前的观众留下的,不是直播间现在的弹幕。

## English

A World for [Cortico](https://github.com/Pal-AI-Lab/Cortico) (id `bilibili-video`). It opens a browser window signed in to bilibili, and that window is the stream picture: Coo searches for videos, reads comments and watches in it, while the audience sees the same window through an OBS window capture. During playback, Coo receives a grid of recent frames at intervals, together with the subtitles and the video's own danmaku.

Verified on live streams. Compatibility with other Personas and non-streaming setups has not been tested.

### Features

- Opens or closes the browser window, from the World tab or by Coo.
- Browsing: search videos, open a video page or the home page, open an item from the last list by number, list related videos, read comments (top comments first), scroll, and take a snapshot of the window.
- Watching: full-page playback, pause, seek to a second or by an offset, take a large image of the current frame with optional zoom, and list or change the quality.
- While watching, every few seconds the recent stretch is laid out as a grid of 1 to 9 frames (black bars cropped, repeated frames dropped, cuts and black frames noted) and sent to Coo with the CC or AI subtitles and the video's historical danmaku for that stretch.
- Coo is told when the operator changes video, pauses or resumes in the window, when the window is closed, when the video ends, and when playback stalls or recovers. A video the operator switched to waits for Coo to decide whether to play it.
- QR-code sign-in to bilibili. The session is saved and applied every time the browser opens.

### Before you install

1. **Chrome or Edge.** The World launches the browser itself and looks in these places:
   - Windows: `Google\Chrome\Application\chrome.exe` under `Program Files`, `Program Files (x86)` or `%LOCALAPPDATA%`, and `Microsoft\Edge\Application\msedge.exe` under `Program Files` or `Program Files (x86)`.
   - macOS: `/Applications/Google Chrome.app`, `/Applications/Microsoft Edge.app`.
   - Linux: `/usr/bin/google-chrome`, `/usr/bin/chromium`, `/usr/bin/chromium-browser`, `/usr/bin/microsoft-edge`.

   If yours is elsewhere, set `browser.executableFile` to the full path of the browser program. When none is found, the panel and Coo's tool result say no Chrome or Edge was found on this computer.
2. **A bilibili account and the bilibili mobile app**, to scan the sign-in QR code. The World works without signing in, but login-only qualities and subtitles are then unavailable. Sign-in happens in the World tab after install; see Usage.
3. **For streaming:** add a Window Capture source in OBS and pick this browser window. Sound goes to the browser's default output device.

### Install

Search for `cortico-world-bilibili-video` on the Extensions page of Cortico or Coopanion, install it, restart, and enable 「B 站视频」 in the World overview.

From the command line:

```bash
cd <Cortico>/extensions
corepack pnpm add cortico-world-bilibili-video
```

### Usage

1. After enabling, open the 「B 站授权」 (bilibili sign-in) panel in the World tab, click 「生成二维码」 (generate QR code), then scan and confirm with the bilibili app. The panel then shows 「已登录」 (signed in) and the account name. 「核验登录」 checks whether the session is still valid; 「登出」 signs out.
2. The browser window starts closed. Click 「打开浏览器」 (open browser) in the 「播放状态」 (playback) panel, or let Coo open it; opening a video or searching opens it too. The window starts on the bilibili home page.
3. From there Coo drives: searches, opens videos, reads comments and starts playing the one it picks. The playback panel shows the current page, video, progress, subtitles and the latest observation grid.
4. While watching, Coo gets observation grids at intervals and chats like someone watching along, or stays quiet when there is nothing to say. The operator can change video or pause directly in the window, and Coo is told.
5. To stop, click 「关闭浏览器」 (close browser) or ask Coo to close it.

The session is stored in `bilibili-video/cookies.json` under the data directory. Clear it with 「登录 cookie」 (sign-in cookies) on the Data tab.

### Configuration

Common keys are in the World tab's settings, or under `worlds.bilibili-video` in the deployment's `config.json`.

| Key | Default | Meaning |
|---|---|---|
| `browser.executableFile` | empty | Browser program path; empty finds Chrome or Edge |
| `browser.cdpUrl` | empty | A debugging address (e.g. `http://127.0.0.1:9333`) to attach to a running browser instead of launching one |
| `browser.profileDir` | empty | Empty creates a fresh profile per launch and removes it afterwards; set it to keep one profile |
| `browser.windowWidth` / `windowHeight` | 1280 / 720 | Browser window size |
| `browser.uposHost` | empty | CDN host for video segments, e.g. `upos-hz-mirrorakam.akamaized.net` outside China; restart the World after changing |
| `observe.minIntervalSec` | 5 | Shortest gap between two observation grids, in seconds |
| `observe.maxFrames` | 9 | Most frames in one grid |
| `danmaku.enabled` / `maxPerScene` | true / 12 | Include the video's danmaku, and how many lines to quote per grid |
| `subtitle.enabled` | true | Include subtitles |
| `playback.stallSec` | 6 | Playback not advancing this long counts as a stall |

The rest is in [`src/config.ts`](https://github.com/Phantivia/cortico-world-bilibili-video/blob/main/src/config.ts). Frame selection, where subtitles and danmaku come from, browser launch flags and other internals are in [docs/internals.md](https://github.com/Phantivia/cortico-world-bilibili-video/blob/main/docs/internals.md) (Chinese).

### Limits and FAQ

- Each observation grid runs a model round every few seconds while watching, so tokens go quickly. A larger `observe.minIntervalSec` or a smaller `observe.maxFrames` saves some.
- Signing in on a web page inside the browser does not carry over to the next launch, since every launch uses a fresh profile. Sign in through the sign-in panel.
- Qualities marked 「大会员」 (premium) or 「登录即享」 (sign-in required) do not take effect when picked. If playback keeps stalling, have Coo drop a quality level; outside China, try `browser.uposHost`.
- When attaching your own browser with `browser.cdpUrl`, start it with `--disable-backgrounding-occluded-windows --disable-renderer-backgrounding --disable-background-timer-throttling`, or the page stops rendering when the window is covered or minimized.
- Chrome launched from some host processes (sandboxes, services) shows a black window. The page still works, but the audience sees nothing. Use `browser.cdpUrl` to attach a window you started by hand.
- The "video danmaku" in observation grids was left by the video's past viewers, not by the current stream chat.

## 开发 · Development

```bash
corepack pnpm install
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build:webui
```

测试只覆盖不碰浏览器的部分:选帧与网格、弹幕段解码与字幕解析、cookie 解析。
Tests cover the parts that do not touch the browser: frame selection and grids, danmaku segment decoding, subtitle parsing and cookie parsing.

## 许可 · License

MIT
