import db from "../../db.server";

async function createOthersGroupComment(data) {
  try {
    const { groupName, orderId, admin, message, read } = data;
    const othersGroupComment = await db.othersGroupComments.create({
      data: {
        groupName,
        orderId,
        admin,
        message,
        read,
      },
    });
    return {
      status: "success",
      data: othersGroupComment,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function getAllOthersGroupComments(orderId) {
  try {
    const othersGroupComments = await db.othersGroupComments.findMany({where:{orderId}});
    return {
      status: "success",
      data: othersGroupComments,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function updateOthersGroupComment(id, data) {
  try {
    const othersGroupComment = await db.othersGroupComments.update({
      where: {
        id: parseInt(id),
      },
      data: {
        groupName: data.groupName,
        orderId: data.orderId,
        admin: data.admin,
        message: data.message,
        read: data.read,
      },
    });
    return {
      status: "success",
      data: othersGroupComment,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function deleteOthersGroupComment(id) {
  try {
    const othersGroupComment = await db.othersGroupComments.delete({
      where: {
        id: parseInt(id),
      },
    });
    return {
      status: "success",
      data: othersGroupComment,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

export { createOthersGroupComment, getAllOthersGroupComments, updateOthersGroupComment, deleteOthersGroupComment };
