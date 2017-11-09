var express = require('express');
var bodyParser = require('body-parser');
var multer  = require('multer');
var path = require('path');

var app = express();
var port = 3326;
app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
app.listen(port);
console.log('Server started on ' + port + ' and waited for upload');
var upload = multer({ dest: 'uploads/' });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/upload', upload.single('file'), (req, res, next) => {
	// var filename = req.file.filename;
	// var path = req.file.path;
	console.log(req.file);
	if (req.file) {
		res.json({code: 1, url: req.file.path});
		return;
	}
	res.json({code: 0, msg: 'upload faild'});
});