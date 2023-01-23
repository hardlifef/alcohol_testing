import { Browser, Page } from "puppeteer"
import puppeteer from "puppeteer"
import PrivacyPassToken from "../misc/token.js"
import Sleep from "../misc/sleep.js"
import fs from "fs" 

export default class PUP {
    private page: Page | null
    private browser: Browser | null
    public static source = "https://shopredspirits.com/shop?category=all_spirits&category=all_exclud_sale_newarrivals&title=Explore"

    constructor() {
        this.page = null
        this.browser = null
    }


    private async setup() {
        this.browser = await puppeteer.launch({ headless: true })
        this.page = await this.browser.newPage()
    }



    public async exec() {
        await this.setup()
        if (!this.page) return
        let tokens = PrivacyPassToken.getToken()
        await this.page.setExtraHTTPHeaders({ 'Authorization': `Bearer ${tokens}` });
        await this.page.goto(PUP.source, { waitUntil: 'networkidle2', timeout: 0 })
        Sleep.For(5)
        fs.writeFileSync('htht.jpeg', await this.page.screenshot())

    }
}