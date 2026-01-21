// Email configuration
export {
    getUserSupportEmail,
    getNewsMediaEmail,
    getAdsEmail,
    getSalesSubscriptionEmail,
    getAdminApprovalEmail,
    getEmailByTaskType,
    EMAIL_CONFIG,
} from "./config";

// Admin utilities
export { getAdminEmails, sendEmailToAdmins } from "./admin";

// Order request emails
export {
    sendOrderRequestConfirmationToCustomer,
    sendOrderRequestApprovalEmail,
    sendOrderRequestRejectionEmail,
    sendOrderRequestNotificationToCompany,
    sendOrderRequestResponseToCustomer,
} from "./orderRequests";
