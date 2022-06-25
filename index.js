const express = require("express");
const OneSignal = require('onesignal-node');

const app = express();

app.use(express.json());

app.listen(3333);

const appId = 'one_signal_appId';
const apiKey = 'one_signal_apiKey';
const client = new OneSignal.Client(appId, apiKey);

app.get("/", async (request, response) => {
    try{
        console.log("Request")

        const {device, message, title}= request.body;
        console.log(device)
        console.log(message)
        console.log(title)
        console.log("-------")


        var notification = {
            app_id:appId,
            headings:{
                'en':title
            },
            contents: {
            'en': message,
            }
        };

        if (device && device.length>0){
            console.log("Especific users")
            notification["include_external_user_ids"] = [device]
        }else{
            console.log("All users") 
            notification["included_segments"] = ['Subscribed Users']
        }

        console.log(notification)

   
        const oneSignalResponse = await client.createNotification(notification);
        console.log("-----------")
        console.log(oneSignalResponse)
        return response.send(oneSignalResponse.body.id)
    }catch(ex){
        console.log("----------------")
        console.log("ERROR")
        console.log(ex)
        if (ex instanceof OneSignal.HTTPError) {
            response.status(ex.statusCode).send(ex.body)
        }else{
            return response.statusCode(500).send();
        }
    }
});