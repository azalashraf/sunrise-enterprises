# Sunrise Enterprises — Product Catalogue & Showcase Website

## Folder Structure
```text
sunrise-enterprises/
├── assets/
│   └── images/
│       ├── logo/
│       │   ├── sunrise-logo.svg
│       │   └── sunrise-logo-white.svg
│       └── catalogue/
│           ├── lab-library-construction/
│           ├── laboratory-equipment/
│           ├── laboratory-chemicals/
│           ├── writing-boards/
│           ├── notice-boards/
│           ├── school-college-furniture/
│           ├── office-furniture/
│           ├── conference-tables/
│           ├── office-tables/
│           ├── chairs/
│           ├── student-desks-benches/
│           └── institutional-supplies/
├── config/
│   ├── products-data.js
│   └── site-config.js
├── css/
│   └── style.css
├── js/
│   └── main.js
├── index.html
└── README.md
```

## How to Update Client Contact Details
Open `config/site-config.js` and edit the `contact` object:
- `phoneDisplay`: e.g. `"+91 98765 43210"`
- `phoneDial`: e.g. `"+919876543210"`
- `whatsappDisplay`: e.g. `"+91 98765 43210"`
- `whatsappNumber`: e.g. `"919876543210"`
- `email`: e.g. `"info@sunriseenterprises.com"`
- `address`: Full business address

## How to Add the Client's 30 Photographs per Category
Inside `assets/images/catalogue/<category-folder>/`, drop 30 photographs named `1.jpg` through `30.jpg`.
Any photo slot not yet uploaded will automatically display a clean, numbered Sunrise Enterprises SVG placeholder so the website never shows broken images.
