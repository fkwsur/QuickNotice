
// instances의 경우 배포하는 환경 상황에 따라서 갯수를 지정해주는 쪽이 좀 더 좋음, 지금은 임시용이라 cpu갯수에 맞게 설정을 해놓은 것..
module.exports = {
  apps : [
    {
      name : "quicknotice-server",
      script : './app.js',
      instances : 0,
      exec_mode : 'cluster'
    }
  ]
}