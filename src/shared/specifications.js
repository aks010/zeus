const Article = {
  required: ["title", "imgLink", "link", "eventDate", "caption", "type"],
  options: ["price", "rating"],
};

const Custom = {
  required: ["title", "imgLink", "link", "eventDate", "caption", "type"],
  options: ["price", "rating"],
};

module.exports = {
  Article,
  Custom,
};
