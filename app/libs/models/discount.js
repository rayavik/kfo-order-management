import db from "../../db.server";

async function createDiscount(data) {
  try {
    const { collection, cabinetmaker, trade, showroom, retail_guest } = data;
    const discount = await db.discounts.create({
      data: {
        collection,
        cabinetmaker:parseFloat(cabinetmaker),
        trade:parseFloat(trade),
        showroom:parseFloat(showroom),
        retail_guest:parseFloat(retail_guest),
      },
    });

    return {
      status: "sucess",
      data: discount,
    };
  } catch (error) {
    console.log(error)
    return {
      status: "error",
      error,
    };
  }
}

async function getAllDiscounts() {
  try {
    const discounts = await db.discounts.findMany();
    return {
      status: "sucess",
      data: discounts,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function updateDiscount(id, data) {
  try {
    const discount = await db.discounts.update({
      where: {
        id: parseInt(id),
      },
      data: {
        collection: data.collection,
        cabinetmaker:parseFloat(data.cabinetmaker),
        trade:parseFloat(data.trade),
        showroom: parseFloat(data.showroom),
        retail_guest: parseFloat(data.retail_guest),
      },
    });
    return {
      status: "sucess",
      data: discount,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

async function deleteDiscount(id) {
  try {
    const discount = await db.discounts.delete({
      where: {
        id: parseInt(id),
      },
    });
    return {
      status: "sucess",
      data: discount,
    };
  } catch (error) {
    return {
      status: "error",
      error,
    };
  }
}

export { createDiscount, getAllDiscounts, updateDiscount, deleteDiscount };
