const getCustomers = async (admin, id) => {
  try {
    const response = await admin.graphql(
      `#graphql
          query {
            customers(first: 100) {
              edges {
                node {
                  id
                  email
                  phone
                  displayName
                  tags
                  verifiedEmail
                  defaultAddress{
                    address1 address2 city   country countryCodeV2
                  }
                  metafield(key:"kfo.customer_type"){
                  value
                  }
                }
              }
            }
          }`,
    );

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors.map((error) => error.message).join(", "));
    }
    return {
      status: "success",
      data: data.data.customers.edges,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const updateCustomer = async (admin, customer_id, customerType) => {
  try {
    const response = await admin.graphql(
      `#graphql
                  mutation updateCustomerMetafields($input: CustomerInput!) {
          customerUpdate(input: $input) {
            customer {
              id
              metafield(key:"kfo.customer_type"){
                    value
                    }
            }
            userErrors {
              message
              field
            }
          }
        }`,
      {
        variables: {
          input: {
            metafields: [
              {
                namespace: "kfo",
                key: "customer_type",
                type: "single_line_text_field",
                value: customerType,
              },
            ],
            id: customer_id,
          },
        },
      },
    );

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors.map((error) => error.message).join(", "));
    }
    return {
      status: "success",
      data: data.data,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};

const getCustomerByEmail = async (admin, customer_email) => {
  try {
    const response = await admin.graphql(
      `#graphql
      query GetCustomerByEmail($email: String!) {
 customers(first: 1, query: $email) {
   edges {
     node {
       id
       email
       metafield(key:"kfo.customer_type"){
                  value
                  }
     }
   }
 }
}
     `,
      {
        variables: {
          email: customer_email,
        },
      },
    );

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors.map((error) => error.message).join(", "));
    }
    if(data.data.customers.edges.length>0){
      return {
        status: "success",
        customer: data.data.customers.edges[0].node,
      };
    }
    else{
      return {
        status: "success",
        customer:null
      };
    }
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
};
export { getCustomers, updateCustomer,getCustomerByEmail };
