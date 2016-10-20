FROM everymountain/express

#VOLUME /app/public
#VOLUME /app/endpoints
#EXPOSE 3000

COPY bin /app/bin
COPY package.json /app
WORKDIR /app
RUN npm install
CMD npm start