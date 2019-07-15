
function getToday() {
  var time = new Date(Date.now());
  return String(time.getUTCFullYear()) + "-" + String(time.getUTCMonth()) + "-" + String(time.getUTCDate());
}

function logExcept(ip, uid) {
  if (ip == "219.71.71.31") {
    return true;
  }
  if (uid == "YfFW0jyRmgNVVqD9686CNAvNgk43") {
    return true;
  }
  return false;
}

function getOS() {
  var ss = window.navigator.userAgent;
  var idx_l = ss.indexOf("(")
  var idx_r = ss.indexOf(")")
  var os = ss.substring(idx_l+1, idx_r)
  
  return os
}

async function add_doc(resp) {  
  // Return type: Promise
  // Response type: firebase.firestore.DocumentReference
  
  var user = firebase.auth().currentUser;
  var uid = "Custom";
  if (user) {
    uid = user.uid;
  }
  
  if (logExcept(resp.ip, uid)) {
    return Promise.resolve("Log except myself.");
  }
  
  
  var doc_name = resp.ip + "_" + uid;
  var today = getToday();
  
  
  // Check/Create new today's document to log.
  var userCollection;
  var db = firebase.firestore();
  var docRef = db.collection("IP_Geo_Info").doc(today);
  await docRef.get()
    .then(function(doc) {
      if (!doc.exists) {
        docRef = db.collection("IP_Geo_Info").doc(today);
      }
      userCollection = docRef.collection(resp.ip);
      docRef.set({time: firebase.firestore.FieldValue.serverTimestamp()});
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
    },
    device: {
      device_name: WURFL.complete_device_name,
      is_mobile: WURFL.is_mobile,
      os: getOS()
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
      console.log("Success: ", resp);
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
      //record(ip);
    }
  };
  xp.open("GET", "https://api.ipify.org", true);
  xp.send();
});



function dynamicallyLoadScript(url) {
    var script = document.createElement("script"); 
    script.src = url; 
    script.async = false;
    document.head.appendChild(script); 
}

/** For detecting platform type. 
*   Returns: object<WURFL>
*   WRUFL field:
*     complete_device_name => (Mozilla Firefox, Google Chrome, Microsoft Edge, ....)
*     form_factor => (Desktop, ...)
*     is_mobile => true/false
*/
dynamicallyLoadScript("https://wurfl.io/wurfl.js");




