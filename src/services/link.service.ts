import { PrismaClient, Link } from "@prisma/client";
import { generateShortCode } from "../utils/generateShortCode";
import { extractMetadata, Metadata } from "./metadata.service";
import { getPlatform } from "./userAgent.service";

const prisma = new PrismaClient();

export const createLink = async (
  originalUrl: string,
  customMetadata?: Partial<Metadata>
) => {
  // 1. Generate unique short code
  let shortCode = generateShortCode();
  while (await prisma.link.findUnique({ where: { shortCode } })) {
    shortCode = generateShortCode();
  }

  // 2. Extract metadata if not provided
  let metadata: Metadata = { title: "", description: "", imageUrl: "" };
  if (
    !customMetadata ||
    !customMetadata.title ||
    !customMetadata.description ||
    !customMetadata.imageUrl
  ) {
    const extracted = await extractMetadata(originalUrl);
    metadata = { ...extracted, ...customMetadata };
  } else {
    metadata = customMetadata as Metadata;
  }

  // 3. Save to DB
  const link = await prisma.link.create({
    data: {
      shortCode,
      originalUrl,
      title: metadata.title,
      description: metadata.description,
      imageUrl: metadata.imageUrl,
    },
  });

  return link;
};

export const getLinkByShortCode = async (shortCode: string) => {
  return prisma.link.findUnique({
    where: { shortCode },
  });
};

export const getLinkById = async (id: string) => {
  return prisma.link.findUnique({
    where: { id },
    include: {
      analytics: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
};

export const trackClick = async (
  linkId: string,
  userAgent: string,
  ip: string
) => {
  // Increment basic count
  await prisma.link.update({
    where: { id: linkId },
    data: { clicks: { increment: 1 } },
  });

  // Log detailed analytics
  await prisma.analytics.create({
    data: {
      linkId,
      userAgent,
      ip,
      platform: getPlatform(userAgent),
    },
  });
};

export const getAllLinks = async () => {
  return prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const deleteLink = async (id: string) => {
  // Delete analytics first due to FK constraint if not cascading (Prisma handles cascade if configured, but safe to do here or rely on schema)
  // In schema I didn't specify onDelete: Cascade, so I should delete analytics first.
  await prisma.analytics.deleteMany({ where: { linkId: id } });
  return prisma.link.delete({ where: { id } });
};
