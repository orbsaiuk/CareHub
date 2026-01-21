export const STATIC_CONTACT_CONTENT_QUERY = `
*[_type == "staticContactContent"][0]{
  _id,
  _type,
  pageTitle,
  pageDescription,
  
  contactInfo{
    sectionTitle,
    phones,
    email,
    address,
    workingHours,
    weekendHours,
  },
  
  formSection{
    nameLabel,
    phoneLabel,
    whatsappLabel,
    emailLabel,
    companyLabel,
    messageLabel,
    submitButtonText,
    successMessage,
    errorMessage,
  },
}`;
