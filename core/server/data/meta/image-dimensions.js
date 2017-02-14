var getCachedImageSizeFromUrl = require('../../utils/cached-image-size-from-url'),
    Promise                   = require('bluebird'),
    _                         = require('lodash');

/**
 * Get Image dimensions
 * @param {object} metaData
 * @returns {object} metaData
 * @description for image properties in meta data (coverImage, authorImage and blog.logo), `getCachedImageSizeFromUrl` is
 * called to receive image width and height
 */
function getImageDimensions(metaData) {
    var fetch = {
            coverImage: getCachedImageSizeFromUrl(metaData.coverImage.url),
            authorImage: getCachedImageSizeFromUrl(metaData.authorImage.url),
            logo: getCachedImageSizeFromUrl(metaData.blog.logo.url)
        };

    return Promise.props(fetch).then(function (resolve) {
        var imageObj = {};

        imageObj = {
            coverImage: resolve.coverImage,
            authorImage: resolve.authorImage,
            logo: resolve.logo
        };

        _.forEach(imageObj, function (key, value) {
            if (_.has(key, 'width') && _.has(key, 'height')) {
                // We have some restrictions for publisher.logo:
                // The image needs to be <=600px wide and <=60px high (ideally exactly 600px x 60px).
                // Unless we have proper image-handling (see https://github.com/TryGhost/Ghost/issues/4453),
                // we will not output an ImageObject if the logo doesn't fit in the dimensions.
                if (value === 'logo') {
                    if (key.height <= 60 && key.width <= 600) {
                        _.assign(metaData.blog[value], {
                            dimensions: {
                                width: key.width,
                                height: key.height
                            }
                        });
                    }
                } else {
                    _.assign(metaData[value], {
                        dimensions: {
                            width: key.width,
                            height: key.height
                        }
                    });
                }
            }
        });

        return metaData;
    });
}

module.exports = getImageDimensions;
