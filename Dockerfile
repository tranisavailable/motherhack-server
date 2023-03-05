FROM node:lts-alpine3.17
WORKDIR app/
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
