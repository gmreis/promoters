# App PROmoters Club

#### Facebook

$ ionic cordova plugin add cordova-plugin-facebook4 --variable APP_ID="265027410685189" --variable APP_NAME="PROmotersClub"
$ npm install --save @ionic-native/facebook

## COMPILANDO PARA PRODUÇÃO

$ ionic build android --prod --release

$ keytool -genkey -v -keystore my-release-key.keystore -alias promotersclubkey -keyalg RSA -keysize 2048 -validity 10000

$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore android-release-unsigned.apk promotersclubkey

$ /home/susa/Android/Sdk/build-tools/24.0.3/zipalign -v 4 android-release-unsigned.apk ProMotersClub.apk
