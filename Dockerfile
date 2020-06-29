FROM golang:1.14.4-buster

WORKDIR /usr/src/app

COPY package*.json ./

COPY go.mod ./

COPY go.sum ./

RUN go mod download

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

RUN apt-get install -y nodejs

RUN npm install

RUN apt-get install wait-for-it

COPY . .

EXPOSE 7070

RUN npm run webpack

RUN go build

CMD ./walrus

