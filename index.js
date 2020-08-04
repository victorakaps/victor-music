const rp = require("request-promise");
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors()).get("/search", async (req, res) => {
  const query = req.query.hasOwnProperty("s") && req.query.s;
  return res.send(await searchUrl(query));
});

let result = new Array();

async function searchUrl(songName) {
  let vidId;
  let authId;
  let songUrl;
  let mainUrl;
  let id;
  let title;
  let image;
  let thumbnail;
  url = `https://api.resso.app/resso/track/search?q='${songName}'&region=IN&geo_region=in`;

  var options = {
    uri: url,
    json: true,
  };

  try {
    let response = await axios.get(
      `https://api.resso.app/resso/track/search?q='${songName}'&region=IN&geo_region=in`
    );
    
    var key = response.data.tracks[0];
    id = key["vid"];
    title = key["album"]["name"];
    image = key["album"]["url_pic"]["uri"];
    vidId = key["vid"];
    thumbnail = `<a href="getmp3.php?vid=${id}&name=${title}"><img src="https://p16.resso.app/img/${image}~tplv-crop-center:150:150.webp" alt="image" width="60px" height="60px"></a>`;
    response = await axios.get(
      `https://api.resso.app/resso/player?device_platform=web&sim_region=in&media_id=${vidId}&media_source=h5`
    );
    authId = response.data.player_info["authorization"];
    songUrl = response.data.player_info["url_player_info"];
    songUrl += "&nobase64=true";

    var options = {
      uri: songUrl,
      headers: {
        Authorization: authId,
      },
      json: true,
    };

    response = await rp(options);
    mainUrl =
      response["video_info"]["data"]["video_list"]["video_1"]["main_url"];
    var song = new Object();
    song.title = songName;
    song.pic = thumbnail;
    song.url = mainUrl;
    result.push(song);
    return song;
  } catch (err) {
    console.log(err);
  }
}

app.listen(port);
