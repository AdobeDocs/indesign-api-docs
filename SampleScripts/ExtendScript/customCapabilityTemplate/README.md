# Custom Capability Template

Minimal ExtendScript template for **InDesign Server** capabilities: add logic in `capabilityLogic.jsx` and keep standard parameter handling, logging, timings, and errors.

## InDesign Server scripting

Server runs headless—**do not rely on `app.activeDocument` or creating documents without a file path**. Open the job document with `app.open(File(...))` using a path relative to `workingFolder` (this template does that via `params.targetDocument`).

For the object model (`Application`, `Document`, `app.open`, etc.), see the ExtendScript API reference, e.g. [InDesign Server 14 Application / object model](https://www.indesignjs.de/extendscriptAPI/indesign-server14/#Application.html).

## Quick start

1. **Required input:** `params.targetDocument` — relative path to the `.indd` under `workingFolder`. The template opens it, relinks, collects warnings, then runs your logic.

2. **Implement your logic** in `capabilityLogic.jsx` inside `CAPABILITY.run`:
   - `document` — opened document
   - `parameters` — `params` from the job
   - `allParameters` — full job input (`workingFolder`, `params`, …)
   - `returnVal` — populate for `processedData`

3. **Run** the capability with JSON containing `workingFolder` and `params`.

## Files

| File | Purpose |
|------|--------|
| `sample.jsx` | Entry: open document from `targetDocument`, then `CAPABILITY.run`. |
| `capabilityLogic.jsx` | **Edit here** — your capability inside `CAPABILITY.run()`. |
| `errors.jsx`, `json2.jsx`, `utils.jsx` | Shared helpers (same pattern as other samples). |
| `manifest.json` | Capability manifest. |

## Example: save to output path

In `capabilityLogic.jsx`:

```javascript
var outputPath = UTILS.GetStringFromObject(parameters, 'outputPath')
outputPath = UTILS.GetFullPath(outputPath)
document.save(File(outputPath))
UTILS.AddAssetToBeUploaded(UTILS.GetRelativeReturnPath(outputPath))
returnVal.outputPath = outputPath
```

## Input shape

```json
{
  "workingFolder": "/path/to/working/folder",
  "params": {
    "targetDocument": "doc.indd",
    "outputPath": "out/result.indd"
  }
}
```

If your capability only produces new files (no input `.indd`), you still need a document open on Server—use a small template `.indd` as `targetDocument` or extend the template to open a specific starter file your job provides.
