
/**
 * computeTotalPrice, total basket spreadsheet
 * @param Array basket, a Collection of product model
 * @param Array products, products Collection
 * @return Number total price
 */
export function computeTotalPrice(basket, products) {
  let total = 0
  if (basket.length) {
    total = basket.reduce (
                            (total, {_id, quantity}) => {
                              let price = getProductKey(products, _id, 'price')
                              total += Number(quantity||0) * price
                              return total
                            }, 0
                          )
                          || 0
  }
  return total
}


function getProductKey(products, id, key) {
  let result = 0

  if (products && !products.length) return 0
  for(let i in products) {
    if (products[i]._id == id) {
      result = products[i][key]
      break
    }
  }

  return result
}
