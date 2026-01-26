export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      // Health Section
      S.listItem()
        .title('Health')
        .child(
          S.list()
            .title('Health Management')
            .items([
              S.documentTypeListItem('doctor').title('Doctors'),
              S.documentTypeListItem('facility').title('Facilities'),
              S.documentTypeListItem('specialty').title('Specialties'),
              S.documentTypeListItem('appointment').title('Appointments'),
            ])
        ),

      S.divider(),
      S.documentTypeListItem('promotionalBanner').title('Promotional Banners'),
        

    ]);
