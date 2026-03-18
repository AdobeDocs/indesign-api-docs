/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2026 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/

// capabilityLogic.jsx
// Add your capability logic here. This is the only file you need to edit.
// InDesign Server: the document is always opened from params.targetDocument before this runs.
//
// - document: InDesign document (already open)
// - parameters: allParameters.params (or allParameters.input.params)
// - allParameters: full job input (workingFolder, params, etc.)
// - returnVal: object to fill with your result; will be returned as processedData

var CAPABILITY = {}

/**
 * Implement your capability here.
 * Add properties to returnVal to return data (e.g. returnVal.outputPath = path).
 * Use UTILS.GetStringFromObject(parameters, 'key'), UTILS.GetFullPath(path), etc.
 * Use UTILS.AddAssetToBeUploaded(path) to upload output files.
 */
CAPABILITY.run = function (document, parameters, allParameters, returnVal) {
  // ========== ADD YOUR CAPABILITY LOGIC BELOW ==========

  UTILS.Log('Custom capability: no logic implemented yet.')
  
  // Example (uncomment and adjust for your case):
  // var outputPath = UTILS.GetStringFromObject(parameters, 'outputPath')
  // outputPath = UTILS.GetFullPath(outputPath)
  UTILS.Log('outputPathYayyyyy: ')
  app.open(File("/input.inddc"))
  UTILS.Log('document openedYayyyyy')
  // UTILS.AddAssetToBeUploaded(UTILS.GetRelativeReturnPath(outputPath))
  // returnVal.outputPath = outputPath

  // ========== ADD YOUR CAPABILITY LOGIC ABOVE ==========
}
