export const CLOTHING_LOOKS_QUERY = `
  *[_type == "clothingLook"] | order(order asc) {
    _id,
    "id": order,
    name,
    "mainSrc": mainImage.asset->url,
    "detailSrc": detailImage.asset->url,
    material,
    note,
    price
  }
`;