import {
  DeleteIcon,
    ViewIcon
  } from '@shopify/polaris-icons';
import {
    IndexTable,
    Card,
    Text,
    Badge,
    Button,
    ButtonGroup,
  } from '@shopify/polaris';
  import React from 'react';
  
  export default function OrderTable({data,deleteOrder}) {

    const resourceName = {
      singular: 'order',
      plural: 'orders',
    };
  

  
    const rowMarkup = data.map(
      (
        {node},
        index,
      ) => (
        <IndexTable.Row
          id={node.id}
          key={node.id}
          position={index}
        >
          <IndexTable.Cell>
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {node.name}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>{node.createdAt.replace(/[TZ]/g, " ")}</IndexTable.Cell>
          <IndexTable.Cell>{node.customer?node.customer.displayName:"No Customer"}</IndexTable.Cell>
          <IndexTable.Cell>
            <Text >
            $ {node.totalPriceSet.shopMoney.amount}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>{node.lineItems.nodes.length}</IndexTable.Cell>
          <IndexTable.Cell>{node.displayFulfillmentStatus}</IndexTable.Cell>
          <IndexTable.Cell>            
            <Button icon={ViewIcon} url={'/app/order/'+node.id.match(/\d+/)[0]}></Button>
          </IndexTable.Cell>
        </IndexTable.Row>
      ),
    );
  
    return (
      <Card>
        <IndexTable
          resourceName={resourceName}
          itemCount={data.length}
      
          selectable={false}
          headings={[
            {title: 'Order'},
            {title: 'Date'},
            {title: 'Customer'},
            {title: 'Total'},
            {title: 'Items Count'},
            {title: 'Fulfillment status'},
            {title: 'View'}
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    );
  }