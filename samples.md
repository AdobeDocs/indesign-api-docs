# Example Code
The below code snippets are for demonstration purpose. Please feel free to download and use them for testing. 
Just remember you will need to have the assets stored in one of the accepted external storage. 

## Sample capability bundle
Sample capability bundles can be found at [SampleScripts](SampleScripts/).
A manifest.json must be bundled inside the capability zip. A typical manifest would look like:
```json
{
    "manifestVersion": "1.0.0",
    "id": "c1dca2f0-bfe6-4920-ab0b-3b298aa5bfa2",
    "name": "renditions/jpeg",
    "version": "1.0.13",
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

## Submitting a capability
```yaml {requestMaker: true}
  defaultMethod: POST
  url: https://indesign.adobe.io/v3/capability
  headers:
    Authorization: Bearer your_token
    X-Api-Key: your_api_key
    x-gw-ims-org-id': your_adobe_developer_organization_id
    Content-Type: application/x-www-form-urlencoded
  body:
    file: @<CAPABILITY_BUNDLE_ZIP>
```
```
curl --location --request POST 'https://indesign.adobe.io/v3/capability' \
--header 'Authorization: bearer <TOKEN>'
--header 'x-api-key: <API-KEY>' \
--header 'x-gw-ims-org-id': ABCDEF123B6CCB7B0A495E2E@AdobeOrg \
--form 'file=@<CAPABILITY_BUNDLE_ZIP>'
```
Expected Response: HTTP 202
```json
{
    "url": "https://indesign.adobe.io/v3/1f5c78ba4c57a0d3f3877796031de3b4/rendition/jpeg",
    "capability": "rendition/jpeg",
    "version": "1.0.13"
}
```

## Executing a capability
```yaml {requestMaker: true}
  defaultMethod: POST
  url: https://indesign.adobe.io/v3/1f5c78ba4c57a0d3f3877796031de3b4/rendition/jpeg
  headers:
    Authorization: Bearer your_token
    X-Api-Key: your_api_key
    Content-Type: application/json
  body:
    {
        "assets": [
                    {
                        "source": {
                                    "url": "https://demo-asset.s3.us-west-1.amazonaws.com/myStorage/template.indt",
                                    "storageType": "AWS"
                                  },
                        "destination": "template.indt"
                    },
                    {
                        "source": {
                                    "url": "https://demo-asset.s3.us-west-1.amazonaws.com/myStorage/font.ttf",
                                    "storageType": "AWS"
                                  },
                        "destination": "font.ttf"
                    }
                  ],
        "params": {
                    "template" : "template.indt",
                    "ratio" : 25
                  }
    }
```

```
curl --location --request POST 'https://indesign.adobe.io/v3/1f5c78ba4c57a0d3f3877796031de3b4/rendition/jpeg' \
--header 'Authorization: Bearer <TOKEN>' \
--header 'x-api-key: <API-KEY>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "assets": [
    {
      "source": {
        "url": "https://demo-asset.s3.us-west-1.amazonaws.com/myStorage/template.indt",
        "storageType": "AWS"
      },
      "destination": "template.indt"
    },
    {
      "source": {
        "url": "https://demo-asset.s3.us-west-1.amazonaws.com/myStorage/font.ttf",
        "storageType": "AWS"
      },
      "destination": "font.ttf"
    }
  ],
  "params": {
    "template" : "template.indt",
    "ratio" : 25
  }
}'
```
Expected Response: HTTP 202
```json
{
  "id": "be6aa811-8e0c-4b35-8b8b-e19a49bd4a36",
  "statusUrls": "https://indesign.adobe.io/v3/status/be6aa811-8e0c-4b35-8b8b-e19a49bd4a36"
}
```

## Fetching execution status
```yaml {requestMaker: true}
  defaultMethod: GET
  url: https://indesign.adobe.io/v3/status/be6aa811-8e0c-4b35-8b8b-e19a49bd4a36
  headers:
    Authorization: Bearer your_token
    X-Api-Key: your_api_key
    Content-Type: application/json
```

```
curl --location --request GET 'https://indesign.adobe.io/v3/status/be6aa811-8e0c-4b35-8b8b-e19a49bd4a36' \
--header 'Authorization: Bearer <TOKEN>' \
--header 'x-api-key: <API-KEY>'
```
Expected Response: HTTP 200

[Back to home page](README.md)
