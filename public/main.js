
//******************************GLOBAL VARIABLES*******************************
      var user = null;
      var opponent = null;
      var session = null;
      var winLimit = 3;
      var usedChallenges = [];
      var roundNumber = 1;
      var challenge = null;
      var host = false;
      var userFirepad = null;
      var opponentFirepad = null;
      var userFirepadReady = false;
      var opponentFirepadReady = false;
      var userWins = 0;
      var opponentWins = 0;
      var codeMirror1 = null;
      var codeMirror2 = null;
      var powrRefUser = null;
      var powrRefOpponent = null;


      function resetGlobals(){
         opponent = null;
         session = null;
         winLimit = 3;
         usedChallenges = [];
         roundNumber = 1;
         challenge = null;
         host = false;
         userFirepad = null;
         opponentFirepad = null;
         $("#firepad1").html("");
         $("#firepad2").html("");
         if(user){
           FB("/users/" + user.id + "/code").set(null);
         };
         userFirepadReady = false;
         opponentFirepadReady = false;
         userWins = 0;
         opponentWins = 0;
         codeMirror1 = null;
         codeMirror2 = null;
         powrRefUser = null;
         powrRefOpponent = null;
      }

      //Challenges data
      var challenges = [
        {"name": "String Reverse",
        "text": "Input: A string.\nReturn: The reverse of the string.\nHint: None.",
        "header": "function(string){\n\n}",
        "testcases":
          [
            {
              "input": "abcdefg",
              "output": "gfedcba"
            },
            {
              "input": "hello  world",
              "output": "dlrow  olleh"
            }
          ]
        },
        {"name": "Missing No.",
        "text": "Input: An randomized array of unique integers from 1 to some N. BUT! There is one integer missing.\nReturn: The missing integer.\nHint: N = (array.length + 1)",
        "header": "function(array){\n\n}",
        "testcases":
         [
            {
              "input": [6,9,3,4,5,1,2,10,8],
              "output": 7
            },
            {
              "input": [1,2,3,4,5,6,7,8,9,10,15,14,13,12,16],
              "output": 11
            }
          ]
        },
        {"name": "High Prime",
        "text": "Input: An integer N.\nReturn: The largest prime less than or equal to the input.\nHint: None",
        "header": "function(n){\n\n}",
        "testcases":
          [
            {
              "input":  1000,
              "output": 997
            },
            {
              "input": 3,
              "output": 3
            },
            {
              "input": 56345,
              "output": 56333
            }
          ]
        } ,
        {"name": "Linear Combo",
        "text": "Input: An object ints with fields ints.x, ints.y, and ints.z.\nReturn: True if z is a linear combination of x and y. False otherwise.\nHint: z is a linear combination of x and y if and only if Ax + By = z for some integers A and B.",
        "header": "function(ints){\n\n}",
        "testcases":
          [
            {
              "input": {x: 2, y: 4, z: 19},
              "output": false
            },
            {
              "input": {x: 3, y: 16, z: 19},
              "output": true
            },
            {
              "input": {x: 14, y: 17, z: 262},
              "output": true
            },
            {
              "input": {x: 104, y: 109, z: 200},
              "output": true
            }
          ]
        },
        {"name": "X-Clusters",
        "text": "Input: A string.\nOutput: The number of clusters (any size) of the letter 'x'. \nHint: So \"xxyxabxxxhellox\" would return 4. ",
        "header": "function(string){\n\n}",
        "testcases":
          [
            {
              "input": "xxyxabcxxxhellox",
              "output": 4
            },
            {
              "input": "xxxxxxxxxx",
              "output": 1
            },
            {
              "input": "xxxxxabcxxxxx",
              "output": 2
            },
            {
              "input": "aaaaa4x4aaaaaaa",
              "output": 1
            },
            {
              "input": "abcdefg",
              "output": 0
            }
          ]
        } 
      ]

      //Powr hash
      var powrs = {
        "Freeze" : function(isVictim){
          $("#user-cover").clearQueue();
          $("#opponent-cover").clearQueue();
          if(isVictim){
            codeMirror1.getInputField().blur();
            $("#user-cover").show();
            $("#user-cover").css({"background-color":"#68E","opacity":".4"});
            $("#user-cover").animate({
                opacity: 0
              }, 5000, function() {
                $("#user-cover").hide();
              });
          }
          else{
           $("#opponent-cover").css({"background-color":"#68E","opacity":".4"})
           $("#opponent-cover").animate({
                opacity: 0
              }, 5000, function() {
                // Animation complete.
              });
          }
        },
        "Shrink Ray" : function(isVictim){
          $("#firepad2 .CodeMirror").clearQueue();
          $("#firepad2 .CodeMirror").clearQueue();
          if(isVictim){
            $("#firepad1 .CodeMirror").css({"font-size":"1px"});
            $("#firepad1 .CodeMirror").animate({
                "font-size": 14
              }, 10000, function() {
                $("#user-cover").hide();
              });
          }
          else{
            $("#firepad2 .CodeMirror").css({"font-size":"1px"});
            $("#firepad2 .CodeMirror").animate({
                "font-size": 14
              }, 10000, function() {
                // Animation complete.
              });
          }
        },
        "Magnifier" : function(isVictim){
          $("#firepad2 .CodeMirror").clearQueue();
          $("#firepad2 .CodeMirror").clearQueue();
          if(isVictim){
            $("#firepad1 .CodeMirror").css({"font-size":"40px"});
            $("#firepad1 .CodeMirror").animate({
                "font-size": 14
              }, 10000, function() {
                $("#user-cover").hide();
              });
          }
          else{
            $("#firepad2 .CodeMirror").css({"font-size":"40px"});
            $("#firepad2 .CodeMirror").animate({
                "font-size": 14
              }, 10000, function() {
                // Animation complete.
              });
          }
        }
      }

