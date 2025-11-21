/**
 * Copyright 2024-2025 The Hello World Writer (https://www.thehelloworldwriter.com/). All rights reserved.
 * See LICENSE in the project root for license information.
 * @author TechAurelian <dev@techaurelian.com> (https://techaurelian.com)
 */

// @ts-check

/**
 * Joins two paths using the POSIX path separator, ensuring that there is only one separator
 * between them.
 * 
 * @param {string} path1 The first path.
 * @param {string} path2 The second path.
 * @returns {string} The joined path.
 */
export function joinPosixPath(path1, path2) {
  if (!path1 || !path2) return path1 + path2;
  return path1.replace(/\/$/, '') + '/' + path2.replace(/^\//, '');
};

/**
 * Gets the image data for the specified image source based on the available zones.
 * 
 * @param {string} src The source of the image.
 * @param {Array} zones The array of image zones.
 * @returns {Object} The image data object containing the image source, imdexer, and base URL.
 */
export function getImageData(src, zones) {

  // If there is only one entry in the zones array, return its data
  if (zones.length === 1) {
    return {
      imageSrc: src, // There should be no prefix to remove
      imdexer: zones[0].imdexer,
      baseUrl: zones[0].baseUrl,
    }
  }

  // Otherwise, find the zone that matches the image source based on the prefix, and return its data
  for (const zone of zones) {
    if (src.startsWith(zone.prefix)) {
      return {
        imageSrc: src.slice(zone.prefix.length), // Remove the prefix from the image source
        imdexer: zone.imdexer,
        baseUrl: zone.baseUrl,
      }
    }
  }

  // If no zone matches the image source, throw an error
  throw new Error(`No zone found for image: ${src}`);
}

