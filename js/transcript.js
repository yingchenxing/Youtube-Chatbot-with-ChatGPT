async function getLangOptionsWithLink(videoId) {
  
    // Get a transcript URL
    const videoPageResponse = await fetch("https://www.youtube.com/watch?v=" + videoId);
    const videoPageHtml = await videoPageResponse.text();
    const splittedHtml = videoPageHtml.split('"captions":')
  
    if (splittedHtml.length < 2) { return; } // No Caption Available
  
    const captions_json = JSON.parse(splittedHtml[1].split(',"videoDetails')[0].replace('\n', ''));
    const captionTracks = captions_json.playerCaptionsTracklistRenderer.captionTracks;
    const languageOptions = Array.from(captionTracks).map(i => { return i.name.simpleText; })
    
    const first = "English"; // Sort by English first
    languageOptions.sort(function(x,y){ return x.includes(first) ? -1 : y.includes(first) ? 1 : 0; });
    languageOptions.sort(function(x,y){ return x == first ? -1 : y == first ? 1 : 0; });
  
    return Array.from(languageOptions).map((langName, index) => {
      const link = captionTracks.find(i => i.name.simpleText === langName).baseUrl;
      return {
        language: langName,
        link: link
      }
    })
  }

async function getRawTranscript(link) {

    // Get Transcript
    const transcriptPageResponse = await fetch(link); // default 0
    const transcriptPageXml = await transcriptPageResponse.text();

    // Parse Transcript
    const jQueryParse = $.parseHTML(transcriptPageXml);
    const textNodes = jQueryParse[1].childNodes;

    let res;
    for(let i = 0;i<textNodes.length;i++){
        res+= " "+textNodes[i].textContent;
    }
    let search =/&#39;/g;
    return res.replace(search,"\'");
}

function getTabUrl() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        resolve(tabs[0].url);
      } else {
        reject('Cannot get tab URL');
      }
    });
  });
}

async function getVideoID(){
    var currentUrl=await getTabUrl();

    const videoIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const videoIdMatch = currentUrl.match(videoIdRegex);
     videoId = videoIdMatch ? videoIdMatch[1] : null;
  
    return videoId;
}

async function getTranscriptStr(){
    let videoId = await getVideoID();
    let langOptionsWithLink = await getLangOptionsWithLink(videoId);
    let rawTranscript = await getRawTranscript(langOptionsWithLink[0].link);
    // console.log(rawTranscript)
    return rawTranscript.toString();
}
