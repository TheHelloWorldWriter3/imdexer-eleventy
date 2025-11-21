/**
 * Copyright 2024-2025 The Hello World Writer (https://www.thehelloworldwriter.com/). All rights reserved.
 * See LICENSE in the project root for license information.
 * @author TechAurelian <dev@techaurelian.com> (https://techaurelian.com)
 */

// @ts-check

import { addImageShortcode } from "./src/image-shortcode.js";
import { addImageUrlFilter } from "./src/image-filter.js";

/**
 * @typedef {Object} ImageShortcodeOptions
 * @property {string} imgShortcode The name of the image shortcode.
 * @property {string} imgUrlFilter The name of the image URL filter.
 * @property {Array} zones The array of image zones.
 */

/**
 * Adds the specified image shortcode to Eleventy.
 * 
 * @param {Object} eleventyConfig The Eleventy configuration object.
 * @param {ImageShortcodeOptions} options The options for the image shortcode.
 */
export default function (eleventyConfig, options) {
  // TODO: Validate options

  if (options.imgShortcode) {
    addImageShortcode(eleventyConfig, options.imgShortcode, options.zones);
  }

  if (options.imgUrlFilter) {
    addImageUrlFilter(eleventyConfig, options.imgUrlFilter, options.zones);
  }
};