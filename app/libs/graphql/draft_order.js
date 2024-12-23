const getDraftOrderById=async (admin,id)=>{
    try {
        const response = await admin.graphql(
            `#graphql
            query GetOrder($orderId: ID!) {
              draftOrder(id: $orderId) {
              id
              email
          name
          note2
          customer{
            id
            firstName
             lastName
            tags
            email
             metafield(key: "kfo.customer_type") {
                      value
                    }
           
          }
          lineItems(first:100){
            nodes{
              id
              title
              variant{
                  id
                  sku
                }
              customAttributes{
                key,
                value
              }
              quantity
              originalUnitPriceSet{presentmentMoney{amount currencyCode}}
              originalTotalSet{presentmentMoney{amount currencyCode}}
              appliedDiscount{
                description
                title
                value
                valueType
                 amountSet{presentmentMoney{amount}}
              }
              product{
                title
                productType
                 tags
              }
            }
          }
              }
            }`,
            { variables: { orderId: `gid://shopify/DraftOrder/${id}` } },
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

const getDraftOrders=async (admin)=>{
    try {
        const response = await admin.graphql(`#graphql
            query {
                  draftOrders(first: 100, query: "status:OPEN" reverse:true) {
                    edges {
                      node {
                        id
                        name
                        createdAt
                        email
                        totalPriceSet {
                          presentmentMoney {
                            amount
                            currencyCode
                          }
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
            data:data.data.draftOrders.edges,
          }
           
    } catch (error) {
        return {
            status:"error",
            error
          }
    }
}

const updateDraftOrder=async (admin,inputs)=>{
  try {
    const {id,note,customer_id,items}=inputs;
    const response = await admin.graphql(`#graphql
      mutation draftOrderUpdate($id: ID!, $input: DraftOrderInput!) {
        draftOrderUpdate(id: $id, input: $input) {
          draftOrder {
        id
        email
        customer{
        email
        }
          }
        }
      }
         `,
           {
             variables: {
                input: {
                  "lineItems": items,
                  "note": note,
                  "email": customer_id
                },
                "id": `gid://shopify/DraftOrder/${id}`
        
             },
           },
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

const createDraftOrder=async(admin,inp)=>{
try {
  const {note,customer,lineItems}=inp;
  let response=null;
    response = await admin.graphql(
      `#graphql
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
          }
        }
      }
    `,
      {
        variables: {
          input: {
            note: note,
            customerId: customer.id,
            email: customer.email,
            lineItems: lineItems,
          },
        },
      },
    );
  
  const data = await response.json();
  return {
    status:"success",
    data
  }
} catch (error) {
  return {
    
    status:"error",
   error
  }
}
}
const deleteDraftOrder=async(admin,id)=>{

try {
  let response=null;
    response = await admin.graphql(
      `#graphql
     mutation draftOrderDelete($input: DraftOrderDeleteInput!) {
     draftOrderDelete(input: $input) {
    deletedId
  }
}
    `,
      {
        variables: {
         input: {
            id: id
        },
        },
      },
    );
  
  const data = await response.json();
  return {
    status:"success",
  }
} catch (error) {
  return {
    
    status:"error",
   error
  }
}
}

export {getDraftOrderById,getDraftOrders,updateDraftOrder,createDraftOrder,deleteDraftOrder}