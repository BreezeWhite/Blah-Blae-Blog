
function getToday() {
  var time = new Date(Date.now());
  return String(time.getUTCFullYear()) + "-" + String(time.getUTCMonth()) + "-" + String(time.getUTCDate());
}


async function add_doc(resp) {  
  // Return type: Promise
  // Response type: firebase.firestore.DocumentReference
  
  var user = firebase.auth().currentUser;
  var uid = "Custom";
  if (user) {
    uid = user.uid;
  }
  
  var doc_name = resp.ip + "_" + uid;
  var today = getToday();
  
  
  // Check/Create new today's document to log.
  var userCollection;
  var db = firebase.firestore();
  var docRef = db.collection("IP_Geo_Info").doc(today);
  await docRef.get()
    .then(function(doc) {
      if (doc.exists) {
        userCollection = doc.collection(resp.ip);
      } else {
        userCollection = db.collection("IP_Geo_Info").doc(today).collection(resp.ip);
      }
    })
    .catch(function(error) {
      return Promise.reject(`Fail to get/create today's document: ${error}`);
    });
  
  
  var info = {
    uid: uid,
    lastViewed: new Date(Date.now()).toUTCString(),
    info: {
      ip:         resp.ip,
      country:    resp.location.country,
      region:     resp.location.region,
      city:       resp.location.city,
      lat:        resp.location.lat,
      lng:        resp.location.lng,
      postalCode: resp.location.postalCode,
      timezone:   resp.location.timezone
    }
  };
  
  var promise;
  docRef = userCollection.doc(uid);
  await docRef.get()
    .then(function(doc) {
      if (doc.exists) {
        promise = docRef.update({lastViewed: new Date(Date.now()).toUTCString()});
      } else {
        promise = userCollection.doc(uid).set(info);
      }
    })
    .catch(function(error) {
      return Promise.reject(`Fail when checking UID within same IP: ${error}`);
    });
  
  
  return promise;
}


function record(ip) {
  var url = "https://geo.ipify.org/api/v1?apiKey=at_UJbGfUcA2SX1gK7PuBWRzJYRqcaXP&ipAddress="+ip;
  $.getJSON(url)
    .then(add_doc)
    .then(function(resp) {
      console.log("Successfully logged geo info.");
    })
    .fail(function(error) {
      console.error("Fail to log geometry information: ", error);
    });
}

$(document).ready(function() {
  var xp = new XMLHttpRequest();
  xp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var ip = this.response;
      record(ip);
    }
  };
  xp.open("GET", "//api.ipify.org", true);
  xp.send();
});



