const express = require("express");
const fs = require('fs');
const readline = require('readline');
const NodeCache = require("node-cache");
const format = require('string-format');
const basicAuth = require('express-basic-auth')
const { google } = require('googleapis');
var app = express();

const BASE_FOLDER_ID = process.env.BASE_FOLDER_ID;
const DLC_FOLDER_ID = process.env.DLC_FOLDER_ID;
const UPDATES_FOLDER_ID = process.env.UPDATES_FOLDER_ID;
const LOGIN = process.env.LOGIN || "admin";
const PASSWORD = process.env.PASSWORD || "password";
const GOOGLE_FILE_DOWNLOAD_URL = "gdrive:{}#{}";
const TOKEN_PATH = 'conf/gdrive.token';
const CREDENTIALS_PATH = 'conf/credentials.json';

const PORT = process.env.PORT || 3000;
const CACHE_TTL = process.env.CACHE_TTL || 86400;
const cache = new NodeCache({ stdTTL: CACHE_TTL });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let driveAPI;

app.use(basicAuth({
    challenge: true,
    users: {
        [LOGIN]: PASSWORD
    }
}))

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

const verifyCache = (req, res, next) => {
    try {
        const id = req.route.path;
        if (cache.has(id)) {
            return res.status(200).json(cache.get(id));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};

function question(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            resolve(answer)
        });
    });
}

/**
 * Create an OAuth2 client with the given credentials.
 * @param {Object} credentials The authorization client credentials.
 */
function authorize(credentials) {
    const {
        client_email,
        private_key
    } = credentials;

    const jwtClient = new google.auth.JWT(
        client_email,
        null,
        private_key, ['https://www.googleapis.com/auth/drive']);

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessTokenJWT(jwtClient);
        jwtClient.setCredentials(JSON.parse(token));

        driveAPI = google.drive({
            version: 'v3',
            auth: jwtClient
        });
    });
}

/**
 * Get and store new token after prompting for user authorization.
 * @param {google.auth.JWT} jwtClient The OAuth2 client to get token for.
 */
function getAccessTokenJWT(jwtClient) {
    jwtClient.authorize(function(err, tokens) {
        if (err) return console.error(err);

        jwtClient.setCredentials(tokens);
        fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });

        driveAPI = google.drive({
            version: 'v3',
            auth: jwtClient
        });
    });
}

fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content));
});

app.get("/base", verifyCache, async(req, res, next) => {
    const id = req.route.path;
    var files = await getFilesFromFolderID(BASE_FOLDER_ID);
    var response = { "files": files, "directories": [] };
    cache.set(id, response);
    return res.status(200).json(response);
});

app.get("/dlc", verifyCache, async(req, res, next) => {
    const id = req.route.path;
    var files = await getFilesFromFolderID(DLC_FOLDER_ID);
    var response = { "files": files, "directories": [] };
    cache.set(id, response);
    return res.status(200).json(response);
});

app.get("/updates", verifyCache, async(req, res, next) => {
    const id = req.route.path;
    var files = await getFilesFromFolderID(UPDATES_FOLDER_ID);
    var response = { "files": files, "directories": [] };
    cache.set(id, response);
    return res.status(200).json(response);
});

app.get("/flushcache", async(req, res, next) => {
    await cache.flushAll();
    return res.status(200).json(cache.getStats());
});

async function getFilesFromFolderID(folderId) {
    return await getAllPagedFiles(folderId, "", []);
}

async function getAllPagedFiles(folderId, pageToken, files) {
    var options = {
        q: format("'{}' in parents", folderId),
        fields: "nextPageToken, files(id, name, size)",
        pageToken: pageToken,
        pageSize: 1000
    };
    var response = await driveAPI.files.list(options);
    var data = response.data;
    if (data.nextPageToken) {
        return await getAllPagedFiles(folderId, data.nextPageToken, files.concat([...new Set(data.files.map(file => ({ "url": format(GOOGLE_FILE_DOWNLOAD_URL, file.id, file.name), "size": parseInt(file.size) })))]));
    } else {
        return files.concat([...new Set(data.files.map(file => ({ "url": format(GOOGLE_FILE_DOWNLOAD_URL, file.id, file.name), "size": parseInt(file.size) })))]);
    }
}