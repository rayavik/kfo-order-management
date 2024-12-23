
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
  export default function GroupACard({ title }) {
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
             Group A-Board
            </Button>
          </InlineStack>
  
          <Collapsible
            open={open}
            id="basic-collapsible"
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
            expandOnPrint
          >
            <TextContainer>
              <p>
                Your mailing list lets you contact customers or visitors who have
                shown an interest in your store. Reach out to them with exclusive
                offers or updates about your products.
              </p>
              <Link url="#">Test link</Link>
            </TextContainer>
          </Collapsible>
        </Card>
      </div>
    );
  }
  