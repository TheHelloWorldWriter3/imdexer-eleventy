/**
 * Copyright 2024-2025 The Hello World Writer (https://www.thehelloworldwriter.com/). All rights reserved.
 * See LICENSE in the project root for license information.
 * @author TechAurelian <dev@techaurelian.com> (https://techaurelian.com)
 */

// @ts-check

import { PACKAGE_NAME } from './consts.js';
import { joinPosixPath, getImageData } from './utils.js';

/**
 * Adds the specified image shortcode to Eleventy.
 * 
 * @param {object} eleventyConfig The Eleventy configuration object.
 * @param {string} shortcodeName The name of the shortcode.
 * @param {Array} zones The array of image zones.
 */
export function addImageShortcode(eleventyConfig, shortcodeName, zones) {

  /**
   * Returns the content for the image shortcode, which is a HTML image tag with attributes
   * computed from the provided arguments.
   * @param {object} args The arguments for the shortcode.
   * @returns {string} The HTML image tag.
   */
  const imageShortcode = function (args) {

    // Get the image data based on the optional prefix and available zones
    const data = getImageData(args.src, zones);

    // Generate and return the HTML image tag
    return generateImageTag({ alt: args.alt, baseUrl: data.baseUrl, classAttr: args.class, imdexer: data.imdexer, lazy: args.lazy, sizes: args.sizes, src: data.imageSrc, defaultImageWidth: args.defaultImageWidth });
  };

  // Add the shortcode to Eleventy
  eleventyConfig.addShortcode(shortcodeName, imageShortcode);
}

/**
 * @typedef {Object} ImageTagOptions
 * @property {string} alt The alt attribute for the image.
 * @property {string} baseUrl The base URL for the images.
 * @property {string} classAttr The class attribute for the image.
 * @property {number} defaultImageWidth The width of the default image to use for the src attribute.
 * @property {Object} imdexer The imdexer object containing data for the images.
 * @property {boolean} lazy Whether to use lazy loading for the image.
 * @property {string} sizes The sizes attribute for the image.
 * @property {string} src The source of the image.
 */

/**
 * Generates an image tag for the specified image.
 *
 * @param {ImageTagOptions} options The options for the image tag. 
 * @returns {string} The HTML image tag.
 */
function generateImageTag({ alt, baseUrl, classAttr, defaultImageWidth, imdexer, lazy = true, sizes = 'auto', src }) {

  if (!imdexer) {
    throw new Error(`${PACKAGE_NAME} requires an imdexer object.`);
  }

  // Check if alt text is provided. This is required for accessibility.
  // For decorative images, use an empty string for the alt attribute.
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` attribute for image: ${src}`);
  }

  if (!src) {
    throw new Error(`Missing \`src\` attribute for image: ${src}`);
  }

  // Get the image data from the imdexer
  const data = imdexer[src];
  if (!data) {
    throw new Error(`Missing image data for image: ${src}`);
  }

  // If this is a single (non-grouped) image, return a simple image tag
  if (!data.files) {
    // Get the image size from the image data
    const width = data.width;
    const height = data.height;

    // Correctly join the base URL and the image source
    const fullSrc = joinPosixPath(baseUrl, src);

    // Add the lazy loading attribute if it's set to true
    const loadingAttr = lazy ? 'loading="lazy"' : '';

    // Return the image tag
    return `<img ${loadingAttr} width="${width}" height="${height}" src="${fullSrc}" ${classAttr ? `class="${classAttr}"` : ''} alt="${alt}" />`;
  }

  // If we are here, this is a grouped image, so let's generate a responsive image tag

  // Generate the srcset attribute
  const srcset = Object.keys(data.files).map(file => {
    const fullSrc = joinPosixPath(baseUrl, file);
    return `${fullSrc} ${data.files[file].width}w`;
  }).join(', ');

  // If defaultImageWidth is provided, find the image with that width
  let defaultImageRecord;
  if (defaultImageWidth) {
    defaultImageRecord = Object.entries(data.files).find(([_, value]) => value.width === defaultImageWidth);
    if (!defaultImageRecord) {
      throw new Error(`No image found with width ${defaultImageWidth} for image: ${src}`);
    }
  } else {
    // Otherwise, find the largest image based on the width
    defaultImageRecord = Object.entries(data.files).reduce((a, b) => a[1].width > b[1].width ? a : b);
  }

  // Get the full source of the default image
  const defaultImage = joinPosixPath(baseUrl, defaultImageRecord[0]);

  // Get the width and height of the default image
  const width = defaultImageRecord[1].width;
  const height = defaultImageRecord[1].height;

  // Add the lazy loading attribute if it's set to true
  const loadingAttr = lazy ? 'loading="lazy"' : '';

  // Return the image tag with all the responsive image attributes
  return `<img ${loadingAttr} sizes="${sizes}" width="${width}" height="${height}" srcset="${srcset}" src="${defaultImage}" ${classAttr ? `class="${classAttr}"` : ''} alt="${alt}" />`;
}
