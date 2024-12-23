-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupAitemsStatus" (
    "id" SERIAL NOT NULL,
    "lineItemId" TEXT,
    "inventoryType" TEXT,
    "orderId" TEXT,
    "status" TEXT,
    "promiseDate" TEXT,
    "reciveStock" TEXT,
    "readyDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupAitemsStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OthersGroupStatus" (
    "id" SERIAL NOT NULL,
    "groupName" TEXT,
    "inventoryType" TEXT,
    "orderId" TEXT,
    "status" TEXT,
    "promiseDate" TEXT,
    "reciveStock" TEXT,
    "readyDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OthersGroupStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupAComments" (
    "id" SERIAL NOT NULL,
    "lineItemId" TEXT,
    "orderId" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GroupAComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OthersGroupComments" (
    "id" SERIAL NOT NULL,
    "groupName" TEXT,
    "orderId" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OthersGroupComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discounts" (
    "id" SERIAL NOT NULL,
    "collection" TEXT NOT NULL,
    "cabinetmaker" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trade" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "showroom" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "retail_guest" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Discounts_pkey" PRIMARY KEY ("id")
);
