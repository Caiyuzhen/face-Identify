const video = document.getElementById('video')
const span = document.getElementById('emotion')

//npm i face-api.js
//api ææ¡£ï¼https://github.com/justadudewhohacks/face-api.js

//ð¹æ¾ç¤ºåç½®æåå¤´
const startVideo = () => {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  )
}




//ð»å¼æ­¥å è½½æ°æ®æ¨¡å(ð¥ å è½½ Api é½æ¯å¼æ­¥ç Promise)
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),//å è½½æ¨¡åæ°æ®
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'), //è¯å«äºå®
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'), //è¯å«æåå¤´èå´åææ²¡æäººè¸
  faceapi.nets.faceExpressionNet.loadFromUri('./models'), //è¯å«æç»ª
]).then(startVideo()) //then å¼æ­¥å è½½å®è¿äº model ååæ§è¡æ­æ¾è§é¢çæ¹æ³ startVideo()




//ðçå¬è§é¢çäºä»¶ï¼ç¨è¿äºæ°æ®æ¨¡åæ¥è¯å«è§é¢ä¸­çäººè¸
video.addEventListener('play', () => {

  //ä½¿ç¨ face-api ç video æ ç­¾æ¥åå»º canvasï¼ç¶åç¨ js ååå»ºå html ç body å
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)

  
  //å£°æ canvas éè¦å±ç¤ºçå®½é«(ç¸å½äºè¦çåè§é¢ä¸)
  const displaySize = {
    width: video.width,
    height: video.height,
  }

  //ä¿æ canvas å®½é«çä¸è´
  faceapi.matchDimensions(canvas, displaySize)



  //ä¸åçæ§è¡è¿ä¸ªæ¹æ³æ¥è¿½è¸ªè¸é¨
  setInterval(async ()=>{

    //ð¥ðè¿ä¸ªå°±æ¯æç»çé¢é¨æ°æ®{å¯¹è±¡}, ç¨ detection æ¥è·å¾è¸é¨æ°æ®,  detectAllFaces è·å¾ææäºå®
    const detection = await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions).withFaceLandmarks().withFaceExpressions() //å ä¸è¯å«äºå®è·è¯å«æç»ªçæ¹æ³
    console.log(detection)

    //å°å®æ¶çé¢é¨æ°æ®å³èå° resizedDetections ä¸
    const resizedDetections = faceapi.resizeResults(detection, displaySize) //è°æ´å¾çå¤§å°
  
   


    //ðä¸ºäºé¿åéå½±ï¼æ¯æ¬¡é½ä»åæ  0ï¼0 çä½ç½®éæ°æ¸é¤ä¸éæ§æ°æ®(è®°å¾å«åéä½ç½®ï¼ï¼åæ¸é¤æ§æ°æ®åç»æ°æ°æ®)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)


    //ç¨ draw æ¹æ³æ¥ç»å¶é¢é¨æ°æ®å° canvas ä¸
    faceapi.draw.drawDetections(canvas,resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas,resizedDetections)



    // //æè¯å«åºæ¥çæç»ªæ°æ®è¿è¡æ°æ®æ ¼å¼çè½¬åï¼è½¬åæææ¬å½¢å¼, è¿éçæ°æ®æ¯ä¸ä¸ªå¯¹è±¡ï¼æä»¥è¦ç¨ JSON.stringify() æ¥è½¬åæå­ç¬¦ä¸²
    // const emotionData = JSON.stringify(detection[0].expressions)


    // //æ emotionData è½¬åä¸ºæ°ç»æ ¼å¼çæ°æ®
    // const emotionArray = emotionData.split(',')



    // //æååºæç»ªå¼
    // const emotionValue = emotionArray.map(item => {
    //   return item.split(':')[0]
    // })

    // //å»æ emotionValue æ°ç»åçåå¼å·ä»¥åç¬¬[0]ä¸ªæ°æ®çå¼å¤´ç¬¬ä¸ä¸ªå­æ¯
    // //æ¹æ³ä¸ï¼
    // // const emotionValueArray = emotionValue.map(item => {
    // //   return item.substring(1, item.length - 1)
    // // })

    // //æ¹æ³äºï¼
    // const emotionValueArray = emotionValue.map(item => {
    //   return item.replace(/"/g, '')
    // })


    // //emotionValueArray[0]
    

    // console.log(emotionValueArray);


    // //éå emotionValueArray, å¦æåå« contains çå¼ï¼åææç»ªå¼è½¬åä¸º emoji å½¢å¼
    // const emotionValueArray3 = emotionValueArray.map(item => {
    //   if(item === '{neutral'){
    //     return 'ð'
    //   }else if(item === 'angry'){
    //     return 'ð¡'
    //   }else if(item === 'surprised'){
    //     return 'ð±'
    //   }else if(item === 'happy'){
    //     return 'ð'
    //   }else if(item === 'disgusted'){
    //     return 'ð'
    //   }else if(item === 'sad'){
    //     return 'ð¢'
    //   }else if(item === 'fearful'){
    //     return 'ð¨'
    //   }
    // })


    //ææç»çæç»ªå¼æå°å° html ç body ä¸,
    // document.getElementById('emotion').innerText =  emotionText

  }, 100)
})