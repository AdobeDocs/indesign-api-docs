# Balance Ragged Lines Capability

This project provides a script (`balanceRaggedLines.jsx`) and its corresponding manifest (`manifest.json`) to enable or disable balancing ragged lines in text frames within Adobe InDesign documents using ExtendScript.

## Features

- Opens an InDesign document from a specified path.
- Identifies text frames based on provided labels.
- Balances or unbalances ragged lines for paragraphs in the identified text frames.
- Logs processing steps and performance metrics.
- Handles errors and warnings during the process.

## File Structure

- **`balanceRaggedLines.jsx`**: The main script that implements the balancing functionality.
- **`manifest.json`**: The manifest file that defines the capability and its integration with Adobe InDesign.

## Execution

1. Place the `balanceRaggedLines.jsx` script and `manifest.json` in the appropriate folder parallelly.
2. Create a capability bundle, which is a ZIP file with a specific structure. The files should be zipped directly without a parent folder.
```
Archive.zip  
|------ manifest.json  
|------ balanceRaggedLines.jsx  
```
3. Follow this [guide](https://developer.adobe.com/firefly-services/docs/indesign-apis/how-tos/working-with-capabilities-api/) to register your script.

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
		"outputPath": "balanced.indd",
		"labels": ["MainPara","Heading"], // If no Labels are provided, this script will balance ragged lines or unbalance ragged lines all of the text frames in the document.
		"balance": "true" //Can be "balance":false as well.
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
