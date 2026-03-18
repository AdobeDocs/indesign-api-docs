/*************************************************************************
 * YOUR CAPABILITY LOGIC — implement here.
 *
 * The platform injects JSON via app.scriptArgs.get('parameters'). The
 * template (sample.jsx) parses it, sets UTILS.workingFolder, then calls
 * runCapability(parameters, context).
 *
 * Available from UTILS (do not remove utils.jsx):
 *   UTILS.Log('message')                    — log line (also LogFile.txt)
 *   UTILS.GetFullPath('relative/path')      — path under working folder
 *   UTILS.GetRelativeReturnPath(fullPath)   — for AddAssetToBeUploaded
 *   UTILS.AddAssetToBeUploaded('rel/path')  — register file for upload
 *   UTILS.RaiseException(Errors.SomeKey)    — fail with structured error
 *   UTILS.GetStringFromObject(obj, 'key')   — read required string param
 *   UTILS.UpdateDocumentLinks(document)     — refresh out-of-date links
 *
 * Return value: plain object → written to response JSON (dataURL).
 * Throw or UTILS.RaiseException on failure.
 *************************************************************************/

/* globals app, Errors, File, SaveOptions, UTILS */

/**
 * Implement your capability here.
 *
 * @param {Object} parameters — same object as API request "params" (plus any keys you define).
 * @param {Object} context — jobId, workingFolder, setActiveDocument(doc).
 *   If you open a document, call context.setActiveDocument(doc) so the template closes it and collects link/font warnings.
 * @returns {Object} — merged into API response payload (e.g. { myResult: true }).
 */
function runCapability (parameters, context) {
  UTILS.Log('runCapability started')
  UTILS.Log('jobId: ' + context.jobId)

  // --- Example: require a param (remove or replace with your params) ---
  // var target = UTILS.GetStringFromObject(parameters, 'targetDocument')
  // var docPath = UTILS.GetFullPath(target)
  // var doc = app.open(File(docPath))
  // try {
  //   UTILS.UpdateDocumentLinks(doc)
  //   // ... your automation ...
  //   var outRel = 'output/result.pdf'
  //   var outFull = UTILS.GetFullPath(outRel)
  //   // doc.exportFile(..., File(outFull))
  //   UTILS.AddAssetToBeUploaded(outRel)
  //   return { exported: outRel, note: 'Replace this with your real outputs.' }
  // } finally {
  //   if (doc && doc.isValid) {
  //     doc.close(SaveOptions.NO)
  //   }
  // }

  return {
    template: true,
    message: 'Edit capabilityLogic.jsx — implement runCapability(). See README in this folder.'
  }
}
