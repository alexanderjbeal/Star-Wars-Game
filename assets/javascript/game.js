//Global variables
$(document).ready(function() {

    //audio clips
    let audio = new Audio('assets/audio/imperial_march.mp3');
    let force = new Audio('assets/audio/force.mp3');
    let blaster = new Audio('assets/audio/blaster-firing.mp3');
    let jediKnow = new Audio('assets/audio/jedi-know.mp3');
    let lightsaber = new Audio('assets/audio/light-saber-on.mp3');
    let rtwoo = new Audio('assets/audio/R2D2.mp3');
    
    //Array of Playable Characters
    let characters = {
        'jyn': {
            name: 'jyn',
            health: 120,
            attack: 6,
            imageUrl: "assets/images/jyn.png",
            counter: 15
        }, 
        'vader': {
            name: 'vader',
            health: 130,
            attack: 9,
            imageUrl: "assets/images/vader.png",
            counter: 15
        }, 
        'jedi': {
            name: 'jedi',
            health: 120,
            attack: 8,
            imageUrl: "assets/images/ninja.png",
            counter: 15
        }, 
        'k2so': {
            name: 'k2so',
            health: 180,
            attack: 7,
            imageUrl: "assets/images/k2so.png",
            counter: 15
        }
    };
    
    var currSelectedCharacter;
    var currDefender;
    var combatants = [];
    var indexofSelChar;
    var attackResult;
    var turnCounter = 1;
    var killCount = 0;
    
    
    var renderOne = function(character, renderArea, makeChar) {
        //character: obj, renderArea: class/id, makeChar: string
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name' style='width:100%'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health' style='width:100%'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
        //Capitalizes the first letter in characters name
        // $('.character').css('textTransform', 'capitalize');
        // conditional render
        if (makeChar == 'enemy') { 
          $(charDiv).addClass('enemy');
        } else if (makeChar == 'defender') {
          currDefender = character;
          $(charDiv).addClass('target-enemy');
        }
      };
    
      // Create function to render game message to DOM
      var renderMessage = function(message) {
        var gameMesageSet = $("#gameMessage");
        var newMessage = $("<div>").text(message);
        gameMesageSet.append(newMessage);
    
        if (message == 'clearMessage') {
          gameMesageSet.text('');
        }
      };
    
      var renderCharacters = function(charObj, areaRender) {
        //render all characters
        if (areaRender == '#characters-section') {
          $(areaRender).empty();
          for (var key in charObj) {
            if (charObj.hasOwnProperty(key)) {
              renderOne(charObj[key], areaRender, '');
            }
          }
        }
        //render player character
        if (areaRender == '#selected-character') {
          // $('#selected-character').prepend("Your Character");       
          renderOne(charObj, areaRender, '');
          $('#attack-button').css('visibility', 'visible');
          $('.intro-container p').css('display', 'none');
          $('.logo').css('display', 'none');
        }
        //render combatants
        if (areaRender == '#available-to-attack-section') {
          $('header').prepend("<p>Select Your Opponent</p>")
          for (var i = 0; i < charObj.length; i++) {
    
            renderOne(charObj[i], areaRender, 'enemy');
          }
          $('header p').each(function() {
            var elem = $(this);
            setInterval(function() {
                if (elem.css('visibility') == 'hidden') {
                    elem.css('visibility', 'visible');
                } else {
                    elem.css('visibility', 'hidden');
                }    
            }, 500);
        });
          //render one enemy to defender area
          $(document).on('click', '.enemy', function() {
            //select an combatant to fight
            name = ($(this).data('name'));
            //if defernder area is empty
            if ($('#defender').children().length === 0) {
              renderCharacters(name, '#defender');
              $(this).hide();
              $('header').css('display','none');
              renderMessage("clearMessage");
              // $('header').prepend("<p>Select Your Opponent</p>")
            }
          });
        }
        //render defender
        if (areaRender == '#defender') {
          $(areaRender).empty();
          for (var i = 0; i < combatants.length; i++) {
            //add enemy to defender area
            if (combatants[i].name == charObj) {
              // $('#defender').append("Your selected opponent")
              renderOne(combatants[i], areaRender, 'defender');
              
            }
          }
        }
        //re-render defender when attacked
        if (areaRender == 'playerDamage') {
          $('#defender').empty();
          // $('#defender').append("Your selected opponent")
          renderOne(charObj, '#defender', 'defender');
          lightsaber.play();
        }
        //re-render player character when attacked
        if (areaRender == 'enemyDamage') {
          $('#selected-character').empty();
          renderOne(charObj, '#selected-character', '');
        }
        //render defeated enemy
        if (areaRender == 'enemyDefeated') {
          $('#defender').empty();
          var gameStateMessage = "You have defeated " + charObj.name + ", choose your next opponent.";
          renderMessage(gameStateMessage);
          $('header').css('display','table');
          $('#gameMessage div').css('width','100%');
          blaster.play();
        }
      };
      
      //this is to render all characters for user to choose their computer
      renderCharacters(characters, '#characters-section');
      $(document).on('click', '.character', function() {
        name = $(this).data('name');
        //if no player char has been selected
        if (!currSelectedCharacter) {
          currSelectedCharacter = characters[name];
          for (var key in characters) {
            if (key != name) {
              combatants.push(characters[key]);
            }
          }
          $("#characters-section").hide();
          renderCharacters(currSelectedCharacter, '#selected-character');
          //this is to render all characters for user to choose fight against
          renderCharacters(combatants, '#available-to-attack-section');
        }
      });
    
    
      // Create functions to enable actions between objects.
      $("#attack-button").on("click", function() {
        //if defernder area has enemy
        if ($('#defender').children().length !== 0) {
          //defender state change
          var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
          renderMessage("clearMessage");
          //combat
          currDefender.health = currDefender.health - (currSelectedCharacter.attack * turnCounter);
          var opponentAnimate = $('#selected-character');
          opponentAnimate.animate({ top: "200px", left: "80px" }, "fast");
    
          //win condition
          if (currDefender.health > 0) {
            //enemy not dead keep playing
            renderCharacters(currDefender, 'playerDamage');
            //player state change
            var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.counter + " damage.";
            renderMessage(attackMessage);
            renderMessage(counterAttackMessage);
    
            currSelectedCharacter.health = currSelectedCharacter.health - currDefender.counter;
            renderCharacters(currSelectedCharacter, 'enemyDamage');
            if (currSelectedCharacter.health <= 0) {
              renderMessage("clearMessage");
              restartGame("You have been defeated...GAME OVER!!!");
              force.play();
              $('#gameMessage div').css('width','100%');
              $("#selected-character").hide();
              $('header').css('display','none');
              $("#attack-button").unbind("click");
              $("#attack-button").hide();
            }
          } else {
            renderCharacters(currDefender, 'enemyDefeated');
            killCount++;
            if (killCount >= 3) {
              renderMessage("clearMessage");
              restartGame("You Won!!!! GAME OVER!!!");
              jediKnow.play();
              $("#attack-button").hide();
              $('#gameMessage div').css('width','100%');
              $('header').css('display','none');
              // The following line will play the imperial march:
              setTimeout(function() {
              audio.play();
              }, 2000);
    
            }
          }
          turnCounter++;
        } else {
          renderMessage("clearMessage");
          renderMessage("No enemy here.");
          rtwoo.play();
        }
      });
    
    //Restarts the game - renders a reset button
      var restartGame = function(inputEndGame) {
        //When 'Restart' button is clicked, reload the page.
        var restart = $('<button class="btn">Restart</button>').click(function() {
          location.reload();
        });
        var gameState = $("<div>").text(inputEndGame);
        $("#gameMessage").append(gameState);
        $("#gameMessage").append(restart);
      };

      $('.intro-container p').each(function() {
        var elem = $(this);
        setInterval(function() {
            if (elem.css('visibility') == 'hidden') {
                elem.css('visibility', 'visible');
            } else {
                elem.css('visibility', 'hidden');
            }    
        }, 500);
    });
    
    });