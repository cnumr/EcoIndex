FROM node:lts 

ENV NODE_ENV production

# Install Go
RUN apt-get update && \
    apt-get install -y golang-go npm wget && \
    rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/gohugoio/hugo/releases/download/v0.119.0/hugo_0.119.0_linux-arm64.tar.gz && tar xvf hugo_0.119.0_linux-arm64.tar.gz && mv hugo /usr/local/bin/ 

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 1313

CMD ["hugo", "server", "--bind", "0.0.0.0"]
