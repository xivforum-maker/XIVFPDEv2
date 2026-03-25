export const siteConfig = {
  name: "XIV FPDE",
  fullName: "XIV Forum of Partial Differential Equations",
  dates: "14 – 18 September 2026",
  location: "Będlewo Conference Center, Poland",
  contactEmail: "xivforum@impan.pl",
  lastUpdate: "March 2026",
  copyright: "2026 XIV Forum of Partial Differential Equations",
  
  // Layout & UI
  navLinks: [
    { name: 'Home', href: '/' },
    { name: 'Registration', href: '/registration' },
    { name: 'Participants', href: '/participants' },
    { name: 'Programme', href: '/program' },
    { name: 'Scientific Committee', href: '/scientific' },
    { name: 'Organizing Committee', href: '/organization' },
  ],
  
  // Registration Fees
  fees: {
    regular: {
      pln: 2200,
      eur: 520
    },
    reduced: {
      pln: 1600,
      eur: 380
    }
  },

  // Deadlines
  deadlines: {
    registration: "TBA",
    abstracts: "TBA"
  },
  conferenceStartDate: "2026-09-14T09:00:00",
  conferenceStartDateString: "14 September 2026, 9:00",

  payment: {
    bankName: "Bank Gospodarstwa Krajowego",
    bankAddress: "Al. Jerozolimskie 7, 00-955 Warszawa, Poland",
    ibanEur: "PL 80 1130 1017 0020 1467 1520 0008",
    ibanPln: "PL 48 1130 1017 0020 1467 1520 0002",
    swift: "GOSKPLPW",
    accountHolder: "Ośrodek Badawczo-Konferencyjny IMPAN w Będlewie",
    transferDescription: "FORUM PDE + name of the participant"
  },

  // Google Sheets Data
  links: {
    registrationForm: "https://docs.google.com/forms/d/e/1FAIpQLSe-atxfF1fm6vXikSZhwWYcNRTVmS7zP1JEjtskxzIcEIqgAA/viewform?usp=header",
    abstractSubmission: "https://docs.google.com/forms/d/e/1FAIpQLSduwu2knI4b5rp9Smi4iNHGQgHP5o-giGyg3KN_gCNWGB-D4A/viewform?usp=header",
    map: "https://www.google.com/maps/place/Pa%C5%82ac+Potockich+B%C4%99dlewo/@52.2357476,16.7268353,17z/data=!4m9!3m8!1s0x47044cfea71ce475:0x981c4c654fa2c08c!5m2!4m1!1i2!8m2!3d52.2357443!4d16.7294102!16s%2Fg%2F121qyrzx?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D",
  },
  relatedEvents: [
    {
      name: "Probability and Analysis 2026",
      date: "11 – 15 May 2026, Będlewo",
      url: "https://panda2026.pwr.edu.pl/"
    },
    {
      name: "New trends in elliptic PDEs",
      date: "13 – 17 July 2026, Będlewo",
      url: "https://sites.google.com/impan.pl/ntepde2026"
    },
    {
      name: "SOMACHI",
      date: "7 – 12 September 2026, Wrocław",
      url: "http://somachi-ptm.pwr.edu.pl/"
    }
  ],
  sheets: {
    participants: {
      id: "1VffiImOEmeS45pU_LhfasbGLAAkNoK3ASsNCB64V1K4",
      gid: "1757362562"
    },
    schedule: {
      id: "1qzXcSyGqvO82RKZHYP4ongcIbIbkXkHhNWaZ2FAbb6k",
      gid: "293368709",
      range: "A:F"
    }
  }
};
