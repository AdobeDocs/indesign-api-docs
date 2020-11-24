# indesign-api-docs

## General Setup and OnBoarding
1. Create IMS client_id via ims service tool (https://imss.corp.adobe.com) - You need to add "indesign_services" as scope to this client ID.
2. You need to reach out to the Cloud Extensibility team cxp-engg@adobe.com, to whitelist your client_id.
Above mentioned APIs are exposed through AdobeIO, client teams would have to onboard to AdobeIO as Consumer Application and subscribe to "Cloud Extensibility Platform".  (Whitelisting API Keys - Subscribe API Keys to Services)

After step 1, you will have your client_id and client_secret.

use these to make a curl request to IMS
```
curl --location --request POST 'https://ims-na1-stg1.adobelogin.com/ims/token/v1' \
--header 'Cookie: relay=62669f22-9569-4355-a801-0f7fb917afdf; ftrset=380' \
--form 'grant_type="authorization_code"' \
--form 'client_id="IDCloudService2"' \
--form 'client_secret="xxxx-xxxxxx-xxxxxx-xxxxx-xxxxxxx"' \
--form 'code="Authorization: Bearer <YOUR_OAUTH_TOKEN>"' \
--form 'scope="indesign_services"'
```

after the successfull completion of the above request, 
you will get the 'access_token' in response.
Use this bearer token further in your API calls.
This will be valid for 24hrs, then you need to refresh it.

## API Keys

Also known as the client_id. You must additionally pass in your Adobe API key in the x-api-key header field. You’ll automatically get a developer API key when you create your Adobe I/O Console Integration. After you've created your integration you can find your API key in the Overview tab of your Integration

## Retries

The service will retry status codes of 429, 502, 503, 504 three times.
You should only retry requests that have a 5xx response code. A 5xx error response indicates there was a problem processing the request on the server.
You should implement an exponential back-off retry strategy with 3 retry attempts.
You should not retry requests for any other response code.
Rate Limiting

**We have not put a throttle limit on requests to the API at this time.

# InDesign

## General Workflow

INDESIGN workflows information - a brief

## Input and Output file storage

Clients can use assets stored on one of the following storage types:

1. Adobe: by referencing the path to the files on Creative Cloud
2. External: (like AWS S3) by using a presigned GET/PUT URL

## Supported Features

### Rendition
Details : basic info about rendition

Input Format : .INDD .INDT .IDML
OutPut Format : .pdf .png .JPEG

Sample Request

### DATAMERGE - 
Tags - Brief Info 
Merge - Brief Info



Fonts / links - detailed explanation is required about hierarchy 
Custom and typekit fonts supported 


