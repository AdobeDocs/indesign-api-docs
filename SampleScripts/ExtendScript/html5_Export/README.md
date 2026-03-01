# HTML5 Export Capability (ExtendScript)

This directory contains an ExtendScript implementation for exporting InDesign documents to HTML5 format. This is the ExtendScript version of the HTML5 export capability.

## Directory Contents

```
Example/
├── manifest.json       # Capability manifest file
├── sample.jsx         # Main script implementation
├── utils.jsx          # Utility functions
├── errors.jsx         # Error handling definitions
└── json2.jsx          # JSON parsing utilities
```

## Files Description

### 1. `manifest.json`
The manifest file defines the capability configuration: 
- Implements an ExtendScript capability entry point
- Version: 1.0.1

### 2. `sample.jsx`
The main script file that implements the HTML5 export functionality. Features include:
- InDesign document to HTML5 export
- Document link management and relinking
- HTML5 export preferences configuration (text format, font copying)
- UCF (Universal Container Format) packaging
- Asset handling and processing
- Performance monitoring
- Comprehensive error handling
- Logging capabilities

### 3. Helper Files
- `utils.jsx`: Contains utility functions for document processing and logging
- `errors.jsx`: Defines error types and messages for consistent error handling
- `json2.jsx`: Provides JSON parsing and manipulation utilities

## Prerequisites

- Adobe InDesign 
- ExtendScript environment
- Access to InDesign Services
- Appropriate file system permissions

## Installation

1. Create a capability bundle (ZIP file) containing all JSX files:
   ```
   Archive.zip  
   ├── manifest.json  
   ├── sample.jsx
   ├── utils.jsx
   ├── errors.jsx
   └── json2.jsx
   ```
   Note: All files must be zipped directly without a parent folder.

2. Register your script following the [InDesign Capabilities API guide](https://developer.adobe.com/firefly-services/docs/indesign-apis/how-tos/working-with-capabilities-api/)

## Usage

### Required Parameters

Provide the following JSON parameters to run the script:

```json
{
    "assets": [
        {
            "source": {
                "url": "<YOUR_URL>"
            },
            "destination": "sample.indd"
        }
    ],
    "params": {
        "targetDocument": "sample.indd",
        "outputPath": "html5Output"
    }
}
```

### Parameter Details
- `targetDocument`: Input InDesign document path (`.indd` file)
- `outputPath`: Output path for HTML5 export. The script will create a folder structure containing HTML, CSS, JS, images, and other assets. The output is also packaged as a UCF (`.ucf`) file.

### HTML5 Export Configuration

The script configures HTML5 export with the following settings:
- **Text Export Format**: `SVG_TAG` - Exports text as SVG elements (`<text>`, `<tspan>`) to preserve exact typography and positioning
- **Copy Fonts**: `false` - Fonts are not copied to the output folder (fonts are not copied when using SVG_TAG format)

**Note**: To use semantic HTML elements (`<p>`, `<h1>`, etc.) for better accessibility and SEO, you can modify the script to use `TextExportFormatEnum.HTML_TAG` instead of `SVG_TAG`.

### Output Files

The HTML5 export creates:
1. **HTML5 Folder**: A folder containing all exported files (HTML, CSS, JavaScript, images, etc.)
2. **UCF File**: A packaged Universal Container Format file (`.ucf`) containing the entire HTML5 export for easy distribution

## Logging and Monitoring

### Log File
The script generates detailed logs in `LogFile.txt` including:
- Document processing steps
- HTML5 export progress
- Link relinking status
- Asset processing status
- Performance metrics
- Error messages and warnings
- Missing links and fonts information

### Performance Metrics
The script tracks timing for:
- Document opening time
- Link relinking duration
- HTML5 export duration
- Document closing time
- Total execution time

All timing information is included in the returned data object.

## Error Handling

The script includes comprehensive error handling for various scenarios:
- Parameter validation errors
- Document processing errors
- HTML5 export failures
- Link relinking issues
- Asset handling issues
- File system operations
- Missing fonts and links (captured as warnings)

Each error includes:
- Error code
- Detailed error message
- Context information

### Warnings

The script captures and reports warnings for:
- Missing links
- Missing fonts
- Other document warnings

These are included in the response data and do not cause the export to fail.

## Support

For additional information and support:
- Refer to the [Adobe InDesign APIs documentation](https://developer.adobe.com/firefly-services/docs/indesign-apis/)
- Check the error messages in the log file for troubleshooting
- Ensure all prerequisites are met before running the script
