import { test, expect, webkit } from '@playwright/test';

const carouselSelector = '#carousel';
const infiniteCarouselSelector = '#infiniteCarousel';
const slideSelector = 'slide-component';
const nextButtonSelector = '[data-test="next"]';
const prevButtonSelector = '[data-test="prev"]';

// Utility function to extract translateX value
async function getTranslateX(page, selector) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    const transform = getComputedStyle(element).transform;
    const matrix = new WebKitCSSMatrix(transform);
    return matrix.m41; // Extract translateX value
  }, selector);
}

test.describe('Carousel E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should render carousel with slides', async ({ page }) => {
    const carousel = page.locator(carouselSelector);
    await expect(carousel).toBeVisible();

    await page.waitForTimeout(500);

    const slide = page.locator(`${carouselSelector} ${slideSelector}`).first();
    await expect(slide).toHaveClass(/slide/)
  });

  test('should navigate to next slide on button click', async ({ page }) => {
    const carouselTrack = `${carouselSelector} .carousel-track`

    const initialX = await getTranslateX(page, carouselTrack);
    await page.click(nextButtonSelector);

    await page.waitForTimeout(500);
    const newX = await getTranslateX(page, carouselTrack);

    expect(newX).toBeLessThan(initialX); // Moved left
  });

  test('should navigate to previous slide on button click', async ({ page }) => {
    const carouselTrack = `${carouselSelector} .carousel-track`
    await page.click(nextButtonSelector);
    await page.waitForTimeout(500);
    const afterNextX = await getTranslateX(page, carouselTrack);

    await page.click(prevButtonSelector);
    await page.waitForTimeout(500);
    const afterPrevX = await getTranslateX(page, carouselTrack);
    expect(afterPrevX).toBeGreaterThan(afterNextX);
  });

  test('should allow drag interaction', async ({ page }) => {
    const carouselTrack = `${carouselSelector} .carousel-track`
    const initialX = await getTranslateX(page, carouselTrack);

    await page.mouse.move(500, 200);
    await page.mouse.down();
    await page.mouse.move(100, 200);
    await page.mouse.up();

    await page.waitForTimeout(500);

    const draggedX = await getTranslateX(page, carouselTrack);
    expect(draggedX).toBeLessThan(initialX);
  });
  test('should automatically scroll carousel when autoplay is set', async ({ page }) => {
    const carouselTrack = `${infiniteCarouselSelector} .carousel-track`
    const initialX = await getTranslateX(page, carouselTrack);

    await page.waitForTimeout(2000);

    const finalX = await getTranslateX(page, carouselTrack);

    expect(finalX).toBeLessThan(initialX);

  })
  test('should infinitely scroll infinite carousel', async ({ page }) => {
    const carouselTrackSelector = `${infiniteCarouselSelector} .carousel-track`;
    const slideSelectorFull = `${infiniteCarouselSelector} ${slideSelector}`;
    const slideClones = 2

    const initialX = await getTranslateX(page, carouselTrackSelector);

    const slideCount = await page.locator(slideSelectorFull).count() - slideClones;

    const slideWidth = await page.evaluate((sel) => {
      const slide = document.querySelector(sel);
      return slide ? (slide as HTMLDivElement).offsetWidth : 0;
    }, slideSelectorFull);

    const movedX = await getTranslateX(page, carouselTrackSelector);
    expect(movedX).not.toBe(initialX);

    await page.waitForTimeout(1000 * slideCount);

    const finalX = await getTranslateX(page, carouselTrackSelector);

    expect(Math.abs(finalX - initialX)).toBeLessThan(slideWidth);
  });

});
