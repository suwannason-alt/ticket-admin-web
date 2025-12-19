
FROM node:22-alpine
ENV NODE_ENV=production
RUN mkdir -p /app
WORKDIR /app

COPY . .

EXPOSE 3000
CMD ["yarn", "start"]

