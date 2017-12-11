const express = require("express");
const app = express();

// 引入comments.js封装文件
const comment = require("./comment");


// 引入body-parser
const bodyParser = require("body-parser");


//把node_modules 开放出来
app.use("/node_modules/", express.static("./node_modules/"));



//在Express 中配置使用art-template模板引擎
//当渲染以.html 后缀名的文件的时候使用art-template模板引擎
//当配置完毕之后,我们就可以在我们的请求处理函数中使用res.render()方法来渲染
app.engine("html", require("express-art-template"))


//当配置好body-parser后res多了一个body属性,来解析post请求体的
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", (req, res) => {

  //调用封装的读取文件的方法
  comment.findAll((err, comments) => {
    if (err) {
      return res.end("读取文件失败")
    }
    console.log(comments);
    res.render("index.html", {
      comments
    })
  })
})
app.get("/fabiao",(req,res)=>{
  res.render('fabiao.html');
});


app.post("/fabiao", (req, res) => {

  //接收数据
  const body = req.body
  console.log(body);
  //校验
  if (!body.name || !body.name.length) {
    return res.send("name invalid")
  }
  if (!body.content || !body.content.length) {
    return res.send("content invalid")
  }

//   //调用函数
  comment.save(body, err => {
    if (err) {
      return res.send("500 Server Error")
    }
    res.redirect("/")
  })

})

app.listen(3000, () => {
  console.log("app runing...");
})