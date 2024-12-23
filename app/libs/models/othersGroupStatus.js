import db from "../../db.server";

async function createOthersGroupStatus(data) {
  try {
    const { groupName, inventoryType, orderId, status, promiseDate, reciveStock, readyDate } = data;
    const othersGroupStatus = await db.othersGroupStatus.create({
      data: {
        groupName,
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
      data: othersGroupStatus,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function getAllOthersGroupStatus(orderId) {
  try {
    const othersGroupStatuses = await db.othersGroupStatus.findMany({where:{orderId}});
    return {
      status: "success",
      data: othersGroupStatuses,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function updateOthersGroupStatus(id, data) {
  try {
    const othersGroupStatus = await db.othersGroupStatus.update({
      where: {
        id: parseInt(id),
      },
      data: {
        groupName: data.groupName,
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
      data: othersGroupStatus,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function deleteOthersGroupStatus(id) {
  try {
    const othersGroupStatus = await db.othersGroupStatus.delete({
      where: {
        id: parseInt(id),
      },
    });
    return {
      status: "success",
      data: othersGroupStatus,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

export { createOthersGroupStatus, getAllOthersGroupStatus, updateOthersGroupStatus, deleteOthersGroupStatus };
