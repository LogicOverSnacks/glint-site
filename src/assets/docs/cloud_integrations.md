# Cloud Integrations
Glint can integrate with popular cloud providers. Doing so will allow you to browse and clone remote repositories from within Glint, and provides OAuth credentials to authorize remote actions such as Fetch and Push.

## Adding a Cloud Integration

* Within Glint, go to the Settings page by clicking the cog icon in the top-right of the app.
* Select the "General" tab.
* Ensure that you are logged in.
* Under the "Integrations" heading, click on the + button.

<img src="/assets/docs/cloud-integration-add.png" class="fit-image">

* From the menu, choose which cloud provider you would like to access.
* A new tab will open in your browser so that you can login.
* After logging in, you may be presented with a popup, click to allow opening Glint:

<img src="/assets/docs/cloud-integration-deep-link.png" class="fit-image">

* The integration should now appear in Glint above the + button you clicked earlier.
* If the integration does not appear, you may need to manually copy the Authorization Code from the website into Glint.

## GitHub

### Organization Owned Repositories
For repositories belonging to an organization, that organization must authorize Glint for access. To request this access from your organisation:
1. Login to your personal GitHub account.
2. Either click <a href="https://github.com/settings/connections/applications/57f2729610ec48a1d787" target="_blank">here</a> to go to the GitHub settings page for Glint, or follow these steps to get there:
  * Go to your settings in GiHub by clicking your profile in the top-right and selecting "Settings".
  * Go to the "Applications" page under "Integrations".
  * Select the "Authorized OAuth Apps" tab.
  * Click on "Glint" to access settings for Glint.
3. Click on the "Request" button for the appropriate organization under the "Organization access" header.

<!--
TODO:
## GitLab

## Bitbucket
-->
