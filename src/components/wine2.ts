import fs from "node:fs"
import Hero_Scrapper from "./scrapper.js"
import { product } from "../types/index.js"
import Sleep from "../misc/sleep.js"
import Hero from "@ulixee/hero"
import Server from "@ulixee/server"


export default class win2 extends Hero_Scrapper {
    public static source = "https://shopredspirits.com/shop?category=all_spirits&category=all_exclud_sale_newarrivals&title=Explore"
    public static env: any | null = null
    protected async $extract(): Promise<void> {
        let ProductLinks: string[] = []
        if (!this.$client) return
        await this.$bypass("https://shopredspirits.com/")
        await this.$client!.goto(win2.source, { timeoutMs: 0 })
        await this.$client!.waitForLoad('AllContentLoaded')
        await Sleep.For(2)

        let nextPage: boolean = true
        let numberOfElements = 0
        let profile = await this.$client.exportUserProfile()
        while (nextPage) {
            try {
                console.log(await this.$client.url)
                let Links = await this.$client.querySelectorAll('div.item-wrapper.product').$map((async (t) => {
                    return await t.querySelector('a').href
                }))
                console.log(Links)
                if (Links.length > 0) {
                    for (const link of Links) {
                        let product = await this.SinglePage(link)
                        if (product !== undefined) {
                            console.log(product)
                            this.$payload.push(product)
                        }
                    }

                    numberOfElements = numberOfElements + 18
                    await this.$client!.goto(`https://shopredspirits.com/shop?category=all_spirits&category=all_exclud_sale_newarrivals&title=Explore&skip=${numberOfElements}`
                        , { timeoutMs: 0 })
                    await this.$client.waitForLoad('AllContentLoaded')

                } else {
                    nextPage = false
                }
            } catch (error) {
                console.log(error)
                await this.$cleanup()
                await this.$setup()
                await this.$bypass("https://shopredspirits.com/")
            }
        }
    }
    protected async SinglePage(url: string): Promise<product | undefined> {
        console.log(url)
        let Attempting = 0

        while (Attempting < 3) {
            try {
                await this.$client!.goto(url, { timeoutMs: 0 })
                //                await this.$client!.waitForLoad("AllContentLoaded")
                await Sleep.For(3)
                let name = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[1]/div/h1`)
                let size = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[1]/div[1]/ch-product-price-discount/div/div[1]/span')
                let price = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[1]/div[1]/ch-product-price-discount/div/div[2]/span')
                let type = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[6]/div[2]/div[1]/div/span/span`)
                let subtype = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[6]/div[2]/div[2]/div`)
                let country = this.$client!.xpathSelector(`//*[@id="data-holder"]/div[3]/div/span`)
                let state = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[6]/div[2]/div[4]/div/span`)
                let pic = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[1]/div[3]/ch-product-image/div/figure[1]/img')

                /*          console.log({
                             name: await name.$exists ? await name.innerText : null,
                             size: await size.$exists ? await size.innerText : null,
                             price: await price.$exists ? await price.innerText : null,
                             type: await type.$exists ? await type.innerText : null,
                             subtype: await subtype.$exists ? await subtype.innerText : null,
                             country: await country.$exists ? await country.innerText : null,
                             state: await state.$exists ? await state.innerText : null,
                             pic: await pic.$exists ? await pic.src : null
                         }) */
                Attempting = 3
                return {
                    name: await name.$exists ? await name.innerText : null,
                    size: await size.$exists ? await size.innerText : null,
                    price: await price.$exists ? await price.innerText : null,
                    type: await type.$exists ? await type.innerText : null,
                    subtype: await subtype.$exists ? await subtype.innerText : null,
                    country: await country.$exists ? await country.innerText : null,
                    state: await state.$exists ? await state.innerText : null,
                    pic: await pic.$exists ? await pic.src : null
                }

            } catch (error) {

                console.log('Trying again')
                Attempting++
                return undefined
            }
        }

    }
}