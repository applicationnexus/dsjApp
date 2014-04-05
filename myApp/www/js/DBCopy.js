/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */


var DBCopy = {
    
copyFile: function (successCallback, errorCallback, filename) {
    
    console.log("Filename = "+filename);
    return cordova.exec(successCallback,errorCallback,"DBCopy","copyDBtoDocDir",[filename]);
},

shareDialog: function(success,error,options){
       console.log("Share Dialog");
    return cordova.exec(success,error,"DBCopy","sharetoFB",[options]);
},
    
tweetSetup: function(response){
    console.log("Twitter Setup");
    return cordova.exec(response,null,"DBCopy","checkTwitter",[]);
    //console.log
},

tweetNow: function(success,failure,options){
    var defaults= {text:"@pangeaguides",urlAttach:"",imageAttach:""};
    if(options)
    {
        for (var key in defaults){
            defaults[key]=options[key];
        }
    }
    console.log("Options = "+JSON.stringify(options));
    return cordova.exec(success,failure,"DBCopy","tweetDialog",[defaults]);
}
    
};