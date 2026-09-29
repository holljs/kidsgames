(function(){
var p=new URLSearchParams(location.search);
var uid=Number(p.get('web_user_id')||p.get('vk_user_id')||localStorage.getItem('user_id')||0);
if(!uid){
 document.body.textContent='Sign in on website to play';
 window.vkBridge={send:function(){return new Promise(function(){})}};
 return;
}
var botToken='SuperSecret_987654321_Token';
window.vkBridge={send:function(m,d){
 if(m==='VKWebAppInit')return Promise.resolve({result:true});
 if(m==='VKWebAppGetUserInfo')return Promise.resolve({id:uid,first_name:'',last_name:''});
 if(m==='VKWebAppTapticImpactOccurred')return Promise.resolve({});
 if(m==='VKWebAppAllowMessagesFromGroup'){
  return fetch('https://neuro-master.online/api/vk/check_subscription/'+uid,{
   headers:{'X-Bot-Token':botToken}
  }).then(function(r){return r.json()}).then(function(data){
   if(data && data.subscribed){ return {result:true}; }
   try{ window.open('https://vk.com/club191367447','_blank'); }catch(e){}
   try{ alert('Подпишитесь на нашу группу в открывшейся вкладке, затем вернитесь сюда и нажмите «Получить 7 дней» ещё раз.'); }catch(e){}
   return {result:false};
  }).catch(function(){ return {result:false}; });
 }
 if(m==='VKWebAppOpenUrl'||m==='VKWebAppOpenURL'){try{window.open(d.url,'_blank')||location.assign(d.url);}catch(e){}return Promise.resolve({result:true});}
 return Promise.resolve({});
}};
})();
