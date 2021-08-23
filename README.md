# gdriveToTinfoil-
Parse Google Drive folders to serve links to Tinfoil

List of environment variable:

PORT: Server port. Default = 3000

CACHE_TTL: Cache time in seconds for the responses. Default = 86400 (24 hours)

API_KEY: Google API Key to enable fetching data from Google Drive.

BASE_FOLDER_ID: ID of the Google Drive folder where your BASE NSPs are located.

DLC_FOLDER_ID: ID of the Google Drive folder where your BASE NSPs are located.

UPDATES_FOLDER_ID: ID of the Google Drive folder where your BASE NSPs are located.

LOGIN: Login to access the different endpoints. Default = "admin"

PASSWORD: Password to access the different endpoints. Default = "password"

Any variable without a "Default" is required.


Endpoints available:

GET /base

GET /dlc

GET /updates

They each return a list of every files in the corresponding Google Drive folder, in JSON format for Tinfoil.

GET /flushcash

Flush the response cache in case you've added NSPs to your Google Drive before the TTL expires.

A real README with instructions will follow whenever I have the time.

First time using Node so I'm not aware of best practices. Feel free to send pull requests or open issues as you see fit.
