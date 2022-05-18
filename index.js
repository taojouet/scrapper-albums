const { Builder, By, Key, util } = require("selenium-webdriver");

async function index() {
  let driver = await new Builder().forBrowser("firefox").build();
  await driver.get("https://www.rollingstone.com/music/music-lists/best-albums-of-all-time-1062063/");
//   await driver.findElement(By.name("q")).sendKeys("coucou", Key.RETURN);
}
index();