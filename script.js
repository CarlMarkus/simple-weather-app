const express = require("express");
const app  = express();
const https = require('https');
app.use(express.urlencoded({ extended : true}));
app.use(express.json())
app.use(express.static("StaticFiles"));
port = 3000;

app.get("/", function(request, response){

  response.sendFile(__dirname + "/index.html")
})

app.post("/", function(request, response){
  const apiKey = "YOUR API KEY"
  const query =  request.body.cityName;
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query + "&appid="+ apiKey +"&units="+units+"";

    https.get(url, function(responseAPI){
      //check response
      if (responseAPI.statusCode === 200){
          console.log(responseAPI.statusCode);

        responseAPI.on("data", function(data){
          const weatherData = JSON.parse(data);
          const temperature = weatherData.main.temp
          const feelsLike = weatherData.main.feels_like
          const weatherDesc = weatherData.weather[0].description
          const emoji = weatherData.weather[0].icon
          const emojiURL = "http://openweathermap.org/img/wn/"+ emoji +"@2x.png"

          response.type("html");
          response.write("<body><h1>The temperature in " + query +
           " is: " +  temperature +
          " degrees</h1>" + "<style> body {background-color: #f7f7f7; text-align: center;} h1{padding-top: 20px; font-size: 50px;}</style></body>");
          response.write("<h1>It feels like:  " + feelsLike +  " degrees</h1>");
          response.write("<h1>The weather is:  " + weatherDesc  + "<img src =" + emojiURL + ">" + "</h1>");
          response.write("<h3><a href=/>Go Back</a></h3>")
          response.send();
    });
  }else{
    console.log("error")
    response.sendFile(__dirname + "/error.html");
  }
  });

});
app.listen(port, function(){
  console.log("server is running on port: " + port)
});
