import {
  Card,
  Text,
  Collapsible,
  Button,
  Link,
  TextContainer,
  InlineStack,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ToggleOffIcon } from "@shopify/polaris-icons";
import GroupLineItems from "./GroupLineItems";
import StatusForm from "./StatusForm";
import ChatBox from "./ChatBox";
export default function GroupCard({ title ,items}) {
    console.log(items)
  const [open, setOpen] = useState(true);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  return (
    <div style={{ marginBottom: "2%" }}>
      <Card roundedAbove="sm">
        <InlineStack align="center" direction={"row"} blockAlign="center">
          <Button
            variant={open ? "primary" : "secondary"}
            open
            onClick={handleToggle}
            icon={ToggleOffIcon}
          >
            {" "}
            {title}
          </Button>
        </InlineStack>

        <Collapsible
          open={open}
          id="basic-collapsible"
          transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
          expandOnPrint
        >
          <div style={{marginBottom:'2%',marginTop:'2%'}}>
            <StatusForm />
          </div>
        <div style={{marginTop:'2%'}}>
        <GroupLineItems  data={items} title={title}/>
        <div>
        <ChatBox/>
        </div>
        </div>
        </Collapsible>
      </Card>
    </div>
  );
}
