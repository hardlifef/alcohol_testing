import win2 from "./components/wine2.js";
import MSSQL from "./misc/mssql.js";
import Locals from "./misc/localls.js";
import WIN3 from "./components/t.js";
let Links = [
    "https://shopredspirits.com/shop?category=all_spirits&category=all_exclud_sale_newarrivals&title=Explore",
    "https://shopredspirits.com/shop?category=wines_sake_cider&category=all_exclud_sale_newarrivals&title=Explore",
    "https://shopredspirits.com/shop?category=all_beers&category=all_exclud_sale_newarrivals&title=Explore"
]


for (const Link of Links) {

    await new win2(Link).exec().then((payload) => {
        console.log('LINK DONE   ::  ' + Link)
    })
}


/* 
console.log(new WIN3().exec())
 */