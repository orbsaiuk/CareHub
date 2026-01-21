export const structure = (S, context) => {
  // Define restricted users who can ONLY see Content Creator (comma-separated in env)
  const contentCreatorOnlyEmails = (
    process.env.NEXT_PUBLIC_CONTENT_CREATOR_EMAILS || ""
  )
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  // Define users who can access VIP section (comma-separated in env)
  const vipAccessEmails = (process.env.NEXT_PUBLIC_VIP_ACCESS_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const currentUserEmail = context.currentUser?.email;
  const isContentCreatorOnly =
    contentCreatorOnlyEmails.includes(currentUserEmail);
  const canAccessVip = vipAccessEmails.includes(currentUserEmail);

  // If user is content creator only, show only Content Creator section
  if (isContentCreatorOnly) {
    return S.list()
      .title("Content")
      .items([
        S.listItem()
          .title("Content Creator")
          .icon(() => "📝")
          .child(
            S.list()
              .title("Pages")
              .items([
                // Home Page
                S.listItem()
                  .title("Home Page")
                  .icon(() => "🏠")
                  .child(
                    S.document()
                      .schemaType("staticHomeContent")
                      .documentId("staticHomeContent")
                  ),
                // Tenant List Page
                S.listItem()
                  .title("Tenant List Page")
                  .icon(() => "📦")
                  .child(
                    S.document()
                      .schemaType("staticTenantListContent")
                      .documentId("staticTenantListContent")
                  ),
                // Offers Page
                S.listItem()
                  .title("Offers Page")
                  .icon(() => "🎁")
                  .child(
                    S.document()
                      .schemaType("staticOffersContent")
                      .documentId("staticOffersContent")
                  ),
                // Newsletter Page
                S.listItem()
                  .title("Newsletter Page")
                  .icon(() => "📰")
                  .child(
                    S.document()
                      .schemaType("staticNewsletterContent")
                      .documentId("staticNewsletterContent")
                  ),
                // Products Page
                S.listItem()
                  .title("Products Page")
                  .icon(() => "🛍️")
                  .child(
                    S.document()
                      .schemaType("staticProductsContent")
                      .documentId("staticProductsContent")
                  ),
                // Become Page
                S.listItem()
                  .title("Become Page")
                  .icon(() => "🚀")
                  .child(
                    S.document()
                      .schemaType("staticBecomeContent")
                      .documentId("staticBecomeContent")
                  ),
                // Onboarding Page
                S.listItem()
                  .title("Onboarding Page")
                  .icon(() => "👋")
                  .child(
                    S.document()
                      .schemaType("staticOnboardingContent")
                      .documentId("staticOnboardingContent")
                  ),
                // About Page
                S.listItem()
                  .title("About Page")
                  .child(
                    S.document()
                      .schemaType("staticAboutContent")
                      .documentId("staticAboutContent")
                  ),
                // Media Page
                S.listItem()
                  .title("Media Page")
                  .icon(() => "📺")
                  .child(
                    S.document()
                      .schemaType("staticMediaContent")
                      .documentId("staticMediaContent")
                  ),
                // Contact Page
                S.listItem()
                  .title("Contact Page")
                  .icon(() => "📞")
                  .child(
                    S.document()
                      .schemaType("staticContactContent")
                      .documentId("staticContactContent")
                  ),
                // Terms Page
                S.listItem()
                  .title("Terms of Use")
                  .icon(() => "📄")
                  .child(
                    S.document()
                      .schemaType("staticTermsContent")
                      .documentId("staticTermsContent")
                  ),
                // Privacy Page
                S.listItem()
                  .title("Privacy Policy")
                  .icon(() => "🔒")
                  .child(
                    S.document()
                      .schemaType("staticPrivacyContent")
                      .documentId("staticPrivacyContent")
                  ),
                // Cookies Page
                S.listItem()
                  .title("Cookies Policy")
                  .icon(() => "🍪")
                  .child(
                    S.document()
                      .schemaType("staticCookiesContent")
                      .documentId("staticCookiesContent")
                  ),
                // Footer
                S.listItem()
                  .title("Footer")
                  .icon(() => "⬇️")
                  .child(
                    S.document()
                      .schemaType("staticFooterContent")
                      .documentId("staticFooterContent")
                  ),
                // Blogs
                S.listItem()
                  .title("Blogs")
                  .icon(() => "📝")
                  .child(
                    S.documentList()
                      .title("Content Creator Blogs")
                      .filter("_type == 'contentCreatorBlog'")
                      .defaultOrdering([
                        { field: "_createdAt", direction: "desc" },
                      ])
                  ),
                S.divider(),
                // Newsletter
                S.listItem()
                  .title("Newsletter")
                  .icon(() => "📰")
                  .child(
                    S.list()
                      .title("Newsletter")
                      .items([
                        S.listItem()
                          .title("News Items")
                          .child(
                            S.list()
                              .title("News Items")
                              .items([
                                S.listItem()
                                  .title("Published")
                                  .child(
                                    S.documentList()
                                      .title("Published News Items")
                                      .filter(
                                        "_type == 'newsItem' && isPublished == true"
                                      )
                                      .defaultOrdering([
                                        { field: "order", direction: "asc" },
                                        { field: "publishedDate", direction: "desc" },
                                      ])
                                  ),
                                S.listItem()
                                  .title("Draft")
                                  .child(
                                    S.documentList()
                                      .title("Draft News Items")
                                      .filter(
                                        "_type == 'newsItem' && isPublished == false"
                                      )
                                      .defaultOrdering([
                                        { field: "publishedDate", direction: "desc" },
                                      ])
                                  ),
                                S.listItem()
                                  .title("All News Items")
                                  .child(
                                    S.documentList()
                                      .title("All News Items")
                                      .filter("_type == 'newsItem'")
                                      .defaultOrdering([
                                        { field: "order", direction: "asc" },
                                        { field: "publishedDate", direction: "desc" },
                                      ])
                                  ),
                                S.listItem()
                                  .title("Top News Banners")
                                  .icon(() => "📰")
                                  .child(
                                    S.documentList()
                                      .title("Top News Banners")
                                      .filter("_type == 'topNewsBanner'")
                                      .defaultOrdering([
                                        { field: "displayOrder", direction: "asc" },
                                      ])
                                  ),
                              ])
                          ),
                        S.listItem()
                          .title("Activities")
                          .child(
                            S.list()
                              .title("Newsletter Activities")
                              .items([
                                S.listItem()
                                  .title("Published")
                                  .child(
                                    S.documentList()
                                      .title("Published Activities")
                                      .filter(
                                        "_type == 'newsletterActivity' && isPublished == true"
                                      )
                                      .defaultOrdering([
                                        { field: "order", direction: "asc" },
                                        { field: "_createdAt", direction: "desc" },
                                      ])
                                  ),
                                S.listItem()
                                  .title("Draft")
                                  .child(
                                    S.documentList()
                                      .title("Draft Activities")
                                      .filter(
                                        "_type == 'newsletterActivity' && isPublished == false"
                                      )
                                      .defaultOrdering([
                                        { field: "_createdAt", direction: "desc" },
                                      ])
                                  ),
                                S.listItem()
                                  .title("All Activities")
                                  .child(
                                    S.documentList()
                                      .title("All Activities")
                                      .filter("_type == 'newsletterActivity'")
                                      .defaultOrdering([
                                        { field: "order", direction: "asc" },
                                        { field: "_createdAt", direction: "desc" },
                                      ])
                                  ),
                              ])
                          ),
                      ])
                  ),
              ])
          ),
      ]);
  }

  // All other users see everything
  return S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Events")
        .child(
          S.list()
            .title("Events")
            .items([
              S.listItem()
                .title("All Events")
                .child(
                  S.documentList()
                    .title("All Events")
                    .filter("_type == 'event'")
                    .defaultOrdering([
                      { field: "startDate", direction: "desc" },
                    ])
                ),
              S.listItem()
                .title("Planned")
                .child(
                  S.documentList()
                    .title("Planned Events")
                    .filter("_type == 'event' && status == 'planned'")
                    .defaultOrdering([{ field: "startDate", direction: "asc" }])
                ),
              S.listItem()
                .title("Confirmed")
                .child(
                  S.documentList()
                    .title("Confirmed Events")
                    .filter("_type == 'event' && status == 'confirmed'")
                    .defaultOrdering([{ field: "startDate", direction: "asc" }])
                ),
              S.listItem()
                .title("In Progress")
                .child(
                  S.documentList()
                    .title("In Progress Events")
                    .filter("_type == 'event' && status == 'in-progress'")
                    .defaultOrdering([{ field: "startDate", direction: "asc" }])
                ),
              S.listItem()
                .title("Completed")
                .child(
                  S.documentList()
                    .title("Completed Events")
                    .filter("_type == 'event' && status == 'completed'")
                    .defaultOrdering([
                      { field: "startDate", direction: "desc" },
                    ])
                ),
              S.listItem()
                .title("Cancelled")
                .child(
                  S.documentList()
                    .title("Cancelled Events")
                    .filter("_type == 'event' && status == 'cancelled'")
                    .defaultOrdering([
                      { field: "startDate", direction: "desc" },
                    ])
                ),
            ])
        ),
      S.listItem()
        .title("Order Requests")
        .child(
          S.documentList()
            .title("Order Requests")
            .filter("_type == 'orderRequest'")
        ),
      S.divider(),
      S.listItem()
        .title("Companies")
        .child(
          S.documentList().title("Companies").filter("_type == 'company'")
        ),
      S.listItem()
        .title("Suppliers")
        .child(
          S.documentList()
            .title("Suppliers")
            .filter("_type == 'supplier' && tenantType == 'supplier'")
        ),
      // VIP section - only visible to specific emails
      ...(canAccessVip
        ? [
          S.listItem()
            .title("VIP")
            .icon(() => "⭐")
            .child(
              S.list()
                .title("VIP Settings")
                .items([
                  S.listItem()
                    .title("VIP Companies")
                    .icon(() => "🏢")
                    .child(
                      S.document()
                        .schemaType("vipCompanies")
                        .documentId("vipCompanies")
                    ),
                  S.listItem()
                    .title("VIP Suppliers")
                    .icon(() => "📦")
                    .child(
                      S.document()
                        .schemaType("vipSuppliers")
                        .documentId("vipSuppliers")
                    ),
                ])
            ),
        ]
        : []),
      S.listItem()
        .title("Promotional Banners")
        .icon(() => "🎯")
        .child(
          S.documentList()
            .title("Promotional Banners")
            .filter("_type == 'promotionalBanner'")
            .defaultOrdering([{ field: "displayOrder", direction: "asc" }])
        ),
      S.listItem()
        .title("Offers")
        .child(
          S.list()
            .title("Offers")
            .items([
              S.listItem()
                .title("Company Offers")
                .child(
                  S.documentList()
                    .title("Company Offers")
                    .filter("_type == 'offers' && tenantType == 'company'")
                ),
              S.listItem()
                .title("Supplier Offers")
                .child(
                  S.documentList()
                    .title("Supplier Offers")
                    .filter("_type == 'offers' && tenantType == 'supplier'")
                ),
            ])
        ),
      S.listItem()
        .title("Offers Page")
        .icon(() => "🎁")
        .child(
          S.list()
            .title("Studio Offers")
            .items([
              S.listItem()
                .title("Company Offers")
                .child(
                  S.list()
                    .title("Company Offers")
                    .items([
                      S.listItem()
                        .title("Product Offers")
                        .child(
                          S.documentList()
                            .title("Company Product Offers")
                            .filter(
                              "_type == 'offersPage' && tenantType == 'company'"
                            )
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),
                      S.listItem()
                        .title("Discount Codes")
                        .child(
                          S.documentList()
                            .title("Company Discount Codes")
                            .filter(
                              "_type == 'discountCode' && tenantType == 'company'"
                            )
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),
                      S.listItem()
                        .title("Subbanners")
                        .child(
                          S.documentList()
                            .title("Company Subbanners")
                            .filter(
                              "_type == 'subbanner' && tenantType == 'company'"
                            )
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),
                    ])
                ),
              S.listItem()
                .title("Supplier Offers")
                .child(
                  S.list()
                    .title("Supplier Offers")
                    .items([
                      S.listItem()
                        .title("Product Offers")
                        .child(
                          S.documentList()
                            .title("Supplier Product Offers")
                            .filter(
                              "_type == 'offersPage' && tenantType == 'supplier'"
                            )
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),
                      S.listItem()
                        .title("Discount Codes")
                        .child(
                          S.documentList()
                            .title("Supplier Discount Codes")
                            .filter(
                              "_type == 'discountCode' && tenantType == 'supplier'"
                            )
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),
                      S.listItem()
                        .title("Subbanners")
                        .child(
                          S.documentList()
                            .title("Supplier Subbanners")
                            .filter(
                              "_type == 'subbanner' && tenantType == 'supplier'"
                            )
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),
                    ])
                ),
            ])
        ),

      S.listItem()
        .title("Blogs")
        .child(
          S.list()
            .title("Blogs")
            .items([
              S.listItem()
                .title("Pending Blogs")
                .child(
                  S.documentList()
                    .title("Pending Blogs")
                    .filter("_type == 'blog' && status == 'pending'")
                ),
              S.listItem()
                .title("Published Blogs")
                .child(
                  S.documentList()
                    .title("Published Blogs")
                    .filter("_type == 'blog' && status == 'published'")
                ),
              S.listItem()
                .title("Rejected Blogs")
                .child(
                  S.documentList()
                    .title("Rejected Blogs")
                    .filter("_type == 'blog' && status == 'rejected'")
                ),
            ])
        ),
      S.listItem()
        .title("Newsletter")
        .icon(() => "📰")
        .child(
          S.list()
            .title("Newsletter")
            .items([
              S.listItem()
                .title("News Items")
                .child(
                  S.list()
                    .title("News Items")
                    .items([
                      S.listItem()
                        .title("Published")
                        .child(
                          S.documentList()
                            .title("Published News Items")
                            .filter(
                              "_type == 'newsItem' && isPublished == true"
                            )
                            .defaultOrdering([
                              { field: "order", direction: "asc" },
                              { field: "publishedDate", direction: "desc" },
                            ])
                        ),
                      S.listItem()
                        .title("Draft")
                        .child(
                          S.documentList()
                            .title("Draft News Items")
                            .filter(
                              "_type == 'newsItem' && isPublished == false"
                            )
                            .defaultOrdering([
                              { field: "publishedDate", direction: "desc" },
                            ])
                        ),
                      S.listItem()
                        .title("All News Items")
                        .child(
                          S.documentList()
                            .title("All News Items")
                            .filter("_type == 'newsItem'")
                            .defaultOrdering([
                              { field: "order", direction: "asc" },
                              { field: "publishedDate", direction: "desc" },
                            ])
                        ),
                    ])
                ),
              S.listItem()
                .title("Activities")
                .child(
                  S.list()
                    .title("Newsletter Activities")
                    .items([
                      S.listItem()
                        .title("Published")
                        .child(
                          S.documentList()
                            .title("Published Activities")
                            .filter(
                              "_type == 'newsletterActivity' && isPublished == true"
                            )
                            .defaultOrdering([
                              { field: "order", direction: "asc" },
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),
                      S.listItem()
                        .title("Draft")
                        .child(
                          S.documentList()
                            .title("Draft Activities")
                            .filter(
                              "_type == 'newsletterActivity' && isPublished == false"
                            )
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),
                      S.listItem()
                        .title("All Activities")
                        .child(
                          S.documentList()
                            .title("All Activities")
                            .filter("_type == 'newsletterActivity'")
                            .defaultOrdering([
                              { field: "order", direction: "asc" },
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),
                    ])
                ),
              S.listItem()
                .title("Subscribers")
                .child(
                  S.list()
                    .title("Newsletter Subscribers")
                    .items([
                      S.listItem()
                        .title("Active Subscribers")
                        .child(
                          S.documentList()
                            .title("Active Subscribers")
                            .filter(
                              "_type == 'newsletterSubscriber' && isActive == true"
                            )
                            .defaultOrdering([
                              { field: "subscribedAt", direction: "desc" },
                            ])
                        ),
                      S.listItem()
                        .title("Inactive Subscribers")
                        .child(
                          S.documentList()
                            .title("Inactive Subscribers")
                            .filter(
                              "_type == 'newsletterSubscriber' && isActive == false"
                            )
                            .defaultOrdering([
                              { field: "unsubscribedAt", direction: "desc" },
                            ])
                        ),
                      S.listItem()
                        .title("All Subscribers")
                        .child(
                          S.documentList()
                            .title("All Subscribers")
                            .filter("_type == 'newsletterSubscriber'")
                            .defaultOrdering([
                              { field: "subscribedAt", direction: "desc" },
                            ])
                        ),
                    ])
                ),
              S.listItem()
                .title("Top News Banners")
                .icon(() => "📰")
                .child(
                  S.documentList()
                    .title("Top News Banners")
                    .filter("_type == 'topNewsBanner'")
                    .defaultOrdering([
                      { field: "displayOrder", direction: "asc" },
                    ])
                ),
            ])
        ),
      S.listItem()
        .title("Products")
        .child(
          S.list()
            .title("Products")
            .items([
              S.listItem()
                .title("Company Products")
                .child(
                  S.documentList()
                    .title("Company Products")
                    .filter("_type == 'product' && tenantType == 'company'")
                ),
              S.listItem()
                .title("Supplier Products")
                .child(
                  S.documentList()
                    .title("Supplier Products")
                    .filter("_type == 'product' && tenantType == 'supplier'")
                ),
            ])
        ),
      S.divider(),
      S.listItem()
        .title("Content Creator")
        .icon(() => "📝")
        .child(
          S.list()
            .title("Pages")
            .items([
              // Home Page
              S.listItem()
                .title("Home Page")
                .icon(() => "🏠")
                .child(
                  S.document()
                    .schemaType("staticHomeContent")
                    .documentId("staticHomeContent")
                ),
              // Tenant List Page
              S.listItem()
                .title("Tenant List Page")
                .icon(() => "📦")
                .child(
                  S.document()
                    .schemaType("staticTenantListContent")
                    .documentId("staticTenantListContent")
                ),
              // Offers Page
              S.listItem()
                .title("Offers Page")
                .icon(() => "🎁")
                .child(
                  S.document()
                    .schemaType("staticOffersContent")
                    .documentId("staticOffersContent")
                ),
              // Newsletter Page
              S.listItem()
                .title("Newsletter Page")
                .icon(() => "📰")
                .child(
                  S.document()
                    .schemaType("staticNewsletterContent")
                    .documentId("staticNewsletterContent")
                ),
              // Products Page
              S.listItem()
                .title("Products Page")
                .icon(() => "🛍️")
                .child(
                  S.document()
                    .schemaType("staticProductsContent")
                    .documentId("staticProductsContent")
                ),
              // Become Page
              S.listItem()
                .title("Become Page")
                .icon(() => "🚀")
                .child(
                  S.document()
                    .schemaType("staticBecomeContent")
                    .documentId("staticBecomeContent")
                ),
              // Onboarding Page
              S.listItem()
                .title("Onboarding Page")
                .icon(() => "👋")
                .child(
                  S.document()
                    .schemaType("staticOnboardingContent")
                    .documentId("staticOnboardingContent")
                ),
              // About Page
              S.listItem()
                .title("About Page")
                .child(
                  S.document()
                    .schemaType("staticAboutContent")
                    .documentId("staticAboutContent")
                ),
              // Media Page
              S.listItem()
                .title("Media Page")
                .icon(() => "📺")
                .child(
                  S.document()
                    .schemaType("staticMediaContent")
                    .documentId("staticMediaContent")
                ),
              // Contact Page
              S.listItem()
                .title("Contact Page")
                .icon(() => "📞")
                .child(
                  S.document()
                    .schemaType("staticContactContent")
                    .documentId("staticContactContent")
                ),
              // Terms Page
              S.listItem()
                .title("Terms of Use")
                .icon(() => "📄")
                .child(
                  S.document()
                    .schemaType("staticTermsContent")
                    .documentId("staticTermsContent")
                ),
              // Privacy Page
              S.listItem()
                .title("Privacy Policy")
                .icon(() => "🔒")
                .child(
                  S.document()
                    .schemaType("staticPrivacyContent")
                    .documentId("staticPrivacyContent")
                ),
              // Cookies Page
              S.listItem()
                .title("Cookies Policy")
                .icon(() => "🍪")
                .child(
                  S.document()
                    .schemaType("staticCookiesContent")
                    .documentId("staticCookiesContent")
                ),
              // Footer
              S.listItem()
                .title("Footer")
                .icon(() => "⬇️")
                .child(
                  S.document()
                    .schemaType("staticFooterContent")
                    .documentId("staticFooterContent")
                ),
              // Blogs
              S.listItem()
                .title("Blogs")
                .icon(() => "📝")
                .child(
                  S.documentList()
                    .title("Content Creator Blogs")
                    .filter("_type == 'contentCreatorBlog'")
                    .defaultOrdering([
                      { field: "_createdAt", direction: "desc" },
                    ])
                ),
            ])
        ),
      S.divider(),
      S.documentTypeListItem("category"),
      S.documentTypeListItem("businessType"),
      // Messaging
      S.listItem()
        .title("Messaging")
        .child(
          S.list()
            .title("Messaging")
            .items([
              S.listItem()
                .title("Conversations")
                .child(
                  S.documentList()
                    .title("Conversations")
                    .filter("_type == 'conversation'")
                    .defaultOrdering([
                      { field: "createdAt", direction: "desc" },
                    ])
                    .child((conversationId) =>
                      S.documentList()
                        .title("Messages")
                        .filter(
                          "_type == 'message' && references($conversationId)"
                        )
                        .params({ conversationId })
                        .defaultOrdering([
                          { field: "createdAt", direction: "asc" },
                        ])
                    )
                ),
              S.listItem()
                .title("All Messages")
                .child(
                  S.documentList()
                    .title("All Messages")
                    .filter("_type == 'message'")
                    .defaultOrdering([
                      { field: "createdAt", direction: "desc" },
                    ])
                ),
            ])
        ),
      S.listItem()
        .title("Company Reviews")
        .child(
          S.list()
            .title("Company Reviews")
            .items([
              S.listItem()
                .title("Company Reviews")
                .child(
                  S.documentList()
                    .title("Company Reviews")
                    .filter("_type == 'review' && tenantType == 'company'")
                ),
            ])
        ),
      S.listItem()
        .title("Supplier Reviews")
        .child(
          S.list()
            .title("Supplier Reviews")
            .items([
              S.listItem()
                .title("Supplier Reviews")
                .child(
                  S.documentList()
                    .title("Supplier Reviews")
                    .filter("_type == 'review' && tenantType == 'supplier'")
                ),
            ])
        ),
      S.listItem()
        .title("User Reviews")
        .child(
          S.list()
            .title("User Reviews")
            .items([
              S.listItem()
                .title("User Reviews")
                .child(
                  S.documentList()
                    .title("User Reviews")
                    .filter("_type == 'review' && tenantType == 'user'")
                ),
            ])
        ),
      S.divider(),
      S.documentTypeListItem("user"),
      S.listItem()
        .title("Billing")
        .child(
          S.list()
            .title("Billing")
            .items([
              S.listItem()
                .title("Plans")
                .child(
                  S.documentList()
                    .title("Plans")
                    .filter("_type == 'plan'")
                    .defaultOrdering([{ field: "order", direction: "asc" }])
                ),
              S.listItem()
                .title("Subscriptions")
                .child(
                  S.documentList()
                    .title("Subscriptions")
                    .filter("_type == 'subscription'")
                    .defaultOrdering([
                      { field: "startDate", direction: "desc" },
                    ])
                ),
              S.listItem()
                .title("Payments")
                .child(
                  S.documentList()
                    .title("Payments")
                    .filter("_type == 'payment'")
                    .defaultOrdering([
                      { field: "transactionDate", direction: "desc" },
                    ])
                ),
            ])
        ),
      S.listItem()
        .title("Tenant Requests")
        .child(
          S.documentList()
            .title("Tenant Requests")
            .filter("_type == 'tenantRequest'")
        ),
    ]);
};