//****************************UI FUNCTIONS**************************************
      $(document).ready(function () {   
        $(window).resize(function () {
          if (!$('#dialog-box').is(':hidden')) popup();
        });
        $(window).scroll(function () {
          if (!$('#dialog-box').is(':hidden')) popup();
        });
      });
 
      function close_popup() {
        $('#dialog-overlay, #dialog-box').fadeOut('fast');       
        return false;
      }

      function popup(message) {
          var maskHeight = window.innerHeight;
          var outerHeight = $(document).height();
          var maskWidth = $(window).width();

          $('#dialog-message').html(message);

          var dialogTop =  $(window).scrollTop() + (maskHeight/2) - ($('#dialog-box').height()/2);
          var dialogLeft = (maskWidth/2) - ($('#dialog-box').width()/2);
           
          $('#dialog-overlay').css({height:outerHeight, width:maskWidth}).fadeIn('fast');
          setTimeout( function() {
              $('#dialog-box').css({top:dialogTop, left:dialogLeft}).fadeIn('fast');
          }, 100);
      }

      function transition(callback,seconds,message){
        popup("<div style='padding:30px;font-size:40px;'>" + (message ? message : "") + "</div><div style='width:30px;padding-bottom:20px;font-size:100px;margin:0 auto;'>" + seconds + "</div>");
        var timer = setInterval(function(){
          seconds--;
          popup("<div style='padding:30px;font-size:40px;'>" + (message ? message : "") + "</div><div style='width:30px;padding-bottom:20px;font-size:100px;margin:0 auto;'>" + seconds + "</div>");
          if(seconds < 1){
            clearInterval(timer);
            setTimeout(function(){close_popup()},100);
            callback();
          }
        }, seconds * 300);
      }
      
      function updateScreen(clear) {
        if(clear){
          clearScreen();
        }
        
        getWins(session.id, user.id, function(wins){
          userWins = wins;
          //challenge = challenges[challengeNameToIndex(getCurrentRound().challengeName)];
          getWins(session.id, opponent.id, function(wins){
            opponentWins = wins;
            $("#your_name").html(user.name);
            $("#their_name").html(opponent.name);
            $("#challenge-name").html(getCurrentRound().challengeName);
            $("#challenge-text").html(challenge.text);
            $("#user-wins").html(userWins);
            $("#opponent-wins").html(opponentWins);
          });
        });
      }

      function clearScreen() {
        if(userFirepadReady){
          if(challenge){
            userFirepad.setText("");
            userFirepad.setText(challenge.header);
          }
          else{
            userFirepad.setText("");
          }
        }
        
      }


//*****************************UTILITY FUNCTIONS*******************************
        function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
      };

      function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
      }

//*****************************CLASSES*************************************
      function User(id,name,wins,losses){
        var self = this;
        self.id = id;
        self.name = name;
        self.wins = wins;
        self.losses = losses;
      }

