import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { Page, Spinner } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { authenticate } from "../shopify.server";
import OrderTable from "../components/OrderTable";
import OrderInput from "../components/OrderInput";
import DraftOrderTable from "../components/DraftOrderTable";
import {
  createDraftOrder,
  deleteDraftOrder,
  getDraftOrders,
} from "../libs/graphql/draft_order";
import { getCustomerByEmail } from "../libs/graphql/customer";
import { getAllDiscounts } from "../libs/models/discount";
import { productsBySkus } from "../libs/graphql/product";

export async function loader({ request, params }) {
  try {
    const { admin, session } = await authenticate.admin(request);

    const data = await getDraftOrders(admin);
    return {
      status: "success",
      data: data.data,
    };
  } catch (error) {
    return {
      status: "failed",
      error,
    };
  }
}

export default function PageComponent() {
  const loaderData = useLoaderData();
  const act_data = useActionData();

  // State variables for loading and error
  const [orders, setOrders] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false); // For spinner
  const [error, setError] = useState(null); // For error

  const showInput = useCallback((data) => {
    setJsonData(data);
  }, []);

  useEffect(() => {
    if (loaderData.status === "success") {
      setOrders(loaderData.data);
    } else {
      console.error("Error loading data:", loaderData.error);
      shopify.toast.show("Something went wrong while loading orders.");
    }
  }, [loaderData]);

  useEffect(() => {
    if (act_data?.status === "success") {
      //shopify.toast.show("Draft Order Created");
      setOrders(act_data.data);
      setLoading(false);
    } 
    else{
      console.log(act_data)
    }
  }, [act_data]);

  const submit = useSubmit();
  const deleteOrder = (id) => {
    submit({ id }, { method: "post" });
  };
  const handleSaveOrder = () => {
    setLoading(true); // Start spinner
    setError(null); // Reset error
    const dt = JSON.stringify(jsonData);
    submit({ dt }, { method: "post" });
  };

  return (
    <Page
      title="Manage Draft Orders"
      primaryAction={{
        content: "Import Order",
        onAction: () => {
          shopify.modal.show("addcsv");
        },
      }}
    >
      
      {loading ? (
        <Spinner accessibilityLabel="Loading..." size="large" />
      ) : (
        <DraftOrderTable data={orders} deleteOrder={deleteOrder} />
      )}

      <Modal id="addcsv" variant="base">
        <div style={{ padding: "3%" }}>
          <OrderInput handle={showInput} />
        </div>

        <TitleBar title="Upload">
          <button
            variant="primary"
            onClick={() => {
              shopify.modal.hide("addcsv");
              handleSaveOrder(); 
            }}
          >
            Save
          </button>
        </TitleBar>
      </Modal>
      {error && <div>{shopify.toast.show(error)}</div>}
    </Page>
  );
}

export async function action({ request }) {
  function getDiscount(data, collectionName, type) {
    const normalizedCollectionName = collectionName.toLowerCase();
    const normalizedType = type.toLowerCase();
    const item = data.find(
      (obj) => obj.collection.toLowerCase() === normalizedCollectionName,
    );
    return item && item[normalizedType] ? item[normalizedType] : 0;
  }

  function findProductBySku(products, sku) {
    const normalizedSku = sku.trim().toLowerCase();
    return products.find((product) => {
      const normalizedProductSku = product.sku.trim().toLowerCase();
      return normalizedProductSku === normalizedSku;
    });
  }

  try {
    const { admin } = await authenticate.admin(request);
    const dt = { ...Object.fromEntries(await request.formData()) };
    if (dt.id) {
      let res = await deleteDraftOrder(admin, dt.id);
      console.log(res);
      if (res.status == "success") {
        let temp = await getDraftOrders(admin);
        return temp;
      }
      return res;
    } else {
      const items = JSON.parse(dt.dt);
      const customer_email = items[0].Customer_Email
        ? items[0].Customer_Email
        : "info@totalcabinetry.com.au";
      const note = items[0].Job_Number;
      let customer = null;
      let customerType = "Retail_Guest"; //Cabinetmaker,Trade,Showroom,Retail_Guest

      let res = await getCustomerByEmail(admin, customer_email);
      if (res.status == "success" && res.customer) {
        customer = res.customer;
        if (customer.metafield) {
          customerType = customer.metafield.value;
        }
      }
      let discounts = await getAllDiscounts();
      discounts = discounts.data;
      const query = items
        .map((item) => {
          const cleanedMatId = item.Mat_id.trim().split(" ")[0];
          return `sku:${cleanedMatId}`;
        })
        .join(" OR ");

      let lineItems = [];

      let store_variants = await productsBySkus(admin, query);
      store_variants = store_variants.data;

      items.map((item) => {
        let variant = findProductBySku(store_variants, item.Mat_id);
        if (variant) {
          let discount = getDiscount(
            discounts,
            variant.product.tags[0],
            customerType,
          );

          if (discount > 0) {
            lineItems.push({
              variantId: variant.id,
              quantity: parseInt(item.Qty),
              customAttributes: {
                key: "Description",
                value: variant.product.description,
              },
              appliedDiscount: {
                value: parseFloat(discount),
                valueType: "PERCENTAGE",
              },
            });
          } else {
            lineItems.push({
              variantId: variant.id,
              quantity: parseInt(item.Qty),
              customAttributes: {
                key: "Description",
                value: variant.product.description,
              },
            });
          }
        } else {
          lineItems.push({
            title: item.KFO_Item_SKU,
            originalUnitPrice: parseFloat(item.Unit),
            quantity: parseInt(item.Qty),
            customAttributes: {
              key: "Description",
              value: item.Description + " ( " + item.Mat_id + " )",
            },
          });
        }
      });

      let response = await createDraftOrder(admin, {
        customer,
        lineItems,
        note,
      });

      if (response.status == "success") {
        let res = await getDraftOrders(admin);
        return res;
      } else {
        return response;
      }
    }
  } catch (error) {
    console.log(error)
    return {
      status: "error",
      error,
    };
  }
}
