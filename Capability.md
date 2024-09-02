# General Workflow For exposing your own API
The typical workflow involves making one or more calls. 
There are 4 steps in the typical workflow which are described in detail in below sections:

## 1. Create a capability Bundle
A capability bundle is a simple zip file with a pre-defined structure. 

### 1.1 Capability Bundle Structure
A simple structure for a capability bundle would look like the following:
```
capability-folder
|------ manifest.json
|------ capability.js
```
| File          | Description                                                                                                                                                                                                                                                                  | Optional |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| manifest.json | This is the capability manifest. All the relevant details about the capability are described here.                                                                                                                                                                           | No       |
| capability.js | This is the primary executable for the capability. This script gets executed by the product script engine. Depending on the product script engine support, this can depend on other files as well. These additional files can also be in nested directories in the zip file. | No       |

### 1.2 Capability Manifest Structure

The manifest file is a plain JSON file with the following structure:
```json
{
    "manifestVersion": "1.0.0",
    "id": "Unique id for the capability",
    "name": "Name of the capability",
    "version": "0.0.1",
    "host": {
        "app": "indesign",
        "minVersion": "17.0.0",
        "maxVersion": "99.9.9"
    },
    "apiEntryPoints": [
        {
            "type": "capability",
            "path": "capability.js",
            "language": "extendscript"
        }
    ]
}
```
The description of all the fields of the manifest.json file is available below:

| Field           | Type                        | Description                                                                                                                                                                                 | Optional |
|-----------------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| manifestVersion | string                      | The version of the manifest file format. Currently, only 1.0.0 is supported.                                                                                                                | No       |
| name            | string                      | Name of the capability. The capability can be invoked using this. It should be between 4-255 characters. Must not have any white space.                                                     | No       |
| version         | string                      | The version number of the capability in x.y.z format. The version must be three segments and each version component must be between 0 and 99.                                               | No       |
| host.app        | string                      | The host application would be used to execute this capability. Currently, the only valid value is indesign.                                                                                     | No       |
| host.minVersion | string                      | Minimum required version of the host app (in x.y format) that can run this plugin. The version number must be two segments. Typically, the minor segment will be always set to 0, e.g. 17.0 | No       |
| host.maxVersion | string                      | The maximum version of the host app that can run this plugin. Same formatting as host.minVersion.                                                                                           | Yes      |
| apiEntryPoints  | array<EntryPointDefinition> | Describes the API entry points for the capability. See the next section for details.                                                                                                        | Yes      |

The apiEntryPoints field is an array of objects matching the EntryPointDefinition format specified below. 
There can be only one entry of each type in the array. 
The size of the array is at most 3. 
An entry point specifies a capability script or a capability specification. 
There is no need to define an entry point if the default values are being used for them.

| Field    | Type   | Description                                                                                                                                                                               | Optional |
|----------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| type     | string | The type of entry point. Valid values are capability	                                                                                                                                     | No       |
| path     | string | The file path should be used based on the type. The default is to look for the files in the root directory of the zip file. However, this can be any nested path as well in the zip file. | 	No      |
| language | string | The language of the script. It can be extend script, UXP script or javascript.                                                                                                                                                               | Yes      | 


## 2. Post a Capability Bundle
This script requires making a call to submission endpoint to upload the capability bundle zip. 
Refer the [Code samples](samples.md) and [API Spec](https://adobedocs.github.io/indesign-api-docs/#/default/post_api_v2_capability) for more details on API. 

On success the API will return a unique REST endpoint in the response. This unique endpoint can be subsequently used to make execution requests.

Posting the capability is typically an one-time operation, unless any updates are required. 
The capability bundle can be updated by incrementing the version in capability manifest. 
The updated ZIP bundle can be uploaded using the submission endpoint.

## 3. Initiate an execution request
Using the unique URL obtained in Step-2 an execution request can be made. 
Each execution request is an Async operation for which the status can be fetched using the status API. 
More details are available in [Code samples](samples.md) and [API Spec](https://adobedocs.github.io/indesign-api-docs/#/default/post_api_v2_capability__product___organization___capability_)

All assets specified in the execution request are downloaded on the local file system using the specified identifiers. 
The capability script should be authored to work against locally downloaded assets.

A parameter block in form of a JSON dictionary can be provided in the execution request. 
The parameters are defined by the capability and are passed as is to the capability during execution. 
Optionally an upload location can also be provided as part of execution request. 
All generated output are uploaded to the provided target location. 
In case no location is provided, then the generated output assets are uploaded to a temporary storage. 
A link with expiry is provided in the execution status.   

## 4. Check for status of execution request
The platform provides status on execution in form of events. Each event corresponds to different stages of execution. 
Currently, these events are available by polling the status API.
The status API url is available in the response of execution request.

The json structure of all the events is available in the [API Spec](https://adobedocs.github.io/indesign-api-docs/)

| Event Name                | Description                                            |
|---------------------------|--------------------------------------------------------|
| not_started                    | Generated at the time of creation of job               |
| running                   | Generated while execution is going on at app-engine    |
| succeeded                 | Generated when execution of a capability is complete   |
| failed                    | Generated if capability execution fails                |

In future the execution events will also be available to a configured web-hook. 

[Back to home page](README.md)