//*****************************FIREBASE FUNCTIONS*******************************
      function FB(path){
        return new Firebase("https://streetcodr.firebaseio.com" + path);
      }
      
      //Get the number of wins for that user in that session
      function getWins(sessionId, userId, callback){
        FB('/session/' + sessionId).once('value', function(data) {
          var wins=0;
          for(var i = 1; i<=5; i++){
            var round = data.val().round[i.toString()];
            if(round != undefined){
              var roundWinner = round.winner;
              if(userId == roundWinner){
                wins++;
              }  
            }            
          }  
          callback(wins);
        });
      }
      
      function isSessionOver(callback){
        getWins(session.id,user.id, function(wins){
          if(wins >= winLimit){
            //we're done
            callback(true,user.id);
          }
          else{
            getWins(session.id, opponent.id, function(wins){
              if(wins>=winLimit){
                //we;re done
                callback(true,opponent.id);
              }
              else{
                //shit ain't over
                if(session.round && session.round[getCurrentRound().id-1]){
                  callback(false,session.round[getCurrentRound().id-1].winner);
                }
                else{
                  callback(false);
                }
                
              }
            });
          }
        });
      }

      //Set opponent by id
      function setOpponent(id, callback){
        FB('/users/' + id).once('value', function(data) {
          opponent = data.val();
          opponent.id = id;
          callback();
        });
      }

      function getCurrentUser(callback){
        if($.cookie("userId")!=null) {
          var id = $.cookie("userId");
          FB("/users/" + id).once('value', function(data) {
            user = new User(id,data.val().name,data.val().wins,data.val().losses);
            callback(user);
          });          
        }
        else {
          callback(null);
        }
      }

      function newUser(id,name){
        user = new User(id,name,0,0);
        $.cookie("userId",id);
        FB("/users/" + id + "/name").set(name);
        FB("/users/" + id + "/wins").set(0);
        FB("/users/" + id + "/losses").set(0);
      }

      function addUserToQueue(callback) {
        FB("/queue").set(user.id);
        callback();
      }

      function getUserFromQueue(callback) {
        FB("/queue").once('value', function(data){
          FB("/queue").set(null);
          callback(data.val());
        });
      }

 //***************************MODALS********************************
      function showMatchModal(){
        $("#firepad1").html("");
        $("#firepad2").html("");
        popup($("#new-match-modal").clone());
        $("#new-match-modal #name").html(user.name);
        $("#new-match-modal #wins").html(user.wins);
        $("#new-match-modal #losses").html(user.losses);
        $("#new-match-modal button").click(function(){
          getOpponent();
        });
      }

      function askUserForName(callback){
        var id = guid();
        popup($("#user-name-modal").clone());
        $("#user-name-modal button").click(function(){
          var name = $("#name").val();
          newUser(id,name,0,0);
          callback();
        });
      }

      function showEndMatchModal(winnerId){
        popup($("#end-match-modal").clone());
        if(winnerId == user.id) {
          $("#end-match-modal #name").html(user.name);
          FB('/users/'+user.id+'/wins').set(++user.wins);
        }
        else {
          $("#end-match-modal #name").html(opponent.name);
          FB('/users/'+user.id+'/losses').set(++user.losses);
        }
        $("#end-match-modal button").click(function(){
          showMatchModal();
        });
      }

