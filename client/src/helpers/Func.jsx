


const salePriceFunc = (price, discount) => {

    const sale_price =  price - (price * discount) / 100

    return sale_price.toFixed(2)


}


export const addCommas = (amount) => {
    return amount >= 10000 ? amount.toLocaleString() : amount;
}




export default  salePriceFunc