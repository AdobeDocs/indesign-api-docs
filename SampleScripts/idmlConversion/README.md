# IDML Export Capability

This project provides a script (`idml.idjs`) and its corresponding manifest (`manifest.json`) to enable exporting InDesign documents to IDML format using Adobe InDesign's UXP scripting capabilities using InDesign APIs.

## Features

- Opens an InDesign document from a specified path.
- Updates document links to ensure all assets are up-to-date.
- Exports the document to IDML format.
- Logs processing steps and performance metrics.
- Handles errors and warnings during the export process.

## File Structure

- **`idml.idjs`**: The main script that implements the IDML export functionality.
- **`manifest.json`**: The manifest file that defines the capability and its integration with Adobe InDesign and InDesign Services.

## Execution

1. Place the `idml.idjs` script and `manifest.json` in the appropriate folder parallelly.
2. You need to create a capability bundle, which is a ZIP file with a specific structure. The files should be zipped directly without a parent folder.

```
Archive.zip  
|------ manifest.json  
|------ idml.idjs
```
3. Follow this [guide](https://developer.adobe.com/firefly-services/docs/indesign-apis/how-tos/working-with-capabilities-api/) to Register your script

4. Provide the required parameters to run the script:

```json
{
	"assets": [
		{
			"source": {
				"type": "HTTP_GET",
				"url": "<YOUR_URL>"
			},
			"destination": "sample.indd"
		}
	],
	"params": {
		"targetDocument": "sample.indd",
		"outputPath": "converted.idml"
	}
}
```

## Logging
The script logs processing steps and performance metrics to a log file (LogFile.txt) in the working directory. Logs include:

- Time taken to open the document.
- Time taken to update links.
- Time taken to balance ragged lines.

## Error Handling
The script captures and logs errors during execution. Common errors include:

- Missing or invalid document paths.
- Issues with updating links.
- Processing failures.