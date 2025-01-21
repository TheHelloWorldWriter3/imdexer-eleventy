/**
 * Copyright 2024-2025 Hellogramming (https://www.hellogramming.com/). All rights reserved.
 * See LICENSE in the project root for license information.
 * @author TechAurelian <dev@techaurelian.com> (https://techaurelian.com)
 */

// @ts-check

import { joinPosixPath, getImageData } from './utils.js';

/**
 * Adds the specified imageUrl filter to Eleventy.
 * 
 * @param {object} eleventyConfig The Eleventy configuration object.
 * @param {string} filterName The name of the filter.
 * @param {Array} zones The array of image zones.
 */
export function addImageUrlFilter(eleventyConfig, filterName, zones) {
  /**
   * Returns the image URL with the correct path for the provided image source.
   * 
   * If the image source is a grouped image, the URL for the largest image in the group is returned.
   * 
   * @param {string} src The image source.
   * @returns {string} The image URL.
   */
  const imageUrl = function(src) {
    // Get the image data based on the available zones
    const data = getImageData(src, zones);

    // Get the image data from the imdexer
    const imdexerImageData = data.imdexer[data.imageSrc];
    if (!imdexerImageData) {
      throw new Error(`Missing image data for image: ${data.imageSrc}`);
    }

    // If this is a single (non-grouped) image, return the image URL
    if (!imdexerImageData.files) {
      return joinPosixPath(data.baseUrl, data.imageSrc);
    }
    
    // If we are here, this is a grouped image, so return the image URL for the largest image in the group
    const largestImageRecord = Object.entries(imdexerImageData.files).reduce((a, b) => a[1].width > b[1].width ? a : b);
    return joinPosixPath(data.baseUrl, largestImageRecord[0]);
  };

  // Add the filter to Eleventy
  eleventyConfig.addFilter(filterName, imageUrl);
}
