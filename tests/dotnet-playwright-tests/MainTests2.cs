using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Playwright;
using NUnit.Framework;

namespace HubOS_XGA.Tests
{
    [TestFixture]
    public class MainTests2
    {
        private IPlaywright _pw;
        private IBrowser _browser;

        [OneTimeSetUp]
        public async Task OneTimeSetup()
        {
            _pw = await Playwright.CreateAsync();
            _browser = await _pw.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = true });
        }

        [OneTimeTearDown]
        public async Task OneTimeTearDown()
        {
            if (_browser != null) await _browser.CloseAsync();
            _pw?.Dispose();
        }

        [Test]
        public async Task NavigateRedirectAndCheckStatusCodes()
        {
            var page = await _browser.NewPageAsync();
            await page.GotoAsync("https://the-internet.herokuapp.com/");
            var title = await page.TitleAsync();
            Console.WriteLine($"title: {title}");

            await page.ClickAsync("text=Redirect Link");
            await page.WaitForSelectorAsync("#redirect", new PageWaitForSelectorOptions { State = WaitForSelectorState.Visible });

            string redirectorHeading = null;
            try
            {
                redirectorHeading = await page.TextContentAsync("h3");
            }
            catch { redirectorHeading = null; }
            Console.WriteLine($"redirector_heading: {redirectorHeading}");

            await page.ClickAsync("#redirect");
            await page.WaitForSelectorAsync("div#content ul li a");

            var elements = await page.QuerySelectorAllAsync("div#content ul li a");
            var codes = new List<string>();
            foreach (var el in elements)
            {
                var txt = (await el.TextContentAsync())?.Trim() ?? string.Empty;
                codes.Add(txt);
            }
            Console.WriteLine($"codes: {string.Join(',', codes)}");

            await page.ClickAsync("text=500");
            await page.WaitForSelectorAsync("div#content p");
            var contentText = (await page.TextContentAsync("#content")) ?? string.Empty;
            Console.WriteLine($"content length: {contentText.Length}");

            Assert.That(contentText, Does.Contain("Status Codes"));

            await page.CloseAsync();
        }
    }
}
