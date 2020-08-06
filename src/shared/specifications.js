const article = {
  required: ["title", "imgLink", "link", "eventDate", "caption"],
  options: ["price", "rating", "type"],
};

const custom = {
  required: ["title"],
  options: [
    "imgLink",
    "link",
    "icon",
    "color",
    "count",
    "price",
    "eventDate",
    "caption",
    "rating",
    "type",
  ],
};

const testimonial = {
  required: ["title"],
  options: [
    "imgLink",
    "link",
    "caption",
    "reviewerOcc",
    "reviewerAddress",
    "review",
    "reviewer",
    "type",
  ],
};

module.exports = {
  article,
  custom,
  testimonial,
};
