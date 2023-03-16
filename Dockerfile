FROM node:lts-alpine3.17
WORKDIR app/
COPY . .
EXPOSE 3000
RUN npm install
CMD ["node", "app.js"]