//***************************GAME ENGINE********************************
     function submitCode(){
        var code = userFirepad.getText();
        var right = false;
        var error = false;
        try{
          right = evaluate(code);
        }
        catch (err){
          alert(err);
          error = true;
        }
       if(right){
         nextRound(session.id,getCurrentRound().id,user.id);
       }
       else if(!error){
        alert("you are wrong and should be punished");
       }
     }

      function getCurrentRound(){
        rounds = session.round;
        for(var r in rounds){
          var round = r;
        }
        var badVariableName = rounds[round];
        badVariableName.id = round;
        return badVariableName;
      }

      function createSession(opponentId){
        var firepadRef1 = FB('/users/' + user.id + '/code');
        codeMirror1 = CodeMirror(document.getElementById('firepad1'), { lineWrapping: true,lineNumbers: true });
        userFirepad = Firepad.fromCodeMirror(firepadRef1, codeMirror1,
            { richTextShortcuts: true, richTextToolbar: false });
        userFirepad.on('ready', function() {
                userFirepadReady = true;
              });
        var firepadRef2 = FB('/users/' + opponentId + "/code");
        codeMirror2 = CodeMirror(document.getElementById('firepad2'), { lineWrapping: true,lineNumbers: true });
        opponentFirepad = Firepad.fromCodeMirror(firepadRef2, codeMirror2,
            { richTextShortcuts: true, richTextToolbar: false });
       opponentFirepad.on('ready', function() {
                opponentFirepadReady = true;
              });
        var sessionId = guid();
        var sessionRef = FB('/session/' + sessionId);
    
        var userRef = sessionRef.child('/users/'+user.id);
        var oppRef = sessionRef.child('/users/'+opponentId);
        
        var host = true;
        close_popup();
        
        setOpponent(opponentId,function(){
          //Initialize their powr  to empty
          
          powrRefUser = userRef.child('powrs');
          powrRefOpponent = oppRef.child('powrs');
          
          powrRefUser.child('Freeze').set(0);
          powrRefUser.child('Shrink Ray').set(0);
          powrRefUser.child('Magnifier').set(0);
          powrRefUser.child('powrUsed').set(null);
          powrRefOpponent.child('Freeze').set(0);
          powrRefOpponent.child('Shrink Ray').set(0);
          powrRefOpponent.child('Magnifier').set(0);
          powrRefOpponent.child('powrUsed').set(null);

          var swi2 = false;
          powrRefOpponent.child('powrUsed').on('value',function(data){
            if(swi2 == false){
              swi2 = true;
            }
            else{

              
              oppPowrs = data.val();
              
              updateScreen();
              
              if(oppPowrs != null){ //Opponent just used a powr!!11!1one
                
                usePowrOnSelf();
                
                powrRefOpponent.child('powrUsed').set(null);
              }
            }
          });
          
          
          //Clear variables;
          usedChallenges = [];
          roundNumber = 0; 
          challenge = null;
                      
          setTimeout(function(){nextRound(sessionId, roundNumber)},100);
        });
      }
      
      function getPowrUsed(callback){
        powrRefOpponent.child('powrUsed').once('value', function(data){
            callback(data.val());
          });
      };
      
      function usePowrOnSelf(){
      
        getPowrUsed(function(name){
        
          powrs[name](true);
        
        });
      
      }
      
      //Initialize the next round
      //If winnerId is null, it's the first round! Yay!
      //Also handles the end of the game (if wins for winner > winLimit)
      function nextRound(sessionId, roundNumber, winnerId){
        roundNumber++;
        if(roundNumber == 1){ //It's the first round
            challenge = getChallenge();
            usedChallenges.push(challenge.name);
            FB('/session/' + sessionId + '/round/' + roundNumber + '/challengeName').set(challenge.name);
            FB('/session/' + sessionId).once('value',function(data){
                  session = data.val();
                  session.id = data.name();
                  updateScreen(true);
                    //HOLEE SHEET PROB BETTER DELTET THIS****************************************/
            var rounds = FB("/session/" + session.id + "/round");
                  rounds.on("child_added",function(round){
                    FB("/session/" + session.id).once("value",function(data){
                          session = data.val();
                          session.id = data.name();
                    isSessionOver(function(isOver,winnerId){
                      if(isOver){
                        rounds.off();
                        showEndMatchModal(winnerId);
                      }
                      else{
                        challenge = challenges[challengeNameToIndex(getCurrentRound().challengeName)];
                        FB("/session/" + session.id).once("value",function(data){
                          session = data.val();
                          session.id = data.name();

                          transition(function(){
                            updateScreen(true);
                            //go back to queue if user isn't there
                            setTimeout(function(){ 
                              if(opponentFirepad.getText().trim().length < 2){
                                rounds.off();
                                transition(function(){
                                  getOpponent();
                                  //todo
                                },3,"Opponent disconnected.");
                              }

                            },2000);
                           },3,getCurrentRound().id > 1 ?  (winnerId == user.id ? user.name : opponent.name) + " won! Next round in..." : "Found opponent! Starting in...");
                        }); 
                      }
                    });
                 });
                  });
            //*************************************************************//
                  });
        }
        else{
          FB('/session/' + session.id + '/round/' + (roundNumber - 1) + '/winner').set(winnerId);
          getWins(sessionId, winnerId,function(wins){
            if( wins >= winLimit){
              //session over!
              //showEndMatchModal(winnerId);
              FB('/session/' + sessionId + '/round/end').set("1");
            }
            else{ //Not the last round yet

                challenge = getChallenge();
                usedChallenges.push(challenge.name);
                FB('/session/' + sessionId + '/round/' + roundNumber + '/challengeName').set(challenge.name);
                FB('/session/' + sessionId).once('value',function(data){
                  session = data.val();
                  session.id = data.name();
                  updateScreen(true,winnerId);
                  });
            }   
          });
        }
        
      }
      
      function usePowr(name){
        //TODO
         $("#canttouchthis").show();
          $("#canttouchthis").css({"background-color":"#CCC","opacity":".9"});
          $("#canttouchthis").animate({
              opacity: 0
            }, 20000, function() {
              $("#canttouchthis").hide();
            });
        powrs[name](false);
        powrRefUser.child('powrUsed').set(name);
      }
      
      //Turn the name of a challenge into its index
      function challengeNameToIndex(name){
        
        for(var i in challenges){
          if(challenges[i].name == name){
            return i;
          }
        }
        return null;
      }
      
      //Get a random, not-yet-used challenge
      function getChallenge(){
        
        var index = Math.round(Math.random() * (challenges.length - 1));
        
        while(usedChallenges.indexOf(challenges[index].name) >= 0){
          index = Math.round(Math.random() * (challenges.length - 1));
        }
        
        return challenges[index];
        
      }
      

      function getOpponent(){
        if(session){
          FB("/session/" + session.id).set(null);
        }
        resetGlobals();
        getUserFromQueue(function(opponentId){
          if(!opponentId) {
            addUserToQueue(waitForSession);
          }
          else if(opponentId != user.id){
            createSession(opponentId);
          }
          else{
            addUserToQueue(waitForSession);
          }
        });  
      }

      function waitForSession() {
        close_popup();
        popup("<div style='text-align:center;height:320px;width:400px;'><div style='padding-top:120px;font-size:30px;'>Waiting...</div></div>");
        var sessionRef = FB("/session");
        sessionRef.once('child_changed',function(new_session){
          close_popup();
            new_session.id = new_session.name();
            session = {id: new_session.id};
            var users = new_session.val().users;
            for(var i in users){
              if(i!=user.id){
                setOpponent(i,function(){
                powrRefUser = FB('/session/' + new_session.id + '/users/' + user.id + '/powrs');
                powrRefOpponent = FB('/session/' + new_session.id + '/users/' + opponent.id + '/powrs');
                var swi = false;
                powrRefOpponent.child('powrUsed').on('value',function(data){
                  if(swi == false){
                    swi = true;
                  }
                  else{
                   
                    oppPowrs = data.val();           
                    updateScreen();
                    
                    if(oppPowrs != null){ //Opponent just used a powr!!11!1one
                      
                      
                      usePowrOnSelf();
                      
                      powrRefOpponent.child('powrUsed').set(null);
                    }
                  }
                  
                
                });
                var firepadRef1 = FB('/users/' + user.id + '/code');
                codeMirror1 = CodeMirror(document.getElementById('firepad1'), { lineWrapping: true,lineNumbers: true });
                userFirepad = Firepad.fromCodeMirror(firepadRef1, codeMirror1,
                    { richTextShortcuts: true, richTextToolbar: false });
                userFirepad.on('ready', function() {
                  userFirepadReady = true;
                });
                var firepadRef2 = FB('/users/' + opponent.id + "/code");
                codeMirror2 = CodeMirror(document.getElementById('firepad2'), { lineWrapping: true,lineNumbers: true });
                opponentFirepad = Firepad.fromCodeMirror(firepadRef2, codeMirror2,
                   { richTextShortcuts: true, richTextToolbar: false });
                opponentFirepad.on('ready', function() {
                  opponentFirepadReady = true;
                });
                  var rounds = FB("/session/" + new_session.id + "/round");
                  rounds.on("child_added",function(round){
                    FB("/session/" + new_session.id).once("value",function(data){
                      session = data.val();
                            session.id = data.name();
                      isSessionOver(function(isOver,winnerId){
                        if(isOver){
                          rounds.off();
                          showEndMatchModal(winnerId);
                        }
                        else{
                          challenge = challenges[challengeNameToIndex(getCurrentRound().challengeName)];
                          FB("/session/" + new_session.id).once("value",function(data){
                            session = data.val();
                            session.id = data.name();
                            transition(function(){
                             updateScreen(true);
                            },3, getCurrentRound().id > 1 ?  (winnerId == user.id ? user.name : opponent.name) + " won! Next round in..." : "Found opponent! Starting in...");
                          });
                        }
                      });
                    });
                  });
              });
            }
          }
      });
      }

      function evaluate(code){
        var type = "";
          type = eval("typeof("+code+")");

        if(type!="function"){
          return false;
        }
        for(var i in challenge.testcases){
          eval("var __evaluator = " + code);
          if(__evaluator(challenge.testcases[i].input) != challenge.testcases[i].output) {
            return false;
          }
        }
        return true;
      }

//******************************INITIALIZATION***********************************
      $(function(){
        getCurrentUser(function(user){
          if(!user){
            askUserForName(showMatchModal);
          }
          else{
            showMatchModal();
          }
        });
      });