FROM node
WORKDIR /usr/src/front
COPY . .

RUN npm install
RUN npm run build

RUN ln -s /usr/src/apk/client.apk public/client.apk

EXPOSE 8081

CMD ["npm", "start"]