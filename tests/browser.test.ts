import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { waitForDevtools } from '../src/browser.ts';

describe('waitForDevtools', () => {
  let dir = '';
  afterEach(() => { if (dir) rmSync(dir, { recursive: true, force: true }); });

  it('keeps waiting after the launcher exits 0 and returns the endpoint the profile reports', async () => {
    dir = mkdtempSync(join(tmpdir(), 'bv-devtools-'));
    setTimeout(() => writeFileSync(join(dir, 'DevToolsActivePort'), '53111\n/devtools/browser/abc-123'), 600);
    const ws = await waitForDevtools(dir, 5000, { exitCode: 0, signalCode: null });
    expect(ws).toBe('ws://127.0.0.1:53111/devtools/browser/abc-123');
  });

  it('stops at a non-zero exit', async () => {
    dir = mkdtempSync(join(tmpdir(), 'bv-devtools-'));
    await expect(waitForDevtools(dir, 5000, { exitCode: 21, signalCode: null })).rejects.toThrow('已退出(21)');
  });
});
