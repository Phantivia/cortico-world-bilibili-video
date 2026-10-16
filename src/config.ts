/** Config section `worlds.bilibili-video`, defaults and the WebUI config group. */
import type { ConfigGroup } from 'cortico/core/config-schema.ts';
import type { WorldSection } from 'cortico/world.ts';

export const BILIBILI_VIDEO_ID = 'bilibili-video';

export interface BilibiliVideoConfigSection extends WorldSection {
  browser: {
    /** Empty: the first Chrome or Edge found in the usual install places. */
    executableFile: string;
    /** The launched browser's profile directory. Empty: `bilibili-video/browser` in the data directory. */
    profileDir: string;
    /** Attach to a browser already started with --remote-debugging-port instead of launching one. */
    cdpUrl: string;
    windowWidth: number;
    windowHeight: number;
    /** Window position on launch; both 0 leaves it where the browser opens. */
    windowLeft: number;
    windowTop: number;
    /**
     * Host that media segment requests to `upos-*.bilivideo.com` are redirected to, e.g.
     * `upos-hz-mirrorakam.akamaized.net` outside China. Empty: the player's own choice.
     */
    uposHost: string;
  };
  playback: {
    /** Playback not advancing this long while not paused is reported as a stall. */
    stallSec: number;
  };
  observe: {
    /** Shortest gap between two observation frames; a longer model round stretches it. */
    minIntervalSec: number;
    /** Frames per second of video the observation aims for; the grid grows with the gap. */
    frameDensity: number;
    /** Grid cap, 1–9. */
    maxFrames: number;
    cellWidth: number;
    cellHeight: number;
    /** Frames sampled from the player per second, the pool the observation picks from. */
    captureFps: number;
    /** Geometric ratio of sampling positions measured back from the newest frame. */
    ratio: number;
    /** dHash Hamming distance under which two frames count as the same picture. */
    dedupeHamming: number;
    /** Mean absolute luma difference (0–255) between successive samples that counts as a cut. */
    cutThreshold: number;
    /** Mean luma (0–255) under which a sample counts as black. */
    blackLuma: number;
    /** JPEG quality 0–1 of frames and grids. */
    jpegQuality: number;
  };
  /** The video's own danmaku, loaded from its history as the player does. */
  danmaku: {
    enabled: boolean;
    /** Lines quoted per observation; the rest is counted. */
    maxPerScene: number;
  };
  subtitle: {
    enabled: boolean;
  };
}

export const BILIBILI_VIDEO_DEFAULTS: BilibiliVideoConfigSection = {
  enabled: false,
  browser: { executableFile: '', profileDir: '', cdpUrl: '', windowWidth: 1280, windowHeight: 720, windowLeft: 0, windowTop: 0, uposHost: '' },
  playback: { stallSec: 6 },
  observe: {
    minIntervalSec: 5,
    frameDensity: 0.8,
    maxFrames: 9,
    cellWidth: 640,
    cellHeight: 360,
    captureFps: 2,
    ratio: 0.618,
    dedupeHamming: 6,
    cutThreshold: 40,
    blackLuma: 16,
    jpegQuality: 0.8,
  },
  danmaku: { enabled: true, maxPerScene: 12 },
  subtitle: { enabled: true },
};

const K = `worlds.${BILIBILI_VIDEO_ID}`;

