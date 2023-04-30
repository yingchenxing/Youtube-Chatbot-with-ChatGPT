// import $  from "\jquery-3.6.4.js";
console.log($);

// var t = document.querySelector("ytd-transcript-segment-list-renderer").__data.data.initialSegments.map(t=>t.transcriptSegmentRenderer.snippet.runs[0].text);
// console.log(t);
// const videoPageResponse =  fetch("https://www.youtube.com/watch?v=" + videoId);
// console.log(videoPageResponse);
// const videoPageHtml =  videoPageResponse.text();
// const splittedHtml = videoPageHtml.split('"captions":');

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
    // return Array.from(textNodes).map(i => {
    //     return {
    //     start: i.getAttribute("start"),
    //     duration: i.getAttribute("dur"),
    //     text: i.textContent
    //     };
    // });

}

function getVideoID(){
    // 获取当前页面的URL
    const currentUrl = window.location.href;

    // 通过正则表达式解析视频ID
    const videoIdRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const videoIdMatch = currentUrl.match(videoIdRegex);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    console.log(videoId); // 输出视频ID，如果无法解析则为null
    return videoId;
}

async function main(){
    let videoId = getVideoID();
    let langOptionsWithLink = await getLangOptionsWithLink(videoId);
    console.log(langOptionsWithLink)
    let rawTranscript = await getRawTranscript(langOptionsWithLink[0].link);
    console.log(rawTranscript)
}

main();