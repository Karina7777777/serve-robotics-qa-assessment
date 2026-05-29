import { test, expect, Page } from '@playwright/test';

// Reusable login helper
async function login(
    page: Page,
    username: string = 'standard_user',
    password: string = 'secret_sauce'
) {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill(username);
    await page.locator('[data-test="password"]').fill(password);
    await page.locator('[data-test="login-button"]').click();
}

test('Open homepage', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await expect(page).toHaveTitle('Swag Labs');
});

test('Login with valid credentials', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('Sorting low to high', async ({ page }) => {

    await login(page);
    // await page.click('.product_sort_container'); no need - > selectOtion will do the work 
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('lohi');
    // I'm using data-test attribute to locate the dropdown, and selectOption to select the "Price (low to high)" option, which has the value "lohi"
    //class can be changed, style can be changed, but data-test attribute is more stable  

});

test('Adding to cart,confirming and removing from cart', async ({ page }) => {

    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');

    await test.step('Go to cart and verify both products are added', async () => {
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page.locator('[data-test="inventory-item-name"]')).toContainText(['Sauce Labs Fleece Jacket', 'Sauce Labs Onesie']);
    });

    await test.step('Remove one product and verify the cart is updated', async () => {
        await page.locator('[data-test="remove-sauce-labs-onesie"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
        await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Fleece Jacket');
        await expect(page.locator('[data-test="inventory-item-name"]')).not.toContainText('Sauce Labs Onesie');

    });
});