export const BILIBILI_VIDEO_CONFIG_GROUP: ConfigGroup = {
  id: `world:${BILIBILI_VIDEO_ID}`,
  owner: `world:${BILIBILI_VIDEO_ID}`,
  schema: {
    type: 'object',
    title: 'B 站视频',
    properties: {
      [`${K}.observe.minIntervalSec`]: { type: 'number', title: '观察间隔', minimum: 2, maximum: 120, 'x-suffix': 's', description: '两张观察帧之间最短的间隔;模型一轮更长时间隔跟着变长,格数按密度补上。', 'x-hot': true },
      [`${K}.observe.frameDensity`]: { type: 'number', title: '帧密度', minimum: 0.1, maximum: 2, 'x-suffix': '帧/s', description: '一张观察帧覆盖的时间里平均每秒取几帧;格数 = 间隔 × 密度,封顶在格数上限。', 'x-hot': true },
      [`${K}.observe.maxFrames`]: { type: 'integer', title: '格数上限', minimum: 1, maximum: 9, 'x-hot': true },
      [`${K}.observe.cellWidth`]: { type: 'integer', title: '单格宽', minimum: 160, maximum: 1920, 'x-suffix': 'px' },
      [`${K}.observe.cellHeight`]: { type: 'integer', title: '单格高', minimum: 90, maximum: 1080, 'x-suffix': 'px' },
      [`${K}.observe.captureFps`]: { type: 'number', title: '采样帧率', minimum: 0.5, maximum: 5, 'x-suffix': 'fps', description: '从播放器抽帧进候选池的频率。' },
      [`${K}.observe.ratio`]: { type: 'number', title: '位置公比', minimum: 0.3, maximum: 0.9, description: '采样点从最新帧往回按等比排布的公比;0.618 是黄金分割。', 'x-hot': true },
      [`${K}.observe.dedupeHamming`]: { type: 'integer', title: '相同画面阈值', minimum: 0, maximum: 20, description: 'dHash 汉明距离小于它的两帧视为同一画面,只留一帧。', 'x-hot': true },
      [`${K}.observe.cutThreshold`]: { type: 'number', title: '切换阈值', minimum: 5, maximum: 200, description: '相邻样本平均亮度差超过它记为画面切换,采样点吸附到切换后的第一帧。', 'x-hot': true },
      [`${K}.observe.blackLuma`]: { type: 'number', title: '黑场亮度', minimum: 0, maximum: 64, 'x-hot': true },
      [`${K}.observe.jpegQuality`]: { type: 'number', title: 'JPEG 质量', minimum: 0.3, maximum: 1, 'x-hot': true },
      [`${K}.danmaku.enabled`]: { type: 'boolean', title: '附视频弹幕', description: '把这段时间里视频自带的历史弹幕写进观察帧。', 'x-hot': true },
      [`${K}.danmaku.maxPerScene`]: { type: 'integer', title: '每张引用弹幕数', minimum: 0, maximum: 60, 'x-hot': true },
      [`${K}.subtitle.enabled`]: { type: 'boolean', title: '附字幕', description: '视频有 CC 或 AI 字幕时,把这段时间的字幕写进观察帧。', 'x-hot': true },
      [`${K}.browser.executableFile`]: { type: 'string', title: '浏览器程序', description: '留空自动找 Chrome 或 Edge。' },
      [`${K}.browser.profileDir`]: { type: 'string', title: '浏览器资料目录', description: '留空用数据目录下的 bilibili-video/browser。登录态不存在这里,存在授权面板保存的 cookie 里。' },
      [`${K}.browser.cdpUrl`]: { type: 'string', title: '接管已开的浏览器', description: '填调试地址(如 http://127.0.0.1:9333)就不自己启动浏览器。' },
      [`${K}.browser.windowWidth`]: { type: 'integer', title: '窗口宽', minimum: 640, maximum: 3840, 'x-suffix': 'px' },
      [`${K}.browser.windowHeight`]: { type: 'integer', title: '窗口高', minimum: 360, maximum: 2160, 'x-suffix': 'px' },
      [`${K}.browser.windowLeft`]: { type: 'integer', title: '窗口左边', minimum: -8192, maximum: 8192, 'x-suffix': 'px', description: '与「窗口上边」都为 0 时不指定位置。' },
      [`${K}.browser.windowTop`]: { type: 'integer', title: '窗口上边', minimum: -8192, maximum: 8192, 'x-suffix': 'px' },
      [`${K}.browser.uposHost`]: { type: 'string', title: '视频分片 CDN 主机', description: '填了就把 upos-*.bilivideo.com 的分片请求改到这个主机,例如海外用 upos-hz-mirrorakam.akamaized.net;留空由播放器自己选。改后重启 World 生效。' },
      [`${K}.playback.stallSec`]: { type: 'number', title: '卡住判定', minimum: 2, maximum: 60, 'x-suffix': 's', description: '播放没有推进超过这么久就投一条卡住事件。', 'x-hot': true },
    },
  },
};
