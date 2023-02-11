import win2 from "./components/wine2.js";
import MSSQL from "./misc/mssql.js";
import Locals from "./misc/localls.js";
import WIN3 from "./components/t.js";
import Cuts from "./components/cuts.js";
import Product_Scraper from "./components/productScraper.js";
import Handler from "./components/cors/handler.js";

let Links = [
    "https://shopredspirits.com/shop?category=all_spirits&category=all_exclud_sale_newarrivals&title=Explore",
    "https://shopredspirits.com/shop?category=wines_sake_cider&category=all_exclud_sale_newarrivals&title=Explore",
    "https://shopredspirits.com/shop?category=all_beers&category=all_exclud_sale_newarrivals&title=Explore"
]


/* for (const Link of Links) {

    await new win2(Link).exec().then((payload) => {
        console.log('LINK DONE   ::  ' + Link)
    })
}*/
const arr = [
    "https://shopredspirits.com/shop?product-id=56b2e85e75627529aa1c0000&option-id=9b631a61a45405d01039e5ba9e8e9c836b94b4ea418c1b2a60b56f585431f621",
    "https://shopredspirits.com/shop?product-id=56cb01ee756275420e960000&option-id=60b2185b72cb20f8ad2b2794053e240237a564828107e00debbda67170c80890",
    "https://shopredspirits.com/shop?product-id=5521cef26561310003110100&option-id=5e15f325e547fe8401bb86985848e535d453f3bd25dcf730a4bd299f4163f3b9",
    "https://shopredspirits.com/shop?product-id=57aa346069702d628d2e0a01&option-id=ef9db98eae7ea5163be599ea7b8a0ad20b701304c98b20a16e6f5e018fc798c4",
]

/* new Product_Scraper(arr, "0").exec() */
console.log(Handler.exec())