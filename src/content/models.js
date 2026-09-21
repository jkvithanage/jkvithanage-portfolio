/**
 * @typedef {object} TextContent
 * @property {"text"} type
 * @property {string} content
 */

/**
 * @typedef {object} LinkContent
 * @property {"link"} type
 * @property {string} content
 * @property {string} href
 * @property {string} label
 */

/** @typedef {TextContent | LinkContent} InlineContent */
/** @typedef {InlineContent[]} ContentLine */

/**
 * @typedef {object} Organization
 * @property {string} name
 * @property {string} [href]
 * @property {string} [label]
 */

/**
 * @typedef {object} WorkExperience
 * @property {Organization} organization
 * @property {string} title
 * @property {string} dates
 * @property {ContentLine[]} description
 */

/** @typedef {WorkExperience} Education */

/** @typedef {"myCashFlow" | "portfolio" | "portfolioPageSpeed" | "invoicePortal" | "astrolog"} ProjectImageAsset */

/**
 * @typedef {object} ProjectImage
 * @property {ProjectImageAsset} asset
 * @property {string} alt
 */

/**
 * @typedef {object} ProjectPreview
 * @property {string} href
 * @property {string} label
 */

/**
 * @typedef {object} ProjectLinkAction
 * @property {"link"} type
 * @property {string} label
 * @property {string} href
 * @property {string} ariaLabel
 */

/**
 * @typedef {object} ProjectDisabledAction
 * @property {"disabled"} type
 * @property {string} label
 */

/** @typedef {ProjectLinkAction | ProjectDisabledAction} ProjectAction */

/**
 * @typedef {object} Project
 * @property {string} title
 * @property {string} summary
 * @property {InlineContent[]} description
 * @property {ProjectImage} image
 * @property {ProjectImage} [additionalImage]
 * @property {ProjectPreview} preview
 * @property {string[]} tags
 * @property {ProjectAction[]} actions
 */

export {};
