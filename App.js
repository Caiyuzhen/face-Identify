const video = document.getElementById('video')
const span = document.getElementById('emotion')

//npm i face-api.js
//api 文档：https://github.com/justadudewhohacks/face-api.js

//📹显示前置摄像头
const startVideo = () => {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  )
}




//💻异步加载数据模型(🔥 加载 Api 都是异步的 Promise)
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),//加载模型数据
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'), //识别五官
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'), //识别摄像头范围内有没有人脸
  faceapi.nets.faceExpressionNet.loadFromUri('./models'), //识别情绪
]).then(startVideo()) //then 异步加载完这些 model 后再执行播放视频的方法 startVideo()




//👂监听视频的事件，用这些数据模型来识别视频中的人脸
video.addEventListener('play', () => {

  //使用 face-api 的 video 标签来创建 canvas，然后用 js 再创建回 html 的 body 内
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)

  
  //声明 canvas 需要展示的宽高(相当于覆盖回视频上)
  const displaySize = {
    width: video.width,
    height: video.height,
  }

  //保持 canvas 宽高的一致
  faceapi.matchDimensions(canvas, displaySize)



  //不停的执行这个方法来追踪脸部
  setInterval(async ()=>{

    //🔥👇这个就是最终的面部数据{对象}, 用 detection 来获得脸部数据,  detectAllFaces 获得所有五官
    const detection = await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions).withFaceLandmarks().withFaceExpressions() //加上识别五官跟识别情绪的方法
    console.log(detection)

    //将实时的面部数据关联到 resizedDetections 上
    const resizedDetections = faceapi.resizeResults(detection, displaySize) //调整图片大小
  
   


    //🌟为了避免重影，每次都从坐标 0，0 的位置重新清除一遍旧数据(记得别写错位置！！先清除旧数据再画新数据)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)


    //用 draw 方法来绘制面部数据到 canvas 上
    faceapi.draw.drawDetections(canvas,resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas,resizedDetections)



    // //把识别出来的情绪数据进行数据格式的转化，转化成文本形式, 这里的数据是一个对象，所以要用 JSON.stringify() 来转化成字符串
    // const emotionData = JSON.stringify(detection[0].expressions)


    // //把 emotionData 转化为数组格式的数据
    // const emotionArray = emotionData.split(',')



    // //提取出情绪值
    // const emotionValue = emotionArray.map(item => {
    //   return item.split(':')[0]
    // })

    // //去掉 emotionValue 数组内的双引号以及第[0]个数据的开头第一个字母
    // //方法一：
    // // const emotionValueArray = emotionValue.map(item => {
    // //   return item.substring(1, item.length - 1)
    // // })

    // //方法二：
    // const emotionValueArray = emotionValue.map(item => {
    //   return item.replace(/"/g, '')
    // })


    // //emotionValueArray[0]
    

    // console.log(emotionValueArray);


    // //遍历 emotionValueArray, 如果包含 contains 的值，则把情绪值转化为 emoji 形式
    // const emotionValueArray3 = emotionValueArray.map(item => {
    //   if(item === '{neutral'){
    //     return '😐'
    //   }else if(item === 'angry'){
    //     return '😡'
    //   }else if(item === 'surprised'){
    //     return '😱'
    //   }else if(item === 'happy'){
    //     return '😃'
    //   }else if(item === 'disgusted'){
    //     return '👀'
    //   }else if(item === 'sad'){
    //     return '😢'
    //   }else if(item === 'fearful'){
    //     return '😨'
    //   }
    // })


    //把最终的情绪值打印到 html 的 body 上,
    // document.getElementById('emotion').innerText =  emotionText

  }, 100)
})