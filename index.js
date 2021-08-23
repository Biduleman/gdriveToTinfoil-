var express = require("express");
const NodeCache = require("node-cache");
const axios = require('axios').default;
const format = require('string-format');
const basicAuth = require('express-basic-auth')
var app = express();

const PORT = process.env.PORT || 3000;
const CACHE_TTL = process.env.CACHE_TTL || 86400;

const API_KEY = process.env.API_KEY;
const BASE_FOLDER_ID = process.env.BASE_FOLDER_ID;
const DLC_FOLDER_ID = process.env.DLC_FOLDER_ID;
const UPDATES_FOLDER_ID = process.env.UPDATES_FOLDER_ID;
const LOGIN = process.env.LOGIN || "admin";
const PASSWORD = process.env.PASSWORD || "password";

app.use(basicAuth({
    challenge: true,
    users: {
        [LOGIN]: PASSWORD
    }
}))

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

const cache = new NodeCache({ stdTTL: CACHE_TTL });

const GOOGLE_FILE_LIST_URL = "https://www.googleapis.com/drive/v2/files?key={}&q='{}'+in+parents&maxResults=460";
const GOOGLE_FILE_DOWNLOAD_URL = "gdrive:{}#{}";

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

app.get("/flushcash", async(req, res, next) => {
    cache.flushAll();
    return res.status(200).json(myCache.getStats());
});

function getFilesFromFolderID(folderId) {
    const URL = format(GOOGLE_FILE_LIST_URL, API_KEY, folderId);
    return getAllPagedFiles(URL, "", []);
}

async function getAllPagedFiles(url, page, files) {
    var data = await (await axios.get(url + page)).data;
    if (data.nextPageToken) {
        return await getAllPagedFiles(url, "&pageToken=" + data.nextPageToken, files.concat([...new Set(data.items.map(item => ({ "url": format(GOOGLE_FILE_DOWNLOAD_URL, item.id, item.description), "size": parseInt(item.fileSize) })))]));
    } else {
        return files.concat([...new Set(data.items.map(item => ({ "url": format(GOOGLE_FILE_DOWNLOAD_URL, item.id, item.description), "size": parseInt(item.fileSize) })))]);
    }
}