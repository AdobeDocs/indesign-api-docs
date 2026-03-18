# Custom capability template (ExtendScript)

Use this folder as a **starting point** for InDesign API / InDesign Server custom capabilities. Boilerplate is already wired:

| Concern | Where it lives |
|--------|----------------|
| Parse `parameters`, `workingFolder`, `jobID` | `sample.jsx` (do not need to edit) |
| Logging + `LogFile.txt` upload | `utils.jsx` — use `UTILS.Log(...)` |
| Paths under job working directory | `UTILS.GetFullPath('relative/path')` |
| Register outputs for upload | `UTILS.AddAssetToBeUploaded('relative/path')` |
| Log file (`LogFile.txt`) | Always added for upload in **success and failure** so you can inspect what happened. |
| Structured validation errors | `UTILS.RaiseException(Errors.MissingKey, 'paramName')` |
| Success / failure JSON for the platform | `sample.jsx` → `GetSuccessReturnObj` / `HandleError` |

## What you edit

**Primary file: `capabilityLogic.jsx`**

Implement `runCapability(parameters, context)`:

- **`parameters`** — Your API `params` object (define any keys you need).
- **`context`** — `{ jobId, workingFolder, setActiveDocument(doc) }`.
  - If you call `context.setActiveDocument(myDoc)` after opening a document, the template will **close that document** in `finally` and can attach **missing link / font warnings** to the response.

Return a **plain object**; it is included in the job response JSON (via `dataURL`).

On failure, throw or call `UTILS.RaiseException(...)`.

## Optional changes

| File | When |
|------|------|
| `manifest.json` | Change `id` (UUID), `name` (capability name), `version` for each deploy. |
| `errors.jsx` | Add your own `Errors.YourError` entries for clear messages. |
| `sample.jsx` | Only if you need different global app preferences or extra lifecycle hooks. |

## Zip layout (required)

Files must be at the **root** of the zip (no parent folder):

```
MyCapability.zip
├── manifest.json
├── sample.jsx
├── capabilityLogic.jsx
├── utils.jsx
├── errors.jsx
└── json2.jsx
```

Submit the zip per [Working with Capabilities API](https://developer.adobe.com/firefly-services/docs/indesign-apis/how-tos/working-with-capabilities-api/).

## Example API request body

After deployment, call your capability URL with a body like:

```json
{
  "assets": [
    {
      "source": {
        "url": "https://your-storage/presigned-get",
        "storageType": "Azure"
      },
      "destination": "input.indd"
    }
  ],
  "params": {
    "targetDocument": "input.indd",
    "yourCustomParam": "value"
  }
}
```

Paths in `params` are **relative to the job working folder** (where assets are placed). Use only relative paths; `..` and absolute paths are rejected by `UTILS.GetFullPath`.

## Quick checklist

1. Implement `runCapability` in `capabilityLogic.jsx`.
2. For every file the caller should download, call `UTILS.AddAssetToBeUploaded('path/under/working/folder')`.
3. Update `manifest.json` (`id`, `name`, `version`).
4. Zip the six files at root → upload → call your capability endpoint.

## Support

- [InDesign APIs overview](https://developer.adobe.com/firefly-services/docs/indesign-apis/)
- Main repo [README](../../../README.md) (custom script input/output contract)
