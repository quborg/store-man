
/**
 * computeTotalPrice, calculate catotal basket spreadsheet
 * @param Array basket, a Collection of product model
 * @param Array products, products Collection
 * @return Number total price
 */
export function computeTotalPrice(basket, products) {
  let total = 0
  if (basket.length) {
    total = basket.reduce (
                            (total, {_id, quantity}) => {
                              let price = getCollectionById(products, _id).price
                              total += Number(quantity||0) * price
                              return total
                            }, 0
                          )
                          || 0
  }
  return total
}

/**
 * getCollectionById,
 */
export function getCollectionById(obj, id) {
  let result = {}
  if (!obj || !obj.length) return result
  for (let i in obj) if (obj[i]._id == id) result = obj[i]
  return result
}

/**
 * getCollectionByKeyValue,
 */
export function getCollectionByKeyValue(obj, key, value) {
  let result = {}
  if (!obj || !obj.length) return result
  for (let i in obj) {
    Object.keys(obj[i]).map( k => {
      if (k==key && obj[i][k]==value) {
        result = obj[i]
      }
    })
  }
  return result
}
