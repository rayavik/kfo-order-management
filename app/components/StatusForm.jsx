
import { useState, useCallback } from "react";
import {
    SaveIcon
  } from '@shopify/polaris-icons';
import {
  Select,
  FormLayout,
  TextField,
  Card,
  Button,
} from "@shopify/polaris";

export default function StatusForm() {
  const [input, setInput] = useState({
    inventoryType: "",
    status: "",
    spd: "",
    ris: "",
    srd: "",
    id: null,
  });

  const handleInputChange = (field) => (value) => {
    setInput((prevInput) => ({
      ...prevInput,
      [field]: value,
    }));
  };

  const getStatusOptions = (inventoryType) => {
    switch (inventoryType) {
      case "Buy-In Item":
        return [
          { label: "To Be Ordered", value: "To Be Ordered" },
          { label: "On Order", value: "On Order" },
          {
            label: "Stock Received from Supplier",
            value: "Stock Received from Supplier",
          },
          { label: "Not Available", value: "Not Available" },
          { label: "In Stock", value: "In Stock" },
        ];
      case "Buy-In Service":
        return [
          { label: "Awaiting Fabrication", value: "Awaiting Fabrication" },
          { label: "Sent to Supplier", value: "Sent to Supplier" },
          { label: "Received from Supplier", value: "Received from Supplier" },
        ];
      case "Factory Service":
        return [
          { label: "Awaiting Materials", value: "Awaiting Materials" },
          { label: "In Progress", value: "In Progress" },
        ];
      default:
        return [];
    }
  };

  return (
    <div style={{ margin: "1%" }}>
      <Card roundedAbove="sm">
        <FormLayout>
          <FormLayout.Group>
            <Select
              label="Item Inventory Type"
              options={[
                { label: "Buy-In Item", value: "Buy-In Item" },
                { label: "Buy-In Service", value: "Buy-In Service" },
                { label: "Factory Service", value: "Factory Service" },
              ]}
              value={input.inventoryType}
              onChange={handleInputChange("inventoryType")}
            />
            <Select
              label="Item Status"
              options={getStatusOptions(input.inventoryType)}
              value={input.status}
              onChange={handleInputChange("status")}
            />
          </FormLayout.Group>

          <FormLayout.Group>
            <TextField
              label="Supplier Promise Date"
              type="date"
              value={input.spd}
              onChange={handleInputChange("spd")}
            />
            <TextField
              label="Received In Stock"
              value={input.ris}
              onChange={handleInputChange("ris")}
            />
            <TextField
              type="date"
              label="Scheduled Ready Date"
              value={input.srd}
              onChange={handleInputChange("srd")}
            />
          </FormLayout.Group>

          <Button icon={SaveIcon} variant="primary" onClick={() => console.log(input)} primary>
            Save
          </Button>
        </FormLayout>
      </Card>
    </div>
  );
}
