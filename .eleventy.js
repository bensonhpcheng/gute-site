module.exports = function(eleventyConfig) {
  // Pass static assets through unchanged
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("google-apps-script");
  eleventyConfig.addPassthroughCopy("CNAME"); // Required for GitHub Pages custom domain

  // Watch CSS and JS for changes during dev
  eleventyConfig.addWatchTarget("css/");
  eleventyConfig.addWatchTarget("js/");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    // Only process .njk and .md — old .html files are excluded via .eleventyignore
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
