import fs from "node:fs";
import Hero_Scrapper from "./scrapper.js";
import { product } from "../types/index.js";
import Sleep from "../misc/sleep.js";

export default class Wine_Spirits extends Hero_Scrapper {
    public static source = "https://shopredspirits.com/shop?category=all_spirits&category=all_exclud_sale_newarrivals&title=Explore"

    protected async $extract(): Promise<void> {
        let ProductLinks: string[] = []
        await this.$bypass('https://shopredspirits.com/')
        await this.$client!.goto(Wine_Spirits.source,
            { timeoutMs: 0 })
        await this.$client!.waitForLoad('AllContentLoaded')
        await Sleep.For(2)

        let nextPage: boolean = true
        let numberOfElements = 0

        while (nextPage) {
            /*  numberOfElements + 18 */
            try {
                console.log(await this.$client!.url)

                let Links = await this.$client!.querySelectorAll('div.item-wrapper.product').$map(async (T) => {
                    return await T.querySelector('a').href
                })

                console.log(Links)
                if (Links.length === 0) {
                    nextPage = false
                } else {
                    Links.map(async (link: string) => {
                        ProductLinks.push(link)
                        /*     let product = await this.SinglePage(link)
                            console.log({ prod: product })
                            if (product !== undefined) this.$payload.push(product) */
                        // handle the undi Product

                    })

                    nextPage = false
                    /* numberOfElements = numberOfElements + 18

                    await this.$client!.goto(`https://shopredspirits.com/shop?category=all_spirits&category=all_exclud_sale_newarrivals&title=Explore&skip=${numberOfElements}`
                        , { timeoutMs: 0 })

                    await this.$client!.waitForLoad('AllContentLoaded') */

                }


            } catch (error) {
                numberOfElements = numberOfElements - 18
            }


        }

        for (let index = 0; index < ProductLinks.length; index++) {
            const element = ProductLinks[index];
            console.log(element)
            try {
                await this.$client!.goto(element, { timeoutMs: 0 })
                await this.$client!.waitForLoad("AllContentLoaded")
                await Sleep.For(3)
                let name = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[1]/div/h1`)
                let size = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[1]/div[1]/ch-product-price-discount/div/div[1]/span')
                let price = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[1]/div[1]/ch-product-price-discount/div/div[2]/span')
                let type = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[6]/div[2]/div[1]/div/span/span`)
                let subtype = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[6]/div[2]/div[2]/div`)
                let country = this.$client!.xpathSelector(`//*[@id="data-holder"]/div[3]/div/span`)
                let state = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[6]/div[2]/div[4]/div/span`)
                let pic = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[1]/div[3]/ch-product-image/div/figure[1]/img')

                console.log({
                    name: await name.$exists ? await name.innerText : null,
                    size: await size.$exists ? await size.innerText : null,
                    price: await price.$exists ? await price.innerText : null,
                    type: await type.$exists ? await type.innerText : null,
                    subtype: await subtype.$exists ? await subtype.innerText : null,
                    country: await country.$exists ? await country.innerText : null,
                    state: await state.$exists ? await state.innerText : null,
                    pic: await pic.$exists ? await pic.src : null
                })

                /*         return {
                            name: await name.$exists ? await name.innerText : null,
                            size: await size.$exists ? await size.innerText : null,
                            price: await price.$exists ? await price.innerText : null,
                            type: await type.$exists ? await type.innerText : null,
                            subtype: await subtype.$exists ? await subtype.innerText : null,
                            country: await country.$exists ? await country.innerText : null,
                            state: await state.$exists ? await state.innerText : null,
                            pic: await pic.$exists ? await pic.src : null
                        } */


            } catch (error) {
                // needs to see if the error is a hero error 
                // so i can restart the server
                console.log(error)
                /*   return undefined */
            }

        }
    }


    /*    protected async SinglePage(url: string): Promise<product | undefined> {
           console.log(url)
           try {
               await this.$client!.goto(url, { timeoutMs: 0 })
               await this.$client!.waitForLoad("AllContentLoaded")
               await Sleep.For(3)
               let name = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[1]/div/h1`)
               let size = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[1]/div[1]/ch-product-price-discount/div/div[1]/span')
               let price = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[1]/div[1]/ch-product-price-discount/div/div[2]/span')
               let type = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[6]/div[2]/div[1]/div/span/span`)
               let subtype = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[6]/div[2]/div[2]/div`)
               let country = this.$client!.xpathSelector(`//*[@id="data-holder"]/div[3]/div/span`)
               let state = this.$client!.xpathSelector(`/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[2]/div[6]/div[2]/div[4]/div/span`)
               let pic = this.$client!.xpathSelector('/html/body/main/div/div/article/ch-elements.product.page/div/div[1]/div[3]/div[1]/div[3]/ch-product-image/div/figure[1]/img')
   
               console.log({
                   name: await name.$exists ? await name.innerText : null,
                   size: await size.$exists ? await size.innerText : null,
                   price: await price.$exists ? await price.innerText : null,
                   type: await type.$exists ? await type.innerText : null,
                   subtype: await subtype.$exists ? await subtype.innerText : null,
                   country: await country.$exists ? await country.innerText : null,
                   state: await state.$exists ? await state.innerText : null,
                   pic: await pic.$exists ? await pic.src : null
               })
   
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
               // needs to see if the error is a hero error 
               // so i can restart the server
               console.log(error)
               return undefined
           }
       }
    */


}
