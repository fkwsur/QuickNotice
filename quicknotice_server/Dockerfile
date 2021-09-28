# 무슨 언어로 개발을 할 것인가 : 버전
FROM node:14
# 퐅더만들어주는 명령어 / 이름
RUN mkdir /app
# 폴더안에 내용을 다 만들어줘야하는데 어디다 만들거냐면 위에 있는애 이름
WORKDIR /app
# 애들을 가져와야됨 여기서 현재위치, 그리고 작동할 위치
ADD ./ /app

RUN npm install

CMD npm start