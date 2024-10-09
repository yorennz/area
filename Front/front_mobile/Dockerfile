FROM ghcr.io/cirruslabs/flutter:latest
WORKDIR /usr/src/flutter
COPY . .

RUN flutter pub get
RUN flutter build apk

ENTRYPOINT cp /app/build/app/outputs/apk/release/app-release.apk /usr/src/apk/client.apk