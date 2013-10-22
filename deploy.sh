node enyo/tools/deploy.js
cp ./config.xml ./deploy/ParkNPay/
rm ./deploy/ParkNPay/*.zip
zip -r  ./deploy/ParkNPay.zip ./deploy/ParkNPay/
echo "updating adobe build - phonegap - server"
curl -X PUT -F file=@./deploy/ParkNPay.zip https://build.phonegap.com/api/v1/apps/609779?auth_token=b1u3DwCv96WqqUM62pti

