import { test, expect } from '@playwright/test';

test.describe('認証フロー', () => {
  test('ログインが成功してダッシュボードに遷移する', async ({ page }) => {
    // ログインページに移動
    await page.goto('http://localhost:3000/auth/login');

    // ページが読み込まれるまで待つ
    await expect(page.locator('h1')).toContainText('DTM Web App');

    // メールアドレスとパスワードを入力
    await page.fill('input[type="email"]', 'gan.hmhm333@gmail.com');
    await page.fill('input[type="password"]', 'password123');

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // ダッシュボードにリダイレクトされることを確認
    await expect(page).toHaveURL('http://localhost:3000/dashboard', { timeout: 10000 });

    // ダッシュボードのコンテンツが表示されることを確認
    await expect(page.locator('h1')).toContainText('DTM Web App');
    await expect(page.locator('h2')).toContainText('プロジェクト');

    // ログアウトボタンが表示されることを確認
    await expect(page.locator('button:has-text("ログアウト")')).toBeVisible();

    console.log('✅ ログインテスト成功!');
  });

  test('間違ったパスワードでログインが失敗する', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');

    await page.fill('input[type="email"]', 'gan.hmhm333@gmail.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    // エラーメッセージが表示されることを確認
    await expect(page.locator('text=Invalid login credentials')).toBeVisible({ timeout: 5000 });

    // ログインページに留まることを確認
    await expect(page).toHaveURL('http://localhost:3000/auth/login');

    console.log('✅ エラーハンドリングテスト成功!');
  });
});
