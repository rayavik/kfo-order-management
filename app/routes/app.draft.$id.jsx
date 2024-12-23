import { useLoaderData, useActionData, useSubmit } from "@remix-run/react";
import {
  Card,
  Page,
  Select,
  Button,
  Layout,
  InlineGrid,
  ButtonGroup,
  Text,
  TextField,
  PageActions,
} from "@shopify/polaris";





import { useState, useCallback, useEffect } from "react";
import { authenticate } from "../shopify.server";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { DeleteIcon, ExternalIcon } from "@shopify/polaris-icons";
import { getAllDiscounts } from "../libs/models/discount";
import {
  getDraftOrderById,
  updateDraftOrder,
} from "../libs/graphql/draft_order";
import { getCustomers } from "../libs/graphql/customer";

export async function loader({ request, params }) {
  try {
    const { admin } = await authenticate.admin(request);
    const customers = await getCustomers(admin);
    const data = await getDraftOrderById(admin, params.id);
    let discounts = await getAllDiscounts();
    return {
      status: "success",
      data: data.data,
      discounts,
      customers: customers.data,
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
  const { status, data, error, discounts, customers } = useLoaderData();
  const [order, setOrder] = useState({});
  const [alldiscount, setAllDiscount] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [note, setNote] = useState("");
  const [lineItems, setLineItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selected, setSelected] = useState(null);
  const [productForm, setProductForm] = useState({
    variantId: "",
    quantity: 1,
    description: "",
    collection: "",
  });
  const [customForm, setCustomForm] = useState({
    itemName: "",
    price: 0,
    quantity: 1,
    description: "",
  });

  const submit = useSubmit();
  const action_data = useActionData();

  useEffect(() => {
    let temp = lineItems.map((item) => {
      return {
        ...item,
        discount: getDiscount(
          alldiscount,
          item.collection,
          customer.metafield?.value,
        ),
      };
    });
    setLineItems(temp);
  }, [customer]);


  
  function getDiscount(data, collectionName, ctype) {
    const normalizedCollectionName = collectionName.toLowerCase();
    ctype=ctype?ctype:"";
    console.log(data, collectionName, ctype)
    const normalizedType = ctype.toLowerCase();
        const item = data.find(
      (obj) => obj.collection.toLowerCase() === normalizedCollectionName,
    );
    return item && item[normalizedType] ? item[normalizedType] : 0;
  }

  function removeHtmlTags(inputString) {
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = inputString;
    return tempDiv.textContent || tempDiv.innerText || "";
  }
  const handleAddProduct = async () => {
    const tt = await shopify.resourcePicker({
      type: "product",
      multiple: false,
    });
    if (tt[0]) {
      setSelected(tt[0]);
      shopify.modal.show("product-modal");
      setProductForm({
        ...productForm,
        description: removeHtmlTags(tt[0].descriptionHtml),
        variantId: tt[0].variants[0].id,
        collection: tt[0].tags[0],
      });
    }
  };

  const handleCustomProduct = () => {
    shopify.modal.show("custom-modal");
  };

  const handleSubmitProduct = () => {
    shopify.modal.hide("product-modal");

    let discountAmount = 0;
    if (customer && customer.metafield) {
      discountAmount = getDiscount(
        alldiscount,
        productForm.collection,
        customer.metafield.value,
      );
    }

    const newLineItem = {
      title: selected.title,
      quantity: productForm.quantity,
      description: productForm.description,
      collection: selected.tags[0],
      total: selected.variants[0].price * productForm.quantity,
      unitPrice: selected.variants[0].price,
      discount: discountAmount,
      variantId: selected.variants[0].id,
      sku: selected.variants[0].sku,
      productType: selected.productType,
    };

    setLineItems((prev) => [newLineItem, ...prev]);
  };

  const handleSubmitCustom = () => {
    shopify.modal.hide("custom-modal");

    const newLineItem = {
      title: customForm.itemName,
      quantity: customForm.quantity,
      description: customForm.description,
      total: customForm.price * customForm.quantity,
      unitPrice: customForm.price,
      collection: "",
      discount: 0,
      variantId: null,
      sku: null,
      productType: null,
    };

    setLineItems((prev) => [newLineItem, ...prev]);
  };

  const handleProductChange = (field, value) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomChange = (field, value) => {
    setCustomForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (variantId, newQuantity) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId
          ? {
              ...item,
              quantity: newQuantity,
              total: item.unitPrice * newQuantity,
            }
          : item,
      ),
    );
  };

  const handleRemoveItem = (variantId) => {
    setLineItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const handleSaveData = useCallback(() => {
    let data = {
      data: JSON.stringify({ lineItems, customer: customer.email, note: note }),
    };
    submit(data, { method: "post" });
  });

  useEffect(() => {
    if (status === "success") {
      setAllDiscount(discounts.data);
      setOrder(data.draftOrder);
      setAllCustomers(customers);
      setNote(data.draftOrder.note2);

      /**    */
      if (data.draftOrder.customer) {
        const tempcus = customers.find(
          (c) => c.node.email === data.draftOrder.email,
        );
        setCustomer(tempcus.node);
        setSelectedCustomer(tempcus.node.id);
      }

      const items = data.draftOrder.lineItems.nodes.map((item) => ({
        title: item.product ? item.product.title : item.title,
        quantity: item.quantity,
        collection: item.product ? item.product.tags[0] : "",
        description: item.customAttributes.length
          ? item.customAttributes[0].value
          : "",
        total: item.originalTotalSet.presentmentMoney.amount,
        unitPrice: item.originalUnitPriceSet.presentmentMoney.amount,
        discount: item.appliedDiscount ? item.appliedDiscount.value : 0,
        variantId: item.variant ? item.variant.id : null,
        sku: item.variant ? item.variant.sku : "",
        productType: item.product ? item.product.productType : "",
      }));

      setLineItems(items);
    } else if (status === "failed") {
      console.error("Error:", error);
    }
  }, [status, data, error, discounts, customers]);

  useEffect(() => {
    let msg = "";
    if (action_data?.status == "success") {
      shopify.toast.show("Data Updated");
    }
  }, [action_data]);

  return (
    <Page
      title={`Draft Order ${data.draftOrder.name}`}
      secondaryActions={[
        {
          content: "Collect Payment",
          external: "true",
          icon: ExternalIcon,
          url: `shopify:admin/draft_orders/${data.draftOrder.id.substr(25)}`,
        },
      ]}
      backAction={{ url: "/app/draft_orders" }}
    >
      <Layout>
        <Layout.Section variant="oneHalf">
          {lineItems.map((item) => (
            <div
              key={item.variantId || item.title}
              style={{ marginBottom: "2%" }}
            >
              <Card>
                <InlineGrid columns={2}>
                  <div>
                    <Text fontWeight="bold">{item.title}</Text>
                    {item.productType && (
                      <Text tone="caution">({item.productType})</Text>
                    )}
                    {item.sku && (
                      <Text>
                        <b>SKU:</b> {item.sku}
                      </Text>
                    )}
                    {item.discount > 0 && (
                      <Text tone="success" fontWeight="bold">
                        <b>Custom Discount ({item.discount} %)</b>
                      </Text>
                    )}
                    <Text>
                      <b>Description:</b> {item.description}
                    </Text>
                    <Text>{item.collection}</Text>
                  </div>
                  <div>
                    <TextField
                      label="Quantity"
                      value={item.quantity}
                      onChange={(value) =>
                        handleQuantityChange(item.variantId, Number(value))
                      }
                      connectedRight={
                        <Button
                          icon={DeleteIcon}
                          onClick={() => handleRemoveItem(item.variantId)}
                        />
                      }
                    />
                    <Text>
                      ${item.unitPrice} x {item.quantity} = ${item.total}
                    </Text>
                  </div>
                </InlineGrid>
              </Card>
            </div>
          ))}
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card padding={"500"}>
            <ButtonGroup gap="loose">
              <Button variant="primary" onClick={handleAddProduct}>
                Add Product
              </Button>
              <Button onClick={handleCustomProduct}>Add Custom Item</Button>
            </ButtonGroup>
          </Card>
          <div style={{ marginTop: "2%" }}>
            <Card>
              <TextField
                label="Note"
                value={note}
                onChange={(v) => setNote(v)}
              />
            </Card>
          </div>
          <div style={{ marginTop: "2%" }}>
            <Card>
              <Text alignment="center" fontWeight="bold">
                Customer
              </Text>
              {customer && (
                <div>
                  <Text>
                    <b>Name:</b> {customer.displayName}
                  </Text>
                  <Text>
                    <b>Email:</b> {customer.email}
                  </Text>
                  <Text>
                    <b>Customer Type:</b> {customer.metafield?.value}
                  </Text>
                </div>
              )}
              <div style={{ marginTop: "5%" }}>
                <Select
                  value={selectedCustomer}
                  options={allCustomers.map((cust) => ({
                    label: cust.node.displayName,
                    value: cust.node.id,
                  }))}
                  label="Change Customer"
                  onChange={(v) => {
                    setSelectedCustomer(v);
                    const newCustomer = allCustomers.find(
                      (item) => item.node.id === v,
                    )?.node;
                    setCustomer(newCustomer);
                  }}
                />
              </div>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
      <PageActions
        primaryAction={{
          content: "Save Changes",
          onAction: handleSaveData,
        }}
      />
      <Modal id="product-modal" variant="base">
        <div style={{ padding: "5%" }}>
          <InlineGrid gap={"800"} columns={2}>
            <TextField
              label="Quantity"
              type="number"
              requiredIndicator
              value={productForm.quantity}
              onChange={(value) => handleProductChange("quantity", value)}
            />
            <TextField
              label="Description"
              value={productForm.description}
              onChange={(value) => handleProductChange("description", value)}
            />
          </InlineGrid>
        </div>
        <TitleBar title={selected ? selected.title : ""}>
          <button variant="primary" onClick={handleSubmitProduct}>
            Save
          </button>
          <button
            onClick={() => {
              shopify.modal.hide("product-modal");
            }}
          >
            Cancel
          </button>
        </TitleBar>
      </Modal>

      <Modal id="custom-modal" variant="base">
        <div style={{ padding: "5%" }}>
          <InlineGrid gap={"800"} columns={2}>
            <TextField
              label="Item Name"
              requiredIndicator
              value={customForm.itemName}
              onChange={(value) => handleCustomChange("itemName", value)}
            />
            <TextField
              label="Price"
              type="number"
              requiredIndicator
              value={customForm.price}
              onChange={(value) => handleCustomChange("price", value)}
            />
            <TextField
              label="Quantity"
              type="number"
              requiredIndicator
              value={customForm.quantity}
              onChange={(value) => handleCustomChange("quantity", value)}
            />
            <TextField
              label="Description"
              value={customForm.description}
              onChange={(value) => handleCustomChange("description", value)}
            />
          </InlineGrid>
        </div>
        <TitleBar title="Add Custom Item">
          <button variant="primary" onClick={handleSubmitCustom}>
            Save
          </button>
          <button
            onClick={() => {
              shopify.modal.hide("custom-modal");
            }}
          >
            Cancel
          </button>
        </TitleBar>
      </Modal>
    </Page>
  );
}

export async function action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());
  let dt = JSON.parse(formData.data);
  let customer_id = dt.customer;
  let note = dt.note;

  let items = [];
  dt.lineItems.forEach((element) => {
    if (element.variantId) {
      const item = {
        variantId: element.variantId,
        quantity: parseInt(element.quantity),
      };

      if (element.description) {
        item.customAttributes = {
          key: "Description",
          value: element.description,
        };
      }

      if (parseFloat(element.discount) > 0) {
        item.appliedDiscount = {
          value: parseFloat(element.discount),
          valueType: "PERCENTAGE",
        };
      }

      items.push(item);
    } else {
      const item = {
        title: element.title,
        originalUnitPrice: parseFloat(
          element.unitPrice.match(/[\d,]+(\.\d+)?/)
            ? element.unitPrice.match(/[\d,]+(\.\d+)?/)[0]
            : 0,
        ),
        quantity: parseInt(element.quantity),
      };

      if (element.description) {
        item.customAttributes = {
          key: "Description",
          value: element.description,
        };
      }
      items.push(item);
    }
  });

  const { admin } = await authenticate.admin(request);
  const data = await updateDraftOrder(admin, {
    items,
    note,
    customer_id,
    id: params.id,
  });
  return data;
}
