import Hero_Scrapper from "./scrapper.js"
import { product } from "../types/index.js"
import Sleep from "../misc/sleep.js"


export default class win2 extends Hero_Scrapper {
    public static source = "https://shopredspirits.com/shop?category=all_spirits&category=all_exclud_sale_newarrivals&title=Explore"
    public static env: any | null = null
    protected async $extract(): Promise<void> {
        if (!this.$client) return
        await this.$bypass("https://shopredspirits.com/")
        await this.$client!.goto(win2.source, { timeoutMs: 0 })
        await this.$client!.waitForLoad('AllContentLoaded')
        await Sleep.For(2)

        let nextPage = true
        let numberOfElements = 0

        let increment = 270

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

                    if (numberOfElements % increment === 0) {
                        console.log('Starting the Server Again for a bit')
                        await this.$restart("https://shopredspirits.com/")
                    }

                    await this.$client!.goto(`https://shopredspirits.com/shop?category=all_spirits&category=all_exclud_sale_newarrivals&title=Explore&skip=${numberOfElements}`
                        , { timeoutMs: 0 })
                    await this.$client.waitForLoad('AllContentLoaded')

                } else {
                    nextPage = false
                }

            } catch (error) {
                console.log(error)
                nextPage = false

            }
        }
    }

    protected async SinglePage(url: string): Promise<product | undefined> {
        console.log(url)
        let Attempting = 0

        while (Attempting < 3) {

            try {

                await this.$client!.goto(url, { timeoutMs: 0 })
                await this.$client!.waitForLoad("AllContentLoaded")
                let Product: any = {}

                let name = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[1]/div/h1`)
                let size = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[1]/div[1]/ch-product-price-discount/div/div[1]/span')
                let price = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[1]/div[1]/ch-product-price-discount/div/div[2]/span')
                let pic = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[1]/div[3]/ch-product-image/div/figure[1]/img')
                let content = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[6]/div[2]');

                if (await content.$exists) {
                    content.querySelectorAll('div.product-characteristics.row.one-line').$map(async (item) => {
                        let t = await item.innerText
                        Product[t.split('\n')[0].replace(/\s+/g, '_')] = t.split('\n')[1]
                    })
                }
                Product["name"] = await name.$exists ? await name.innerText : null
                Product["size"] = await size.$exists ? await size.innerText : null
                Product["price"] = await price.$exists ? await price.innerText : null
                Product['picture'] = await pic.$exists ? await pic.src : null

                Attempting = 3
                return Product

            } catch (error) {

                console.log('Trying again')
                Attempting++
                return undefined
            }
        }
    }
}