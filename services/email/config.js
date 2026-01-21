/**
 * Email Configuration Service
 * Centralized email address management for different tasks
 */

/**
 * Get email address for user support inquiries
 * @returns {string} User support email
 */
export function getUserSupportEmail() {
    return process.env.EMAIL_USER_SUPPORT || "info@dateshub.net";
}

/**
 * Get email address for news and media inquiries
 * @returns {string} News & media email
 */
export function getNewsMediaEmail() {
    return process.env.EMAIL_NEWS_MEDIA || "news@dateshub.net";
}
/**
 * Get email address for advertisements and marketing
 * @returns {string} Ads email
 */
export function getAdsEmail() {
    return process.env.EMAIL_ADS || "ads@dateshub.net";
}

/**
 * Get email address for sales and subscription management
 * @returns {string} Sales subscription email
 */
export function getSalesSubscriptionEmail() {
    return process.env.EMAIL_SALES_SUBSCRIPTION || "sales@dateshub.net";
}

/**
 * Get email address for admin approval notifications (registration, tenant requests)
 * @returns {string} Admin approval email
 */
export function getAdminApprovalEmail() {
    return process.env.EMAIL_ADMIN_APPROVAL || "admin@dateshub.net";
}



/**
 * Get email address based on task type
 * @param {string} taskType - Type of task: 'support', 'news', 'ads', 'sales', 'admin'
 * @returns {string} Email address for the task
 */
export function getEmailByTaskType(taskType) {
    switch (taskType) {
        case "support":
            return getUserSupportEmail();
        case "news":
        case "media":
            return getNewsMediaEmail();
        case "ads":
            return getAdsEmail();
        case "sales":
            return getSalesSubscriptionEmail();
        case "admin":
        case "approval":
            return getAdminApprovalEmail();
        default:
            return getUserSupportEmail(); // Default to support
    }
}
/**
 * Email configuration map for easy reference
 */
export const EMAIL_CONFIG = {
    USER_SUPPORT: getUserSupportEmail,
    NEWS_MEDIA: getNewsMediaEmail,
    ADS: getAdsEmail,
    SALES_SUBSCRIPTION: getSalesSubscriptionEmail,
    ADMIN_APPROVAL: getAdminApprovalEmail,
};
