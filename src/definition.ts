import type { WorldDefinition } from 'cortico/world.ts';
import { BILIBILI_VIDEO_DEFAULTS, BILIBILI_VIDEO_ID, type BilibiliVideoConfigSection } from './config.ts';
import { BilibiliVideoWorld } from './world.ts';

export const BILIBILI_VIDEO: WorldDefinition<BilibiliVideoConfigSection> = {
  id: BILIBILI_VIDEO_ID,
  label: 'B 站视频',
  defaults: () => structuredClone(BILIBILI_VIDEO_DEFAULTS),
  // ctx.cfg is the live `worlds.bilibili-video` section: every key is read at use
  create: (ctx) => new BilibiliVideoWorld({ cfg: ctx.cfg, timezone: ctx.timezone, dataDir: ctx.dataDir }),
};
