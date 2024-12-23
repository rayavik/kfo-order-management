import { IndexTable, LegacyCard, Text, Badge, Card } from "@shopify/polaris";

import React from "react";

export default function GroupLineItems({ data ,title}) {
  const resourceName = {
    singular: "Item",
    plural: "Items",
  };

  const rowMarkup = data.map(
    (
      {
        customAttributes,
        quantity,
        id,
        title,
        originalTotalSet,
        originalUnitPriceSet,
        totalDiscountSet,
      },
      index,
    ) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Text fontWeight="bold">
            {title}
          </Text>
          <Text>
            {" "}
            <span>{customAttributes[0]?.value}</span>
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>
          {originalUnitPriceSet?.presentmentMoney?.amount}{" "}
          {originalUnitPriceSet?.presentmentMoney?.currencyCode}
        </IndexTable.Cell>

        <IndexTable.Cell>
          <Text>{quantity}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {originalTotalSet?.presentmentMoney?.amount}{" "}
          {originalTotalSet?.presentmentMoney?.currencyCode}
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Card>
        <Text alignment="center" fontWeight="bold">{title} Line Items</Text>
      <IndexTable
        selectable={false}
        resourceName={resourceName}
        itemCount={data.length}
        headings={[
          { title: "Name" },
          { title: "Price" },
          { title: "Quantity" },
          { title: "Total" },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}
