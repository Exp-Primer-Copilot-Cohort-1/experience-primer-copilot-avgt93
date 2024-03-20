// create web server

var http = require("http");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mysql = require("mysql");
var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "1234",
	database: "comment",
});
db.connect();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(3000, function () {
	console.log("Server is running on port 3000!");
});

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", function (req, res) {
	var sql = "SELECT * FROM board";
	db.query(sql, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			res.render("index", {
				title: "게시판",
				rows: result,
			});
		}
	});
});

app.get("/delete/:id", function (req, res) {
	var id = req.params.id;
	var sql = "DELETE FROM board WHERE id=?";
	db.query(sql, [id], function (err, result) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/");
		}
	});
});

app.get("/update/:id", function (req, res) {
	var id = req.params.id;
	var sql = "SELECT * FROM board WHERE id=?";
	db.query(sql, [id], function (err, result) {
		if (err) {
			console.log(err);
		} else {
			res.render("update", {
				title: "게시판 수정",
				row: result[0],
			});
		}
	});
});

app.post("/update/:id", function (req, res) {
	var id = req.params.id;
	var title = req.body.title;
	var content = req.body.content;
	var sql = "UPDATE board SET title=?, content=? WHERE id=?";
	db.query(sql, [title, content, id], function (err, result) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/");
		}
	});
});

app.get("/insert", function (req, res) {
	res.render("insert", {
		title: "게시판 글쓰기",
	});
});
