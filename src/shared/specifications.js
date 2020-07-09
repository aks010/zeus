const article = {
  required: ["title", "imgLink", "link", "eventDate", "caption", "type"],
  options: ["price", "rating"],
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
    "type",
  ],
};

module.exports = {
  article,
  custom,
};
