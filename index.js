const rp = require("request-promise");
const express = require("express");
const axios = require("axios");
const app = express();
const path = require('path')
const cors = require("cors");
const port = process.env.PORT || 3000;

const pubblicDirectoryPath = path.join(__dirname, './public')
app.use(express.static(pubblicDirectoryPath))


app.use(cors()).get("/search", async (req, res) => {
  const query = req.query.hasOwnProperty("s") && req.query.s;
  return res.send(await searchUrl(query));
});

async function searchUrl(songName) {
  let vidId;
  let authId;
  let songUrl;
  let mainUrl;
  let id;
  let title;
  let image;
  let thumbnail;
  let result = new Array();

  try {
    let response = await axios.get(
      `https://api.resso.app/resso/track/search?q='${songName}'&region=IN&geo_region=in`
    );

    for (let key of response.data.tracks) {
      id = key["vid"];
      title = key["album"]["name"];
      image = key["album"]["url_pic"]["uri"];
      vidId = key["vid"];
      thumbnail = `"https://p16.resso.app/img/${image}~tplv-crop-center:150:150.webp" alt="image" width="60px" height="60px"`;
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
    }

    return result;
  } catch (err) {
    console.log(err);
  }
}
app.listen(port);
