![JitwinBanner-640x213](https://user-images.githubusercontent.com/34669114/179440686-e2a87bff-60db-453a-9fb1-424355a2c3e8.jpg)

# Jitwin
"Just-in-time + Twin" - Digital twin platform is like a broker between the real world and a virtual world to help you both to respect the real world and to find revolution idea in a virtual space.

# Overview
1. Value Stream Mapping (VSM) GUI Editor.
2. Traceability hub
3. Simulator

## VSM GUI
Macro perspective modeling GUI (graphical user interface) with only five elements to visualize value stream mapping.
- VSM template editor
- VSM stage to instantiate from template.

## Traceability hub
To make traceability from a wide variety of IoT data tagged a meaning of process with the methodology of Toyota Production System.

## Simulator
Re-input IoT data into VSM for problem-solving, studying revolution idea and planning to drive real-world.

# About this repository
Frontend : React / TypeScript
Backend : Spring / Kotlin

# Build on your PC

## Preparation
### Settings
```bash
export JITWIN_AAD_TENANT_ID=<your Azure Active Directory Tenant ID>
export JITWIN_AAD_CLIENT_ID=<your Application Client ID in AzureAD>
export JITWIN_AAD_CLIENT_SECRET=<your Application Client Secret Value>
```
see also https://github.com/mtonosaki/Jitwin/wiki/Azure-Settings#5-make-a-client-secret
NOTE: Setting the environment variable to ```./~zshrc``` allows development and testing to run smoothly.

### Frontend
```bash
copy ./jitwindev/web/.env.local.copy to .env.local and edit shell environment path.
cd ./jitwindev/web
yarn install
```

### Backend
```bash
cd ./jitwindev/server
# Launch IntelliJ IDEA to make .idea folder automatically.
./gradlew ktlintApplyToIdea
```

## Build / Debug
### Middleware
```bash
cd ./jitwindev
# start Docker desktop on your mac
docker-compose up db
```

### Frontend
```bash
cd ./jitwindev/web
yarn start
```
to access to frontend for debugging, `https://localhost:3000`

### Backend
```bash
cd ./jitwindev/server
./gradlew build -x test
java -jar -Dspring.profiles.active=local build/libs/toyokan-api-0.0.1-SNAPSHOT.jar
```
to access to backend, `http://localhost:8080`

## Test / Lint
### ALL
```bash
cd ./jitwindev
make pre-push  # Lint, Test front/back end.
```

### Frontend
```bash
cd ./jitwindev/web
yarn lint    # to lint
yarn test    # to test
```

### Backend
```bash
cd ./jitwindev/server
./gradlew ktlintFormat   # to lint
./gradlew test   # to test
```

### IDE (IntelliJ Ultimate)
#### Prettier Setting  

1. [Menu] → [IntelliJ IDEA] → [Preference]  
2. [Plugin@Left pane]
3. Install the plugin named 'Prettier'
4. [OK]
5. [Menu] → [IntelliJ IDEA] → [Preference]
6. [Languages & Frameworks @ Left pane] → [JavaScript] → [Prettier]
7. Select prettier package from dropdown list.
8. Check [On 'Reformat Code' action]
