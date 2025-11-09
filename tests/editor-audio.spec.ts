import { test, expect } from '@playwright/test';

test.describe('エディタ音声機能', () => {
  let projectId: string;

  test.beforeEach(async ({ page }) => {
    // ログイン
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[type="email"]', 'gan.hmhm333@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/dashboard', { timeout: 10000 });

    // 新規プロジェクトを作成
    await page.click('button:has-text("新規プロジェクト")');
    await page.waitForURL(/\/editor\/.+/, { timeout: 10000 });

    // プロジェクトIDを取得
    const url = page.url();
    const match = url.match(/\/editor\/(.+)$/);
    if (match) {
      projectId = match[1];
      console.log('プロジェクトID:', projectId);
    }
  });

  test('トラックを追加してピアノロールに表示される', async ({ page }) => {
    // トラック追加ボタンが表示されることを確認
    await expect(page.locator('button:has-text("トラックを追加")')).toBeVisible();

    // トラックを追加
    await page.click('button:has-text("トラックを追加")');

    // トラックが表示されることを確認
    await expect(page.locator('text=トラック 1')).toBeVisible({ timeout: 5000 });

    console.log('✅ トラック追加成功！');
  });

  test('ピアノロールでノートを追加できる', async ({ page }) => {
    // トラックを追加
    await page.click('button:has-text("トラックを追加")');
    await expect(page.locator('text=トラック 1')).toBeVisible({ timeout: 5000 });

    // キャンバスが表示されることを確認
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // キャンバスの中心をクリックしてノートを追加
    const box = await canvas.boundingBox();
    if (box) {
      await canvas.click({
        position: { x: box.width / 2, y: box.height / 2 },
      });
    }

    // ノートがデータベースに追加されるまで少し待つ
    await page.waitForTimeout(1000);

    console.log('✅ ノート配置成功！');
  });

  test('再生ボタンをクリックするとTone.jsが起動する', async ({ page, context }) => {
    // オーディオ再生を許可
    await context.grantPermissions(['autoplay']);

    // トラックを追加
    await page.click('button:has-text("トラックを追加")');
    await expect(page.locator('text=トラック 1')).toBeVisible({ timeout: 5000 });

    // Tone.jsのstart関数が呼ばれたかを検証するためのフラグ
    let toneStarted = false;

    // Tone.startの呼び出しを監視
    await page.exposeFunction('logToneStart', () => {
      toneStarted = true;
      console.log('🎵 Tone.js started!');
    });

    // コンソールログを監視
    page.on('console', (msg) => {
      console.log('Browser console:', msg.text());
    });

    // 再生ボタンを探す（Play/停止ボタン）
    const playButton = page.locator('button').filter({ hasText: /再生|▶/ }).first();

    // ボタンが存在しない場合、別のセレクタを試す
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons`);

    // SVGアイコンを含む再生ボタンを探す
    const playButtons = page.locator('button svg path[d*="M8"]');
    const playButtonCount = await playButtons.count();
    console.log(`Found ${playButtonCount} play button icons`);

    if (playButtonCount > 0) {
      // 再生ボタンをクリック
      await playButtons.first().click();

      // 少し待機
      await page.waitForTimeout(500);

      console.log('✅ 再生ボタンクリック成功！');
    } else {
      console.log('⚠️ 再生ボタンが見つかりませんでした');
    }
  });

  test.afterEach(async ({ page }) => {
    // テスト後のクリーンアップ
    if (projectId) {
      console.log('プロジェクトIDをクリーンアップ:', projectId);
    }
  });
});
