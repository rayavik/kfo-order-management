import db from "../../db.server";

async function createGroupAitemsStatus(data) {
  try {
    const { lineItemId, inventoryType, orderId, status, promiseDate, reciveStock, readyDate } = data;
    const groupAitemsStatus = await db.groupAitemsStatus.create({
      data: {
        lineItemId,
        inventoryType,
        orderId,
        status,
        promiseDate,
        reciveStock,
        readyDate,
      },
    });
    return {
      status: "success",
      data: groupAitemsStatus,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function getAllGroupAitemsStatus(orderId) {
  try {
    const groupAitemsStatuses = await db.groupAitemsStatus.findMany({where:{orderId}});
    return {
      status: "success",
      data: groupAitemsStatuses,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function updateGroupAitemsStatus(id, data) {
  try {
    const groupAitemsStatus = await db.groupAitemsStatus.update({
      where: {
        id: parseInt(id),
      },
      data: {
        lineItemId: data.lineItemId,
        inventoryType: data.inventoryType,
        orderId: data.orderId,
        status: data.status,
        promiseDate: data.promiseDate,
        reciveStock: data.reciveStock,
        readyDate: data.readyDate,
      },
    });
    return {
      status: "success",
      data: groupAitemsStatus,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function deleteGroupAitemsStatus(id) {
  try {
    const groupAitemsStatus = await db.groupAitemsStatus.delete({
      where: {
        id: parseInt(id),
      },
    });
    return {
      status: "success",
      data: groupAitemsStatus,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

export { createGroupAitemsStatus, getAllGroupAitemsStatus, updateGroupAitemsStatus, deleteGroupAitemsStatus };
