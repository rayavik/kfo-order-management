import { useLoaderData, useSubmit } from "@remix-run/react";
import { Page, Spinner } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { authenticate } from "../shopify.server";
import OrderTable from "../components/OrderTable";
import { getOrders } from "../libs/graphql/order";

export async function loader({ request }) {
  try {
    const { admin } = await authenticate.admin(request);

    const data = await getOrders(admin);
    return {
      status: "success",
      data: data.data,
    };
  } catch (error) {
    console.error("Failed to load data:", error);
    return {
      status: "failed",
      error,
    };
  }
}

export default function PageComponent() {
  const loaderData = useLoaderData();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  useEffect(() => {
    if (loaderData.status === "success") {
      setOrders(loaderData.data);
    } else {
      console.error("Error loading data:", loaderData.error);
      shopify.toast.show("Something went wrong while loading orders.");
    }
  }, [loaderData]);


  return (
    <Page title="Manage Order">
      {loading ? (
        <Spinner accessibilityLabel="Loading..." size="large" />
      ) : (
        <>
          <OrderTable data={orders}  />
        </>
      )}
      {error && <div>{shopify.toast.show(error)}</div>}
    </Page>
  );
}
