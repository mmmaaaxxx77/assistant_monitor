/**********************
 * import lib
 ***********************/
var sampleClient = require('./googleClient');
var google = require('googleapis');
var googleV2 = require('googleapis');
var fs = require('fs');

/**********************
 * setting
 ***********************/
var auth = sampleClient.oAuth2Client;
var drive = google.drive({
	version: 'v3',
	auth: auth
});
var driveV2 = googleV2.drive({
	version: 'v2',
	auth: auth
});
var urlshortener = google.urlshortener('v1');
var urlshortener_key = 'AIzaSyBWRhUIm3OcXHVVDcIERrIzu-IefoV2PKo';

var scopes = [
	'https://www.googleapis.com/auth/drive',
	'https://www.googleapis.com/auth/drive.appdata',
	'https://www.googleapis.com/auth/drive.file',
	'https://www.googleapis.com/auth/drive.metadata',
	'https://www.googleapis.com/auth/drive.metadata.readonly',
	'https://www.googleapis.com/auth/drive.photos.readonly',
	'https://www.googleapis.com/auth/drive.readonly'
];

/**********************
 * function
 ***********************/
function list(query) {
	'list all files'

	var params = {
		pageSize: 3
	};
	if (query) {
		params.q = query;
	}
	drive.files.list(params, function(err, result) {
		if (err) {
			console.error(err);
			return;
		}

		console.log(result.files);
	});
}

function create(filePath, fileName, callback) {
	'create pdf file from path'

	drive.files.create({
		resource: {
			parents: ['0B7c4nRHGR8X6cEJiSDg4UHF5R2c'],
			name: fileName,
			mimeType: 'application/pdf'
		},
		media: {
			mimeType: 'application/pdf',
			body: fs.createReadStream(filePath)
		}
	}, function(err, data) {
		if (err) {
			console.log(err);
			return;
		}
		get(data.id);
		shortUrl(data.id, callback);		
	});
}

function get(id) {
	'get file metadata'

	drive.files.get({
			fileId: id
		},
		function(err, data) {
			if (err) {
				console.log(err);
				return;
			}
			console.log(data);
		});
}

function shortUrl(id, callback) {
	'generate short url by id'

	url = "https://drive.google.com/file/d/" + id + "/view?usp=sharing";
	urlshortener.url.insert({
		key: urlshortener_key,
		resource: {
			longUrl: url
		}
	}, function(err, data) {
		if (err) {
			console.log(err);
			return;
		}
		console.log(data);
		callback(data.id);
		clearOldFiles();
	});
}

/**********************
 * function V2
 ***********************/
function clearOldFiles() {
	'clear files older than 7 days'


	var now = new Date(Date.now());
	var q_date = new Date(now.setDate(now.getDate() - 7));

	var params = {
		maxResults: 10,
		q: "modifiedDate < '" + timestamp(q_date) + "'"
	}

	driveV2.files.list(params, function(err, result) {
		if (err) {
			console.error(err);
			return;
		}

		emptyTrash();
		for (item in result.items) {
			if (result.items[item].mimeType != "application/vnd.google-apps.folder") {
				deleteFile(result.items[item].id);
			}
		}

	});
}

function deleteFile(id) {
	'delete file by id'

	var params = {
		'fileId': id
	}

	driveV2.files.delete(params, function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
	});
}

function emptyTrash() {
	'empty google drive trash'

	driveV2.files.emptyTrash({}, function(err, result) {
		if (err) {
			console.error(err);
			return;
		}
	});
}

function timestamp(date) {
	'generate formate date string'

	var pad = function(amount, width) {
		var padding = "";
		while (padding.length < width - 1 && amount < Math.pow(10, width - padding.length - 1))
			padding += "0";
		return padding + amount.toString();
	}
	date = date ? date : new Date();
	var offset = date.getTimezoneOffset();
	return pad(date.getFullYear(), 4) + "-" + pad(date.getMonth() + 1, 2) + "-" + pad(date.getDate(), 2) + "T" + pad(date.getHours(), 2) + ":" + pad(date.getMinutes(), 2) + ":" + pad(date.getSeconds(), 2);
}

/**********************
 * module
 ***********************/
function googleApp() {
	var self = this;

	self.get = function(id, callback) {
		sampleClient.execute(scopes, function(tokens) {
			get(id, callback);
		});
	};

	self.create = function(filePath, fileName, callback) {
		sampleClient.execute(scopes, function(tokens) {
			create(filePath, fileName, callback);
		});
	};

	self.shortUrl = function(id, callback) {
		sampleClient.execute(scopes, function(tokens) {
			shortUrl(id, callback);
		});
	};

	self.clearOldFiles = function(){
		clearOldFiles();
	}
}

module.exports = new googleApp();

/**********************
 * main test
 ***********************/
/*
if (module === require.main) {
	sampleClient.execute(scopes, function(tokens) {
		create2(process.argv.slice(2)[0]);
	});
}
*/