'use strict';

// Imports
const express = require('express');
const bodyParser = require('body-parser');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const axios = require('axios');

// Config
const PORT = 8000;

// Server https://expressjs.com/en/guide/routing.html
const app = express();

app.use(bodyParser.json());
app.post('/webhook', function(req, res) {
  console.log('webhook PAYLOAD:\n', JSON.stringify(req.body, null, 4));


  let body = req.body;

  let token = req.params.token;

  let requestData = getType(body.event, body);

  if (requestData && requestData.type) {
    try {
      axios({
        method: 'post',
        url: `http://gabriel_p.desk360.localhost/api/v2.0/instance/${token}/webhook`,
        data: requestData
      });
    } catch (e) {
      console.log(e)
    }
  }

  res.status(204);
  res.send();
});

const getType = (type, data) => {
  let number = null;
  switch (type) {
    case 'image':
      number = getNumber(data);
      return {
        "number": number,
        "message": "",
        "name": customerName(data),
        "avatar": customerAvatar(data),
        "created_at": createdAtTime(data),
        "campaignId ": campaignId(data),
        "chatTicketId": chatId(data),
        "attachments": getAttachUrl(data),
        "type": number ? "image" : null
      };
    case 'video':
      number = getNumber(data);
      return {
        "number": number,
        "message": "",
        "name": customerName(data),
        "avatar": customerAvatar(data),
        "created_at": createdAtTime(data),
        "attachments": getAttachUrl(data),
        "campaignId ": campaignId(data),
        "chatTicketId": chatId(data),
        "type": number ? "video" : null
      };
    case 'pdf':
      number = getNumber(data);
      return {
        "number": number,
        "message": "",
        "name": customerName(data),
        "avatar": customerAvatar(data),
        "created_at": createdAtTime(data),
        "attachments": getAttachUrl(data),
        "campaignId ": campaignId(data),
        "chatTicketId": chatId(data),
        "type": number ? "attachment" : null
      };
    case 'doc':
      number = getNumber(data);
      return {
        "number": number,
        "message": "",
        "name": customerName(data),
        "avatar": customerAvatar(data),
        "created_at": createdAtTime(data),
        "campaignId ": campaignId(data),
        "chatTicketId": chatId(data),
        "attachments": getAttachUrl(data),
        "type": number ? "attachment" : null
      };
    case 'audio':
      number = getNumber(data);
      return {
        "number": number,
        "message": "",
        "name": customerName(data),
        "avatar": customerAvatar(data),
        "created_at": createdAtTime(data),
        "campaignId ": campaignId(data),
        "chatTicketId": chatId(data),
        "attachments": getAttachUrl(data),
        "type": number ? "audio" : null
      };
    case 'message':
      number = getNumber(data);
      return {
        "number": number,
        "message": getMessage(data),
        "name": customerName(data),
        "avatar": customerAvatar(data),
        "campaignId ": campaignId(data),
        "chatTicketId": chatId(data),
        "created_at": createdAtTime(data),
        "attachments": "",
        "type": number ? "chat" : null
      };
    case 'campaignUpdate':
      number = getNumberCampaignUpdate(data);
      return {
        "number": number,
        "message": getMessageCampaignUpdate(data),
        "name": getNameCampaignUpdate(data),
        "created_at": createdAtTimeCampaignUpdate(data),
        "campaignId ": campaignIdCampaignUpdate(data),
        "type": number ? "campaignUpdate" : null
      };
    case 'last_flow':
      number = getNumber(data);
      return {
        "number": number,
        "message": getMessage(data),
        "name": customerName(data),
        "avatar": customerAvatar(data),
        "created_at": createdAtTime(data),
        "chatTicketId": chatId(data),
        "campaignId ": campaignId(data),
        "attachments": getAttachUrl(data),
        "type": number ? "last_flow" : null
      };
    case 'addBlackList':
      number = getNumberAddBlackList(data);
      return {
        "number": number,
        "blackListId": getBlackListId(data),
        "type": number ? "addBlackList" : null
      };
    case 'status':
      return {
        "type": type,
        "status": data.instance.activated
      };
    case 'phoneDisconnected':
      return {
        "type": 'status',
        "status": false
      };
  }
  return null;
}


const getNumber = data => {

  let number = data.customer.uid;

  try {
    let phoneNumber = phoneUtil.parseAndKeepRawInput(number, "BR");
    return phoneNumber.getNationalNumber().toString();
  } catch (e) {
    return null;
  }
}


const getMessage = data => {
  return data.message.body.text;
}

const customerName = data => {
  return data.customer.name;
}

const createdAtTime = data => {
  return data.message.body.sent_at;
}

const customerAvatar = data => {
  return data.customer.image;
}

const getAttachUrl = data => {
  return data.message.body.text;
}

const campaignId = data => {
  return data.chatTicket.campaign.id;
}
const getBlackListId = data => {
  return data.blackList.id;
}

const chatId = data => {
  return data.chatTicket.id;
}

//POR FALTA DE PADRÃO DA PED BOT TIVEMOS QUE FAZER FUNÇÕES PARA PEGAR MESMO DADO DE JEITO DIFERENTES

const getNumberCampaignUpdate = data => {

  let number = data.dispatch.customer.phone_number;

  try {
    let phoneNumber = phoneUtil.parseAndKeepRawInput(number, "BR");
    return phoneNumber.getNationalNumber().toString();
  } catch (e) {
    return null;
  }
}

const getNameCampaignUpdate = data => {
  return data.dispatch.customer.name;
}

const createdAtTimeCampaignUpdate = data => {
  return data.dispatch.body.sent_at;
}


const campaignIdCampaignUpdate = data => {
  return data.campaign.body.id;
}


const getMessageCampaignUpdate = data => {
  return data.dispatch.body.message;
}

const getNumberAddBlackList = data => {

  let number = data.customer.phone_number;

  try {
    let phoneNumber = phoneUtil.parseAndKeepRawInput(number, "BR");
    return phoneNumber.getNationalNumber().toString();
  } catch (e) {
    return null;
  }
}



// Listen on port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
