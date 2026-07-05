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

export const CHAIR_PRODUCTS_QUERY = `
  *[_type == "chairProduct"] | order(order asc) {
    _id,
    "id": slug.current,
    name,
    "src": productImage.asset->url,
    material,
    note,
    price,
    spinFramePath,
    spinFrameCount
  }
`;
