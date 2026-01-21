import { writeClient } from "@/sanity/lib/serverClient";
import {
  PRODUCTS_COUNT_BY_TENANT_QUERY,
  PRODUCTS_BY_TENANT_QUERY,
  PRODUCTS_WITH_ACTIVE_OFFERS_QUERY,
  PRODUCTS_BY_OFFER_STATUS_QUERY,
  PRODUCTS_COUNT_BY_OFFER_STATUS_QUERY,
  PRODUCTS_WITH_OFFERS_BY_TENANT_QUERY,
  PRODUCTS_WITH_OFFERS_COUNT_QUERY,
} from "@/sanity/queries/products";

// Create a new product
export async function createProduct(productData) {
  try {
    const doc = {
      _type: "product",
      tenantType: productData.tenantType,
      tenantId: productData.tenantId,
      title: productData.title,
      description: productData.description || undefined,
      price: productData.price !== undefined ? parseFloat(productData.price) : undefined,
      quantity: productData.quantity !== undefined ? parseFloat(productData.quantity) : undefined,
      currency: productData.currency || "SAR",
      weightUnit: productData.weightUnit || "kg",
      image: productData.imageAsset
        ? {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: productData.imageAsset._id,
          },
        }
        : undefined,
      createdAt: new Date().toISOString(),
    };

    // Add company or supplier reference based on tenantType
    if (productData.tenantType === "company" && productData.tenantDocId) {
      doc.company = {
        _type: "reference",
        _ref: productData.tenantDocId,
      };
    } else if (productData.tenantType === "supplier" && productData.tenantDocId) {
      doc.supplier = {
        _type: "reference",
        _ref: productData.tenantDocId,
      };
    }

    const result = await writeClient.create(doc);
    return result;
  } catch (error) {
    throw error;
  }
}

// Get products for a tenant (company or supplier)
export async function getProductsForTenant(
  tenantType,
  tenantId,
  page = 1,
  limit = 6
) {
  try {
    if (!tenantType || !tenantId)
      return { items: [], stats: { total: 0, page: 1, totalPages: 0 } };

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get total count first
    const total = await writeClient.fetch(PRODUCTS_COUNT_BY_TENANT_QUERY, {
      tenantType,
      tenantId,
    });

    // Get paginated items using Sanity's slice syntax
    const items = await writeClient.fetch(PRODUCTS_BY_TENANT_QUERY, {
      tenantType,
      tenantId,
      offset,
      end: offset + limit,
    });

    const totalPages = Math.ceil(total / limit);

    const stats = {
      total,
      page,
      totalPages,
      limit,
    };

    return { items, stats };
  } catch (error) {
    return { items: [], stats: { total: 0, page: 1, totalPages: 0 } };
  }
}

// Delete product
export async function deleteProduct(productId) {
  try {
    const result = await writeClient.delete(productId);
    return result;
  } catch (error) {
    throw error;
  }
}
// Update product
export async function updateProduct(productId, updateData) {
  try {
    const updates = {
      title: updateData.title,
      price: updateData.price !== undefined ? parseFloat(updateData.price) : undefined,
      quantity: updateData.quantity !== undefined ? parseFloat(updateData.quantity) : undefined,
      currency: updateData.currency || "SAR",
      weightUnit: updateData.weightUnit || "kg",
      updatedAt: new Date().toISOString(),
    };

    // Handle description update
    if (updateData.description !== undefined) {
      updates.description = updateData.description || "";
    }

    // Handle image update - accept Sanity image object directly
    if (updateData.image) {
      // If it's already a Sanity image object with asset reference, use it directly
       if (updateData.image.asset) {
        // Extract the asset ID. It could be in ._ref or ._id depending on if it's a raw ref or expanded asset
        const assetId = updateData.image.asset._ref || updateData.image.asset._id;
        
        if (assetId) {
          updates.image = {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: assetId,
            },
          };
        }
      }
    }

    const result = await writeClient.patch(productId).set(updates).commit();

    return result;
  } catch (error) {
    throw error;
  }
}

// Add offer to product
export async function addProductOffer(productId, offerData) {
  try {
    const updates = {
      hasOffer: true,
      offerType: offerData.offerType,
      offerValue: offerData.offerValue,
      offerStatus: offerData.offerStatus,
      offerActivatedAt: new Date().toISOString(),
    };

    const result = await writeClient.patch(productId).set(updates).commit();
    return result;
  } catch (error) {
    throw error;
  }
}

