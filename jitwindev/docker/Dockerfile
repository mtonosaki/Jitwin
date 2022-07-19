FROM public.ecr.aws/bitnami/node:16 as webBuild
ARG REACT_APP_API_HOST
ARG REACT_APP_HOST
ARG REACT_APP_NODE_ENV

WORKDIR /tmp
COPY .eslintrc.global.json .eslintrc.global.json
COPY ./addin ./addin
COPY ./web ./web
WORKDIR /tmp/addin
RUN yarn install
RUN yarn build:docker
WORKDIR /tmp/web
RUN yarn install
RUN yarn build:docker

FROM public.ecr.aws/bitnami/gradle:7 as serverBuild
WORKDIR /tmp
COPY ./server ./server
WORKDIR /tmp/server
COPY --from=webBuild /tmp/web/build /tmp/server/src/main/resources/public
RUN ./gradlew build -x test

FROM public.ecr.aws/docker/library/openjdk:17-jdk
ARG SPRING_PROFILE
ENV SPRING_PROFILE ${SPRING_PROFILE}

COPY --from=serverBuild /tmp/server/build/libs/jitwin-api-0.0.1-SNAPSHOT.jar ./app.jar
EXPOSE 8080
CMD java -jar app.jar --spring.profiles.active=${SPRING_PROFILE}
