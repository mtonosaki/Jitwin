test:
	cd web && yarn test
	cd server && ./gradlew test

lint:
	cd web && yarn install && yarn lint
	cd server && ./gradlew ktlintFormat

pre-push:
	make lint	
	make test

start-frontend:
	cd web && yarn start

start-backend:
	cd server && ./gradlew build -x test && java -jar -Dspring.profiles.active=local build/libs/jitwin-api-0.0.1-SNAPSHOT.jar
