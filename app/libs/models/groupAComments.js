import db from "../../db.server";

async function createGroupAComment(data) {
  try {
    const { lineItemId, orderId, admin, message, read } = data;
    const groupAComment = await db.groupAComments.create({
      data: {
        lineItemId,
        orderId,
        admin,
        message,
        read,
      },
    });
    return {
      status: "success",
      data: groupAComment,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function getAllGroupAComments(orderId) {
  try {
    const groupAComments = await db.groupAComments.findMany({where:{orderId:orderId}});
    return {
      status: "success",
      data: groupAComments,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function updateGroupAComment(id, data) {
  try {
    const groupAComment = await db.groupAComments.update({
      where: {
        id: parseInt(id),
      },
      data: {
        lineItemId: data.lineItemId,
        orderId: data.orderId,
        admin: data.admin,
        message: data.message,
        read: data.read,
      },
    });
    return {
      status: "success",
      data: groupAComment,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function deleteGroupAComment(id) {
  try {
    const groupAComment = await db.groupAComments.delete({
      where: {
        id: parseInt(id),
      },
    });
    return {
      status: "success",
      data: groupAComment,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function deleteAllGroupAComment(orderId) {
  try {
     await db.groupAComments.delete({
      where: {
        id: orderId(id),
      },
    });
    return {
      status: "success",
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

export { createGroupAComment, getAllGroupAComments, updateGroupAComment, deleteGroupAComment,deleteAllGroupAComment };
