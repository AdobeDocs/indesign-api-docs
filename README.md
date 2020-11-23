# indesign-api-docs

## OnBoarding
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
--form 'code="xxxxxxxxxx-xxxxxx-xx-x-x-xx-xx-x-x-x-x-xxxx"' \
--form 'scope="indesign_services"'
```

after the successfull completion of the above request, 
you will get the 'access_token' in response.
Use this bearer token further in your API calls.
This will be valid for 24hrs, then you need to refresh it.

