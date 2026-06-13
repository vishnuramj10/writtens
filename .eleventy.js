const Asciidoctor = require("asciidoctor");
const asciidoctor = Asciidoctor();

module.exports = function (eleventyConfig) {
  // AsciiDoc support
  eleventyConfig.addTemplateFormats("adoc");
  eleventyConfig.addExtension("adoc", {
    read: true,
    compile: async function (inputContent) {
      return async () => {
        const doc = asciidoctor.load(inputContent, {
          safe: "safe",
          attributes: { showtitle: false },
        });
        return doc.convert();
      };
    },
  });

  // Custom collection: all .adoc files under articles/, newest first
  eleventyConfig.addCollection("articles", function (api) {
    return api
      .getAll()
      .filter(
        (item) =>
          item.inputPath.includes("/articles/") &&
          item.inputPath.endsWith(".adoc")
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  eleventyConfig.addPassthroughCopy("src/css");

  // Filters
  eleventyConfig.addFilter("dateFormat", function (date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  eleventyConfig.addFilter("dateISO", function (date) {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("readingTime", function (content) {
    if (!content) return "1 min read";
    const words = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).length;
    const mins = Math.ceil(words / 200);
    return `${mins} min read`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