// Update product offer
export async function updateProductOffer(productId, offerData) {
  try {
    const updates = {
      offerType: offerData.offerType,
      offerValue: offerData.offerValue,
      offerStatus: offerData.offerStatus,
    };

    const result = await writeClient.patch(productId).set(updates).commit();
    return result;
  } catch (error) {
    throw error;
  }
}

// Remove product offer
export async function removeProductOffer(productId) {
  try {
    const result = await writeClient
      .patch(productId)
      .unset([
        "offerType",
        "offerValue",
        "offerStatus",
      ])
      .set({
        hasOffer: false,
        offerDeactivatedAt: new Date().toISOString(),
      })
      .commit();

    return result;
  } catch (error) {
    throw error;
  }
}

// Get products with active offers for public page
export async function getProductsWithActiveOffers() {
  try {
    const result = await writeClient.fetch(PRODUCTS_WITH_ACTIVE_OFFERS_QUERY);
    return result;
  } catch (error) {
    throw error;
  }
}

// Get products filtered by offer status for a tenant
export async function getProductsByOfferStatus(
  tenantType,
  tenantId,
  offerStatus,
  page = 1,
  limit = 6
) {
  try {
    if (!tenantType || !tenantId || !offerStatus)
      return { items: [], stats: { total: 0, page: 1, totalPages: 0 } };

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get total count first
    const total = await writeClient.fetch(
      PRODUCTS_COUNT_BY_OFFER_STATUS_QUERY,
      {
        tenantType,
        tenantId,
        offerStatus,
      }
    );

    // Get paginated items
    const items = await writeClient.fetch(PRODUCTS_BY_OFFER_STATUS_QUERY, {
      tenantType,
      tenantId,
      offerStatus,
      offset,
      end: offset + limit,
    });

    const totalPages = Math.ceil(total / limit);

    const stats = {
      total,
      page,
      totalPages,
      limit,
    };

    return { items, stats };
  } catch (error) {
    return { items: [], stats: { total: 0, page: 1, totalPages: 0 } };
  }
}

// Get all products with offers for a tenant (any status)
export async function getProductsWithOffers(
  tenantType,
  tenantId,
  page = 1,
  limit = 6
) {
  try {
    if (!tenantType || !tenantId)
      return { items: [], stats: { total: 0, page: 1, totalPages: 0 } };

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get total count first
    const total = await writeClient.fetch(PRODUCTS_WITH_OFFERS_COUNT_QUERY, {
      tenantType,
      tenantId,
    });

    // Get paginated items
    const items = await writeClient.fetch(
      PRODUCTS_WITH_OFFERS_BY_TENANT_QUERY,
      {
        tenantType,
        tenantId,
        offset,
        end: offset + limit,
      }
    );

    const totalPages = Math.ceil(total / limit);

    const stats = {
      total,
      page,
      totalPages,
      limit,
    };

    return { items, stats };
  } catch (error) {
    return { items: [], stats: { total: 0, page: 1, totalPages: 0 } };
  }
}

// Get products for viewing on detail pages based on viewer role
// Companies see supplier products, everyone else sees company products
export async function getProductsForViewing(
  viewerTenantType,
  targetTenantId,
  page = 1,
  limit = 6
) {
  try {
    if (!targetTenantId)
      return { items: [], stats: { total: 0, page: 1, totalPages: 0 } };

    // Determine which products to show based on viewer type
    // If viewer is a company, show supplier products
    // Otherwise (user, guest, supplier), show company products
    const productTenantType = viewerTenantType === "company" ? "supplier" : "company";

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get total count first
    const total = await writeClient.fetch(PRODUCTS_COUNT_BY_TENANT_QUERY, {
      tenantType: productTenantType,
      tenantId: targetTenantId,
    });

    // Get paginated items using Sanity's slice syntax
    const items = await writeClient.fetch(PRODUCTS_BY_TENANT_QUERY, {
      tenantType: productTenantType,
      tenantId: targetTenantId,
      offset,
      end: offset + limit,
    });

    const totalPages = Math.ceil(total / limit);

    const stats = {
      total,
      page,
      totalPages,
      limit,
    };

    return { items, stats };
  } catch (error) {
    return { items: [], stats: { total: 0, page: 1, totalPages: 0 } };
  }
}
