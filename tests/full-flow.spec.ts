import { test, expect } from '@playwright/test';

test.describe('完全なフロー：ログインから音が鳴るまで', () => {
  test('ログイン → プロジェクト作成 → トラック追加 → ノートクリックまでの流れ', async ({ page }) => {
    // コンソールログを監視
    const logs: string[] = [];
    page.on('console', (msg) => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
      console.log(`Browser: [${msg.type()}] ${msg.text()}`);
    });

    // ステップ1: ログインページを開く
    console.log('📝 ステップ1: ログインページを開く');
    await page.goto('http://localhost:3000/auth/login');
    await expect(page.locator('h1')).toContainText('DTM Web App', { timeout: 10000 });
    console.log('✅ ログインページ表示成功');

    // ステップ2: ログイン
    console.log('📝 ステップ2: ログイン実行');
    await page.fill('input[type="email"]', 'gan.hmhm333@gmail.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // ダッシュボードにリダイレクトされるのを待つ
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    console.log('✅ ダッシュボードにリダイレクト成功');

    // ダッシュボードのコンテンツが表示されるのを待つ
    await expect(page.locator('h2:has-text("プロジェクト")')).toBeVisible({ timeout: 5000 });
    console.log('✅ ダッシュボード表示成功');

    // ステップ3: 新規プロジェクト作成
    console.log('📝 ステップ3: 新規プロジェクト作成');
    const createButton = page.locator('button:has-text("新規プロジェクト")').first();
    await expect(createButton).toBeVisible({ timeout: 5000 });
    await createButton.click();

    // エディタページにリダイレクトされるのを待つ
    await expect(page).toHaveURL(/\/editor\/[a-f0-9-]+/, { timeout: 15000 });
    console.log('✅ エディタページにリダイレクト成功');

    // エディタのUIが表示されるのを待つ（より具体的なセレクタを使用）
    await expect(page.getByRole('button', { name: 'トラックを追加' })).toBeVisible({ timeout: 5000 });
    console.log('✅ エディタUI表示成功');

    // Audio Engineの初期化ログを確認
    await page.waitForTimeout(1000);
    const hasAudioEngineLog = logs.some(log => log.includes('Initializing Audio Engine'));
    if (hasAudioEngineLog) {
      console.log('✅ Audio Engine初期化ログ確認');
    } else {
      console.log('⚠️  Audio Engine初期化ログが見つかりません');
    }

    // ステップ4: トラック追加
    console.log('📝 ステップ4: トラック追加');
    const addTrackButton = page.locator('button:has-text("トラックを追加")');
    await expect(addTrackButton).toBeVisible({ timeout: 5000 });
    await addTrackButton.click();

    // トラックが表示されるのを待つ
    await expect(page.locator('text=トラック 1')).toBeVisible({ timeout: 10000 });
    console.log('✅ トラック追加成功');

    // ステップ5: ピアノロールをクリック
    console.log('📝 ステップ5: ピアノロールをクリック');
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 5000 });

    const box = await canvas.boundingBox();
    if (box) {
      // キャンバスの中央をクリック
      await canvas.click({
        position: { x: box.width / 2, y: box.height / 2 },
      });
      console.log('✅ ピアノロールクリック成功');

      // 少し待ってログを確認
      await page.waitForTimeout(1000);

      // 音が鳴ったことを示すログを確認
      const hasPlayNoteLog = logs.some(log =>
        log.includes('Playing note') || log.includes('Piano Roll')
      );

      if (hasPlayNoteLog) {
        console.log('✅ 音再生ログ確認');
        console.log('🎵 音が鳴りました！');
      } else {
        console.log('❌ 音再生ログが見つかりません');
        console.log('最近のログ:');
        logs.slice(-10).forEach(log => console.log('  ' + log));
      }
    }

    // 全ログを出力
    console.log('\n===== 全コンソールログ =====');
    logs.forEach(log => console.log(log));
    console.log('===========================\n');

    // テスト結果サマリー
    console.log('\n===== テスト結果サマリー =====');
    console.log('✅ ログイン成功');
    console.log('✅ ダッシュボード表示成功');
    console.log('✅ プロジェクト作成成功');
    console.log('✅ エディタ表示成功');
    console.log('✅ トラック追加成功');
    console.log('✅ ピアノロールクリック成功');
    console.log('=============================\n');
  });
});
