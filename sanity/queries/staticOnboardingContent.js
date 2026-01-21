import { COMPANY_CARD_PROJECTION } from "./companies";
import { SUPPLIER_CARD_PROJECTION } from "./suppliers";

export const STATIC_ONBOARDING_CONTENT_QUERY = `
*[_type == "staticOnboardingContent"][0]{
  _id,
  _type,
  pageTitle,
  pageDescription,
  statisticsTitle,
  statisticsSubtitle,
  companiesTitle,
  companiesSubtitle,
  trustedCompanies[]->${COMPANY_CARD_PROJECTION},
  suppliersTitle,
  suppliersSubtitle,
  trustedSuppliers[]->${SUPPLIER_CARD_PROJECTION},
  supplierFeatures{
    title,
    subtitle,
    features[]{
      title,
      description,
      icon{
        asset->{
          _id,
          url
        }
      }
    }
  },
  companyFeatures{
    title,
    subtitle,
    features[]{
      title,
      description,
      icon{
        asset->{
          _id,
          url
        }
      }
    }
  }
}`;
