# InDesign API migration - Private Beta to Public Beta

 
## New Endpoints for capabilities

All our capabilities have followed a change in their URL endpoints and have additional header requirements in their request bodies. These are:

-   All rendition APIs from Private Beta (PDF, PNG, JPEG) have been merged into one create-rendition endpoint, and an additional parameter of \'OutputType\' has been added to the request body.
-   The new endpoints no longer include the keywords \'api\', \'capability\', and \'indesign\'.
-   The engine version has been moved from the URL endpoint into the header.

<table style="background-color:White;">
    <tbody>
        <tr>
            <th>Capability</th>
            <th>V1 Endpoints</th>
            <th>V3 Endpoints</th>
        </tr>
        <tr>
            <td>Create PDF Rendition</td>
            <td>/api/v1/capability/indesign/rendition/pdf</td>
            <td>/v3/create-rendition</td>
        </tr>
        <tr>
            <td>Create PNG Rendition</td>
            <td>/api/v1/capability/indesign/rendition/png</td>
            <td>/v3/create-rendition</td>
        </tr>
        <tr>
            <td>Create JPEG Rendition</td>
            <td>/api/v1/capability/indesign/rendition/jpeg</td>
            <td>/v3/create-rendition</td>
        </tr>
        <tr>
            <td>Data Merge</td>
            <td>/api/v1/capability/indesign/dataMerge/merge</td>
            <td>/v3/merge-data</td>
        </tr>
        <tr>
            <td>Data Merge Tags</td>
            <td>/api/v1/capability/indesign/dataMerge/tags</td>
            <td>/v3/merge-data-tags</td>
        </tr>
        <tr>
            <td>Status Check</td>
            <td>/api/v1/capability/status/{id}</td>
            <td>/v3/status/{id}</td>
        </tr>
        <tr>
            <td>Submit Capability</td>
            <td>/api/v2/capability</td>
            <td>/v3/capability</td>
        </tr>
        <tr>
            <td>Custom Capability execution Request</td>
            <td>/api/v2/capability/{product}/{organisation}/{capability-name}</td>
            <td>/v3/{organisation}/{capability-name}</td>
        </tr>
        <tr>
    </tbody>
</table>


## New Input and Output asset format

The v3 asset format has replaced the v1 parameter \"type\" with \"storageType\". The allowed value for \"storageType\" is an optional string that signifies where the asset is uploaded (Azure/Dropbox/AWS).

<table style="background-color:White;">
    <tbody>
        <tr>
            <th>V1 Assets</th>
            <th>V3 Assets</th>
        </tr>
        <tr>
            <td><pre>
            {
	            “source”: { 
		            “url”: "String which is a pre-sigend URL.",
                    “type”: "HTTP_GET",
                    headers: {
                        }
	            }
                “destination”: "String"   // unchanged
            }
            </pre>
            </td>
            <td><pre>
            {
                “source”: {
                    “url”: "String which is a pre-sigend URL.",
                    “storageType”: Optional string which can be one of “Azure” or “Dropbox or "AWS"”
                }
                “destination”: string   // unchanged
            }
            </pre>
            </td>
        </tr>
    </tbody>
</table>
 

## New capability response

The V3 status api doesn\'t require pagination of the events in the status api response unless output count is high. Therefore, the two status capabilities from V1 have been merged to create one in the status api in V3. Please refer to the next section for more details.

<table style="background-color:White;">
    <tbody>
        <tr>
            <th>V1 Api response</th>
            <th>V3 Api response</th>
        </tr>
        <tr>
            <td><pre>
            {
                "statusUrls": {
                        "latest": "https://indesign.adobe.io/api/v1/capability/status/{jobId}",
                        "all": "https://indesign.adobe.io/api/v1/capability/status/all/{jobId}"
                },
                "id": "Guid unique to this asynchronous request"
            }
            </pre>
            </td>
            <td><pre>
            { 
                "jobId": "Guid unique to this asynchronous request", 
                "statusUrl": "https://indesign.adobe.io/v3/status/{jobId}" 
            }
            </pre>
            </td>
        </tr>
    </tbody>
</table>

 

## Changes in InDesign APIs \'status\' capability

-   The V1 status api had two versions: **/api/v1/capability/status/{id}** and **/api/v1/capability/status/all/{id}**. These two have been merged into one in the v3 release: **/v3/status/{id}**
-   The V1 status api returns the latest 10 events in paginated form along with the nextURL and prevURL, which present the status URLs for the previous and next page, whereas in the new release of the InDesign APIs there is no pagination and only one event (the current event going on) is returned in the response instead of all the events.
-   The changes in the response of new release are:
    -   Only the current status will be returned, and there will be no list of events. 
    -   Removed streaming of status events
    -   Only 4 status types or event codes will be returned:
        not-started, running, completed and failed. All URLs and data will be returned in the final completed event only.


<table style="background-color:White;">
    <tbody>
        <tr>
            <th>V1 Api response</th>
            <th>V3 Api response</th>
        </tr>
        <tr>
            <td><pre>
            .
            .,
            {
                "eventId":"EVENT1_ID",
                "id":"Job ID",
                "timestamp":"EPOCH TIME",
                "state":"ASSETS_DOWNLOAD_STARTED"
            },
            {
                "eventId":"EVENT2_ID",
                "id":"Job ID",
                "timestamp":"EPOCH TIME",
                "state":"QUEUED"
            },
            .
            .
            .
            </pre>
            </td>
            <td><pre>
            {
                "jobId":"JOB_ID",
                "timestamp":"ISO FORMAT timestamp",
                "status":"not_started"
            }
            </pre>
            </td>
        </tr>
    </tbody>
</table>


-   Get status response in case of errors has changed as follows:

<table style="background-color:White;">
    <tbody>
        <tr>
            <th>V1 Api response</th>
            <th>V3 Api response</th>
        </tr>
        <tr>
            <td><pre>
            {
                "id": Guid unique to this asynchronous request,
                "eventId": "6a9c2298-4c84-4c31-b1a4-156632bc50f1",
                "timestamp": 1718882999971,
                "state": "FAILED",
                "data": {
                    "reason": "Failed to download the asset(s)",
                    "code": "500"
                }
            }  
            </pre>
            </td>
            <td><pre>
            {
                "status": "failed",
                "jobId": Guid unique to this asynchronous request,
                “error_code”: “download_failed”,
                “message”: “Failed to download the asset(s)"
            }
            </pre>
            </td>
        </tr>
    </tbody>
</table>

 
## Error Codes 

-   Error codes have been changed from numerical values to short strings

<table style="background-color:White;">
    <tbody>
        <tr>
            <th>V1 Error Codes</th>
            <th>V3 Error Codes</th>
        </tr>
        <tr>
            <td><pre>
            {
                "message": "Job Id ${id} not found",
                "errorCode": 404
            }
            </pre>
            </td>
            <td><pre>
            {
                "message": "Job Id ${id} not found",
                "errorCode": "resource_not_found"
            }
            </pre>
            </td>
        </tr>
    </tbody>
</table>

 

## Naming Conventions 

-   All enums have been changed from CAPITAL_CASE_UNDERSCORES to small_case_underscores.
-   File types have been changed from enum to mime type(s). For instance, PDF is now \"application/pdf\".
-   Api names have been changed to follow kabob-case.
-   Time stamp have been changed from unix epoch to ISO 8601.

 
