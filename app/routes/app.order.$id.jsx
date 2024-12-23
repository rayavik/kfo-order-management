import { useLoaderData, useActionData,useSubmit } from "@remix-run/react";
import { Card, Page, Button, Collapsible, Layout, InlineGrid, ButtonGroup, Text, TextField, InlineStack } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { authenticate } from "../shopify.server";
import { getOrderById } from "../libs/graphql/order";
import { getAllGroupAComments } from "../libs/models/groupAComments";
import { getAllGroupAitemsStatus } from "../libs/models/GroupAitemsStatus";
import { getAllOthersGroupComments } from "../libs/models/othersGroupComments";
import GroupCard from "../components/GroupCard";
import GroupACard from "../components/GroupACard";

function categorizeProducts(lineItems) {

  const groupABoard = [];
  const groupCHardware = [];
  const groupEFactoryCharges = [];
  const groupDAccessories = [];
  const others = [];

  // Loop through each line item and categorize based on productType
  lineItems.forEach(item => {
    const productType = item.product ? item.product.productType : null;
    // Categorize based on the productType or place it in 'Others'
    if (productType === "Group A-Board") {
      groupABoard.push(item);
    } else if (productType === "Group C-Hardware") {
      groupCHardware.push(item);
    } else if (productType === "Group E-Factory Charges") {
      groupEFactoryCharges.push(item);
    } else if (productType === "Group D-Accessories") {
      groupDAccessories.push(item);
    } else {
      others.push(item);
    }
  });

  // Return the individual arrays for each category
  return {
    groupABoard,
    groupCHardware,
    groupEFactoryCharges,
    groupDAccessories,
    others
  };
}



export async function loader({ request, params }) {
  try {
    const { admin } = await authenticate.admin(request);
    const order=await getOrderById(admin,params.id);
    let groupAcomments=await getAllGroupAComments(params.id);
    let groupAStatus=await getAllGroupAitemsStatus(params.id);
    
    let othersGroupStatus=await getAllGroupAitemsStatus(params.id);
    let othersGroupcomments=await getAllOthersGroupComments(params.id);

 


    return {
      status: "success",
      data: order.data,
      groupAcomments,
      groupAStatus,
      othersGroupStatus,
      othersGroupcomments
    };
  } catch (error) {
    console.error(error);
    return {
      status: "failed",
      error: error.message || "An error occurred while fetching the order.",
    };
  }
}

export default function OrderPage() {
  const { status, data, error,groupAcomments, groupAStatus,othersGroupStatus,othersGroupcomments} = useLoaderData();
  const [order, setorder] = useState();
  useEffect(() => {
    if (status === "success") {
      setorder(data.order);
    } else if (status === "failed") {
      console.error("Error:", error);
    }
  }, [status, data, error]);

  if (status === "failed") {
    return (
      <Page title="Error" >
        <Card>
          <p>{error}</p>
        </Card>
      </Page>
    );
  }

  const lineItems = data?.order?.lineItems?.nodes || [];

  let {groupABoard,
    groupCHardware,
    groupEFactoryCharges,
    groupDAccessories,
    others  }=categorizeProducts(lineItems);

//console.log(groupABoard,groupCHardware,groupDAccessorie,groupEFactoryCharges,others)

  return (
    <Page title={`Order ${data?.order?.name}`} backAction={{url:"/app/orders"}}>
    <Card>

    <Layout  >
<Layout.Section variant="fullWidth">
  <Card>
    <Text><b>Job Number :</b>{data?.order?.note} </Text> 
    <Text><b>Customer Email : </b> {data?.order?.customer?.email}</Text>
    <Text><b>Customer Type : </b> {data?.order?.customer?.tags}</Text>
   </Card>
</Layout.Section>
<Layout.Section variant="fullWidth">

{
  groupABoard.length > 0 && <GroupACard items={groupABoard} comments={[]} status={[]} />
}

{
  groupCHardware.length >0 && <GroupCard items={groupCHardware} comments={[]} status={[]} title="Group C Hardware"/>
}

{
  groupDAccessories.length >0 && <GroupCard  items={groupDAccessories}  comments={[]} status={[]} title="Group D Accessories"/>
}

{
  groupEFactoryCharges.length >0 && <GroupCard  items={groupEFactoryCharges} comments={[]} status={[]} title="Group E Factory Charges"/>
}

{
  others.length >0 && <GroupCard  items={others} comments={[]} status={[]} title="Others" />
}

</Layout.Section>
</Layout>
    </Card>
    </Page>
  );
}

