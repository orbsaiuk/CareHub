export default {
  name: "newsletterSubscriber",
  title: "Newsletter Subscribers",
  type: "document",
  icon: () => "📧",
  fields: [
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .email()
          .custom((email) => {
            // Additional email validation
            if (!email) return true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email) || "Invalid email format";
          }),
    },
    {
      name: "isActive",
      title: "Active Subscription",
      type: "boolean",
      description: "Whether this subscriber is currently active",
      initialValue: true,
    },
    {
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
      description: "Date and time when the user subscribed",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "unsubscribedAt",
      title: "Unsubscribed At",
      type: "datetime",
      description: "Date and time when the user unsubscribed (if applicable)",
    },
  ],
  preview: {
    select: {
      email: "email",
      isActive: "isActive",
      subscribedAt: "subscribedAt",
    },
    prepare({ email, isActive, subscribedAt }) {
      const status = isActive ? "✓ Active" : "✗ Inactive";
      const date = subscribedAt
        ? new Date(subscribedAt).toLocaleDateString("ar-EG")
        : "";
      return {
        title: email,
        subtitle: `${status}${date ? ` - ${date}` : ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Most Recent First",
      name: "subscribedAtDesc",
      by: [{ field: "subscribedAt", direction: "desc" }],
    },
    {
      title: "Email A-Z",
      name: "emailAsc",
      by: [{ field: "email", direction: "asc" }],
    },
  ],
};
