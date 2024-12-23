import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import {
  IndexTable,
  LegacyCard,
  Button,
  Text,
  FormLayout,
  TextField,
  Page,
  ButtonGroup,
} from "@shopify/polaris";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { useState, useEffect } from "react";
import {
  createDiscount,
  deleteDiscount,
  getAllDiscounts,
  updateDiscount,
} from "../libs/models/discount";

export async function loader({ request }) {
  try {
    let discounts = await getAllDiscounts();
    return discounts;
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

export default function PageComponent() {
  const ldata = useLoaderData();
  const submit = useSubmit();
  const actionData = useActionData();
  const [discounts, setDiscounts] = useState([]);
  const [collection, setCollection] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    cabinetmaker: 0,
    trade: 0,
    showroom: 0,
    retail_guest: 0,
  });

  useEffect(() => {
    if (ldata?.status == "sucess") {
      setDiscounts(ldata.data);
    } else if (ldata?.status == "error") {
      shopify.toast.show(ldata.error);
    }
  }, []);

  useEffect(() => {
    if (actionData?.status == "error") {
      shopify.toast.show(actionData.error);
    } else if (actionData?.status == "sucess") {
      setDiscounts(actionData?.data);
    }
  }, [actionData]);

  const resourceName = {
    singular: "discount",
    plural: "discounts",
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddClick = async () => {
    const selected = await shopify.resourcePicker({
      type: "collection",
      multiple: false,
    });
    const selectedCollectionTitle = selected[0].title;
    const existingDiscount = discounts.find(
      (order) => order.collection === selectedCollectionTitle,
    );

    if (existingDiscount) {
      shopify.toast.show(
        `Discount for the collection "${selectedCollectionTitle}" already exists.`,
      );
      return;
    }

    setCollection(selected[0].title);
    setIsEditing(false);
    setFormData({
      cabinetmaker: 0,
      trade: 0,
      showroom: 0,
      retail: 0,
    });
    shopify.modal.show("my-modal");
  };

  const handleEditClick = (discount) => {
    setIsEditing(true);
    setEditingRow(discount.id);
    setCollection(discount.collection);
    setFormData({
      collection: collection || discount.collection,
      cabinetmaker: discount.cabinetmaker,
      trade: discount.trade,
      showroom: discount.showroom,
      retail_guest: discount.retail_guest,
    });
    shopify.modal.show("my-modal");
  };

  const handleSave = async () => {
    if (isEditing) {
      submit(
        {
          ...formData,
          id: editingRow,
          req_type: "update",
          collection: collection,
        },
        { method: "post" },
      );
    } else {
      submit(
        { ...formData, req_type: "add", collection: collection },
        { method: "post" },
      );
    }
    shopify.modal.hide("my-modal");
  };

  const handleDeleteClick = async (id) => {
    submit({ req_type: "delete", id }, { method: "post" });
    shopify.toast.show("Data Deleted");
  };

  const rowMarkup = discounts.map(
    (
      { id, collection, cabinetmaker, trade, showroom, retail_guest },
      index,
    ) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {collection}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{cabinetmaker}</IndexTable.Cell>
        <IndexTable.Cell>{trade}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" numeric>
            {showroom}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{retail_guest}</IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup>
            <Button
              icon={EditIcon}
              onClick={() =>
                handleEditClick({
                  id,
                  collection,
                  cabinetmaker,
                  trade,
                  showroom,
                  retail_guest,
                })
              }
            />
            <Button
              icon={DeleteIcon}
              onClick={() => handleDeleteClick(id)}
              tone="critical"
            />
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Page
      title="Manage Discounts"
      primaryAction={
        <Button variant="primary" onClick={handleAddClick}>
          Add Discount
        </Button>
      }
    >
      <LegacyCard>
        <IndexTable
          resourceName={resourceName}
          itemCount={discounts.length}
          selectable={false}
          headings={[
            { title: "Collection" },
            { title: "Cabinetmaker" },
            { title: "Trade" },
            { title: "Showroom" },
            { title: "Retail/Guest" },
            { title: "Actions" },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>

      <Modal id="my-modal">
        <div style={{ padding: "4%" }}>
          <FormLayout>
            <FormLayout.Group>
              <TextField
                type="number"
                label="Cabinet Maker"
                value={formData.cabinetmaker}
                onChange={(value) => handleFormChange("cabinetmaker", value)}
                autoComplete="off"
              />
              <TextField
                type="number"
                label="Trade"
                value={formData.trade}
                onChange={(value) => handleFormChange("trade", value)}
                autoComplete="off"
              />
            </FormLayout.Group>
            <FormLayout.Group>
              <TextField
                type="number"
                label="Showroom"
                value={formData.showroom}
                onChange={(value) => handleFormChange("showroom", value)}
                autoComplete="off"
              />
              <TextField
                type="number"
                label="Retail/Guest"
                value={formData.retail_guest}
                onChange={(value) => handleFormChange("retail_guest", value)}
                autoComplete="off"
              />
            </FormLayout.Group>
          </FormLayout>
        </div>
        <TitleBar
          title={
            isEditing
              ? `Edit Discount ${collection}`
              : `Add Discount on ${collection}`
          }
        >
          <button variant="primary" onClick={handleSave} >
           {isEditing?"Update":"Save"}
          </button>
          <button onClick={() => shopify.modal.hide("my-modal")}>Cancel</button>
        </TitleBar>
      </Modal>
    </Page>
  );
}

export async function action({ request }) {
  try {
    const data = { ...Object.fromEntries(await request.formData()) };
    console.log(data);
    const {
      collection,
      cabinetmaker,
      trade,
      retail_guest,
      showroom,
      req_type,
      id,
    } = data;
    if (req_type == "add") {
      let res = await createDiscount({
        collection,
        cabinetmaker,
        trade,
        showroom,
        retail_guest,
      });
    } else if (req_type == "update") {
      await updateDiscount(id, {
        collection,
        cabinetmaker,
        trade,
        showroom,
        retail_guest,
      });
    } else if (req_type == "delete") {
      await deleteDiscount(data.id);
    }
    const discounts = await getAllDiscounts();
    return discounts;
  } catch (error) {
    return {
      status: error,
      error,
    };
  }
}
