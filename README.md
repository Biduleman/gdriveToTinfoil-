# gdriveToTinfoil

Parse Google Drive folders to serve links to Tinfoil

# Environment variable
**PORT:** Server port. Default = 3000

**CACHE_TTL:** Cache time in seconds for the responses. Default = 86400 (24 hours)

**API_KEY:** Google API Key to enable fetching data from Google Drive.

**BASE_FOLDER_ID:**: ID of the Google Drive folder where your BASE NSPs are located. The folder need to be public.

**DLC_FOLDER_ID:** ID of the Google Drive folder where your BASE NSPs are located. The folder need to be public.

**UPDATES_FOLDER_ID:** ID of the Google Drive folder where your BASE NSPs are located. The folder need to be public.

**LOGIN:** Login to access the different endpoints. Default = "admin"

**PASSWORD:** Password to access the different endpoints. Default = "password"

# Available Endpoints

## GET /base

Returns a list of every files in the **BASE** Google Drive folder, in JSON format for Tinfoil.

## GET /dlc

Returns a list of every files in the **DLC** Google Drive folder, in JSON format for Tinfoil.

## GET /updates

Returns a list of every files in the **UPDATES** Google Drive folder, in JSON format for Tinfoil.

## GET /flushcash

Flush the response cache in case you've added NSPs to your Google Drive before the TTL expires.
##
A real README with instructions will follow whenever I have the time.

First time using Node so I'm not aware of best practices. Feel free to send pull requests or open issues as you see fit.
