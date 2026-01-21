import { urlFor } from "@/sanity/lib/image";

/**
 * Get image URL from CMS with fallback to public folder
 * @param {Object} cmsImage - Sanity image object
 * @param {string} fallbackPath - Path to fallback image in public folder
 * @param {Object} options - Image transformation options (width, height, quality, etc.)
 * @returns {string} Image URL
 */
export function getImageUrl(cmsImage, fallbackPath, options = {}) {
    if (cmsImage?.asset?.url) {
        return cmsImage.asset.url;
    }

    if (cmsImage?.asset?._ref || cmsImage?.asset?._id) {
        try {
            let imageBuilder = urlFor(cmsImage);

            if (options.width) imageBuilder = imageBuilder.width(options.width);
            if (options.height) imageBuilder = imageBuilder.height(options.height);
            if (options.quality) imageBuilder = imageBuilder.quality(options.quality);
            if (options.fit) imageBuilder = imageBuilder.fit(options.fit);
            if (options.format) imageBuilder = imageBuilder.format(options.format);

            return imageBuilder.url();
        } catch (error) {
            console.error("Error building image URL:", error);
            return fallbackPath;
        }
    }

    return fallbackPath;
}

/**
 * Get responsive image URLs for srcset
 * @param {Object} cmsImage - Sanity image object
 * @param {string} fallbackPath - Path to fallback image
 * @param {Array<number>} widths - Array of widths for responsive images
 * @returns {string} srcset string
 */
export function getResponsiveImageSrcSet(
    cmsImage,
    fallbackPath,
    widths = [640, 768, 1024, 1280, 1536]
) {
    if (!cmsImage?.asset) {
        return "";
    }

    try {
        return widths
            .map((width) => {
                const url = getImageUrl(cmsImage, fallbackPath, { width });
                return `${url} ${width}w`;
            })
            .join(", ");
    } catch (error) {
        console.error("Error building responsive srcset:", error);
        return "";
    }
}

/**
 * Get file URL from CMS
 * @param {Object} cmsFile - Sanity file object
 * @param {string} fallbackPath - Path to fallback file
 * @returns {string} File URL
 */
export function getFileUrl(cmsFile, fallbackPath) {
    if (cmsFile?.asset?.url) {
        return cmsFile.asset.url;
    }
    return fallbackPath;
}

/**
 * Get LQIP (Low Quality Image Placeholder) from Sanity image
 * @param {Object} cmsImage - Sanity image object
 * @returns {string|null} LQIP base64 string or null
 */
export function getLQIP(cmsImage) {
    return cmsImage?.asset?.metadata?.lqip || null;
}

/**
 * Get image dimensions from Sanity image
 * @param {Object} cmsImage - Sanity image object
 * @returns {Object|null} Object with width and height or null
 */
export function getImageDimensions(cmsImage) {
    const dimensions = cmsImage?.asset?.metadata?.dimensions;
    if (dimensions) {
        return {
            width: dimensions.width,
            height: dimensions.height,
            aspectRatio: dimensions.aspectRatio,
        };
    }
    return null;
}
