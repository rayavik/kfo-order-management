const productsBySkus=async (admin,skus)=>{
    try {
        const response = await admin.graphql(`#graphql
          query($skus:String) {
                productVariants(first:100, query:$skus) {
                    nodes {
                    id
                    title
                    price
                    sku
                    product{id,description,title
                    tags,productType
                    }
                    }
                }
                }`, { variables: { skus:skus } },);
      
          const data = await response.json();
          if (data.errors) {
            throw new Error(data.errors.map(error => error.message).join(", "));
          }
          return {
            status:"success",
            data:data.data.productVariants.nodes,
          }
           
    } catch (error) {
        return {
            status:"error",
            error
          }
    }
}
export {productsBySkus}