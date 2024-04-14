const express = require("express")
const app = express();
const dbconnect = require("./config/database")
const cloudinaryconnet = require("./config/cloudinary")
const fileupload = require("express-fileupload")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const cors = require("cors")
const routes = require("./routes/routes")

app.use(cors())
app.use(express.json())

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
    fileupload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );

const PORT = process.env.PORT || 4000;

dbconnect();

cloudinaryconnet();
// mount
app.use("/api/v1/SearchLostPerson",routes)


app.listen(PORT,()=>{
    console.log(`server Listening At ${PORT}`);
})


