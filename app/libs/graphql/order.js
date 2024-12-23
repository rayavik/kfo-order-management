const getOrderById=async (admin,id)=>{
    try {
        const response = await admin.graphql(
            `#graphql
            query GetOrder($orderId: ID!) {
              order(id: $orderId) {
              id
              note
          name
          customer{
            id
            firstName
             lastName
            tags
            email
            
           
          }
          lineItems(first:100){
            nodes{
              id
              title
              variant{
                  id
                }
              customAttributes{
                key,
                value
              }
              quantity
              originalUnitPriceSet{presentmentMoney{amount currencyCode}}
              originalTotalSet{presentmentMoney{amount currencyCode}}
              totalDiscountSet{presentmentMoney{amount currencyCode}}
              product{
                title
                productType
              }
            }
          }
              }
            }`,
            { variables: { orderId: `gid://shopify/Order/${id}` } },
          );
          const data = await response.json(); 
          if (data.errors) {
            throw new Error(data.errors.map(error => error.message).join(", "));
          }
          return {
            status:"success",
            data:data.data,
          }
           
    } catch (error) {
        return {
            status:"error",
            error
          }
    }
}


const getOrders=async (admin)=>{
    try {
        const response = await admin.graphql(`#graphql
            query {
              orders(first: 250, reverse:true, query: "status:open") {
                edges {
                  node {
                    id
                    name
                    totalPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                    confirmed
                    closed
                    displayFulfillmentStatus
                    createdAt
                    fullyPaid
                    email
                    lineItems(first: 100) {
                      nodes {
                        id
                      }
                    }
                    customer {
                      displayName
                    }
                  }
                }
              }
            }
          `);
      
          const data = await response.json();


          if (data.errors) {
            throw new Error(data.errors.map(error => error.message).join(", "));
          }
          return {
            status:"success",
            data:data.data.orders.edges,
          }
           
    } catch (error) {
        return {
            status:"error",
            error
          }
    }
}


export {getOrderById,getOrders}