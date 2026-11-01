/**
 * SUNRISE ENTERPRISES - SITE & CONTACT CONFIGURATION
 * File: config/site-config.js
 */

window.SITE_CONFIG = {
  companyName: "Sunrise Enterprises",
  businessType: "Educational Infrastructure, Institutional Supplies and Equipment Supplier",
  heroHeading: "Complete Solutions for Schools, Colleges & Institutions",
  heroDescription:
    "Your trusted partner for educational infrastructure, laboratory equipment, institutional furniture and complete institutional supply solutions.",

  // Central Contact Placeholders (Update here once when client provides details)
  contact: {
    phoneDisplay: "[CLIENT PHONE NUMBER]",
    phoneDial: "", // Example: "+919876543210"
    whatsappDisplay: "[CLIENT WHATSAPP NUMBER]",
    whatsappNumber: "", // Example: "919876543210" (country code + number, no + or spaces)
    email: "[CLIENT EMAIL ADDRESS]",
    address: "[CLIENT BUSINESS ADDRESS]",
    mapsUrl: "#contact", // Replace with Google Maps share link
    mapsEmbedSrc: "" // Paste Google Maps iframe src URL when provided
  },

  // Revolving Image Settings (30 Images per Category)
  carousel: {
    imagesPerCategory: 30,
    autoSlideMs: 2600, // Revolves automatically every 2.6 seconds
    baseImagePath: "assets/images/catalogue",
    imageExtension: "jpg" // Looks for 1.jpg to 30.jpg inside each category folder
  }
};
