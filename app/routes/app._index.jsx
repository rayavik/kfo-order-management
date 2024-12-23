import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { ExternalIcon } from "@shopify/polaris-icons";
import { Page, Select } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { authenticate } from "../shopify.server";
import CustomerTable from "../components/CustomerTable";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { getCustomers, updateCustomer } from "../libs/graphql/customer";

export async function loader({ request }) {
  try {
    const { admin } = await authenticate.admin(request);
    const data = await getCustomers(admin);
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

export default function page() {
  const loader_data = useLoaderData();
  const [customers, setCustomers] = useState([]);
  const [customerType, setcustomerType] = useState();
  const [selected, setselected] = useState();
  const handleSelectChange = useCallback((value) => setcustomerType(value), []);

  const actionData = useActionData();

  useEffect(() => {
    console.log("Use Effect Call act");
    if (actionData?.status == "success") {
      setCustomers(actionData.data);
      shopify.toast.show("Data Updated");
    } else if (actionData?.status == "error") {
      shopify.toast.show("Please Try Again Later");
    }
  }, [actionData]);

  const addCustomerType = (data) => {
    console.log(data);
    setselected(data.id);
    shopify.modal.show("my-modal");
  };
  useEffect(() => {
    console.log(loader_data);
    if (loader_data.status == "success") {
      setCustomers(loader_data.data);
    } else {
      shopify.toast.show("Something Error");
      console.log(loader_data);
    }
  }, []);

  const saveData = () => {
    if (customerType && selected) {
      submit({ customer_id: selected, customerType }, { method: "post" });
      setselected(null);
      setcustomerType("");
      shopify.modal.hide("my-modal");
    } else {
      shopify.toast.show("Please Select Customer Type");
    }
  };
  const submit = useSubmit();
  return (
    <Page
      title="Manage Customer"
      secondaryActions={[
        {
          content: "Add Customer",
          external: true,
          icon: ExternalIcon,
          url: "shopify:admin/customers/new",
        },
      ]}
    >
      <CustomerTable data={customers} fun={addCustomerType} />
      <Modal id="my-modal">
        <div style={{ padding: "2%" }}>
          <Select
            onChange={handleSelectChange}
            value={customerType}
            options={[
              { label: "Cabinetmaker", value: "Cabinetmaker" },
              { label: "Trade", value: "Trade" },
              { label: "Showroom", value: "Showroom" },
              { label: "Retail/Guest", value: "Retail_Guest" },
            ]}
          />
        </div>
        <TitleBar title="Update Cutomer Type">
          <button variant="primary" onClick={saveData}>
            Save
          </button>
          <button onClick={() => shopify.modal.hide("my-modal")}>Close</button>
        </TitleBar>
      </Modal>
    </Page>
  );
}

export async function action({ request }) {
  try {
    const { admin } = await authenticate.admin(request);
    const fd = await { ...Object.fromEntries(await request.formData()) };
    await updateCustomer(admin, fd.customer_id, fd.customerType);
    const datac = await getCustomers(admin);
    return {
      status: "success",
      data: datac.data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      error,
    };
  }
}
