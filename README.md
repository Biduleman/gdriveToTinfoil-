# gdriveToTinfoil

Parse Google Drive folders to serve links to Tinfoil. OAuth2 with a service account required. The files in your stash need to be available to the service account used.

# Environment variable
**PORT:** Server port. Default = 3000

**CACHE_TTL:** Cache time in seconds for the responses. Default = 86400 (24 hours)

**BASE_FOLDER_ID:**: ID of the Google Drive folder where your BASE NSPs are located. The folder need to be public.

**DLC_FOLDER_ID:** ID of the Google Drive folder where your BASE NSPs are located. The folder need to be public.

**UPDATES_FOLDER_ID:** ID of the Google Drive folder where your BASE NSPs are located. The folder need to be public.

**LOGIN:** Login to access the different endpoints. Default = "admin"

**PASSWORD:** Password to access the different endpoints. Default = "password"

# SETUP

You need to create a `conf` folder where you will put your `credentials.json` file. Only `service_account` are supported.

# Available Endpoints

## GET /base

Returns a list of every files in the **BASE** Google Drive folder, in JSON format for Tinfoil.

## GET /dlc

Returns a list of every files in the **DLC** Google Drive folder, in JSON format for Tinfoil.

## GET /updates

Returns a list of every files in the **UPDATES** Google Drive folder, in JSON format for Tinfoil.

## GET /flushcache

Flush the response cache in case you've added NSPs to your Google Drive before the TTL expires.
##
A real README with instructions will follow whenever I have the time.

First time using Node so I'm not aware of best practices. Feel free to send pull requests or open issues as you see fit.
