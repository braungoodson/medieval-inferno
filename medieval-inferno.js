var net = require('net');
var uuid = require('node-uuid');
var locations = [];
locations['The Castle'] = true;
locations['The Town'] = true;
locations['The Outskirts'] = true;
var players = [];
players.length = 0;
var namePool = ["Anderson","Rebbecca","Phung","Kacey","Janina","Evan","Nicholle","Adalberto","Renata","Josefine","Louella","Kimberli","Velma","Raisa","Lavette","Noel","Elenore","Teressa","Tawna","Essie","Alessandra","Bradley","Arianna","Corliss","Zetta","Jake","Rupert","Alissa","Doretta","Afton","Tesha","Earl","Christie","Ileen","Elena","Levi","Palmer","Keshia","Walker","Rosenda","Robby","Norbert","Elaine","Clifford","Sharron","Danial","Krista","Ranee","Annalisa","Janeen","Temika","Becky","Sharice","Lucina","Hettie","Carlota","Margo","Shela","Miguelina","Kittie","Ute","Lona","Rubie","Carmina","Berta","Mariko","Douglas","Hoa","Kristen","Demetra","Toi","Willard","Carole","Tonja","Rona","Mervin","Lanny","Megan","Terri","Diann","Yessenia","Donita","Tobias","Fae","Pennie","Shirlee","Cris","Franklyn","Natisha","Lulu","Benedict","Lieselotte","Hassan","Kieth","Allyn","Jillian","Laverne","Lakeesha","Vicky","Allena","Tona","Joan","Harley","Kandice","Lucienne","Sophie","Linnea","Alishia","Bobette","Mayola","Kathern","Thi","Emilie","Toby","Bertha","Orlando","Katia","Anneliese","Palma","Agnus","Katherine","Cleopatra","Elza","Pete","Judith","Nguyet","Roberto","Janella","Curtis","Vito","Krystyna","Herma","Fairy","Shanelle","Terrence","Lyndsay","Nathanael","Augustus","Samantha","Rosana","Erline","Jere","Rina","Tarah","Charise","Nancie","Delfina","Leatha","Tamala","Sook","Roxy","Zoraida","Juanita","Davina","Krystina","Lucile","Romeo","Kendra","Angeline","Vonnie","Florene","Jay","Tawanna","Sherman","Dennis","Natalia","Jeannette","Hortensia","Kirby","Evia","Lincoln","Alexia","Khalilah","Tonie","Terra","Alberta","Starr","Dexter","Josue","Monte","Patrina","Faviola","Almeta","Man","Seema","Ardath","Kyla","Florine","Keeley","Kylee","Onita","Sharonda","Nenita","Rema","Zulma","Lucila","Ewa","Piper","Corey","Clarence"];
var server = net.createServer(function(connection){
  var player = {
    id: uuid.v4(),
    name: namePool[players.length],
    health: 2,
    gold: 1,
    weapons: {
      sword: {
        damage: 1
      }
    },
    armor: 1,
    location: 'The Town',
    connection: connection,
    kills: 0
  };
  players[player.id] = player;
  players.length++;
  var welcome = getWelcome(player);
  var intro = getIntro();
  process.stdout.write(welcome);
  connection.write(intro);
  connection.write(welcome);
  if (players.length > 1) {
    connection.write('You may not be alone.\n');
  } else {
    connection.write('You are alone.\n');
  }
  connection.write(getPrompt(player));
  connection.on('data',function(d){
    if (d.toString().length > 1) {
      parse(connection,d.toString(),player);
    }
    connection.write(getPrompt(player));
  });
  connection.on('end',function(){
    process.stdout.write(getFarewell(player));
    delete players[player.id];
  });
});
server.maxConnections = 199;
server.listen(10000,function(){
  process.stdout.write(getIntro());
  process.stdout.write('* Server alive on 10000.\n')
});
function getPrompt (player) {
  return '\033[31m'+player.name+'> \033[0m';
}
function getFarewell (player) {
  return '\033[90mFarewell, '+player.name+'.\n';
}
function getWelcome (player) {
  return '\033[34mWelcome, '+player.name+'\033[0m.\n';
}
function getIntro () {
  return '\033[101m \033[101m \033[41m \033[41m \033[0m\033[7m Medieval Inferno \033[0m\n';
}
function getHelp (player) {
  return 'help\ncharacter\nlocation\nattack <playerName>\ngo to <locationName>\ntrade gold for armor\ndiscover\n';
}
function getCharacter (player) {
  var c = '';
  c += '   Name: ' + player.name + '\n';
  c += ' Health: ' + player.health + '\n';
  c += '   Gold: ' + player.gold + '\n';
  c += ' Weapon: Sword: Damage: 1\n';
  c += '  Armor: ' + player.armor + '\n';
  return c;
}
function getLocation (player) {
  return 'You are in '+player.location+'.\n';
}
function attack (player,opponentName) {
  process.stdout.write(player.name + ' tries to attack ' + opponentName + '.\n');
  var opponent = null;
  for (var i in players) {
    if (players[i].name == opponentName) {
      opponent = players[i];
      process.stdout.write(opponent.name + ' exists.\n');
    }
  }
  if (opponent) {
    if (opponent.name == player.name) {
      process.stdout.write(player.name+' tries to commit suicide.\n');
      player.connection.write('You cannot commit suicide.\n');
    } else {
      if (player.location == opponent.location) {
        if (opponent.health && player.health) {
          if (opponent.armor) {
            opponent.armor = opponent.armor - player.weapons.sword.damage;
          } else {
            opponent.health = opponent.health - player.weapons.sword.damage;
          }
          if (opponent.health) {
            process.stdout.write(player.name+' attacks '+opponent.name+'.\n');
            player.connection.write('You have delt ' + player.weapons.sword.damage + ' damage to ' + opponent.name + '!\n');
            opponent.connection.write('\nYou have taken ' + player.weapons.sword.damage + ' damage by ' + player.name + '!\n');
            opponent.connection.write(getPrompt(opponent));
          } else {
            process.stdout.write(player.name+' slaughters '+opponent.name+', and now has '+player.kills+' kills.\n');
            player.connection.write('You have slaughtered ' + opponent.name + '. You loot their '+opponent.gold+' gold.\n');
            player.gold += opponent.gold;
            opponent.gold = 0;
            player.kills++;
            opponent.connection.write('\nYou have been slaughtered by ' + player.name + ', and they looted your gold.\n');
            opponent.connection.write(getPrompt(opponent));
          }
        } else if (!player.health) {
          process.stdout.write(player.name+' tries to harm '+opponent.name+', but '+player.name+' is a ghost.\n');
          player.connection.write('You cannot harm ' + opponent.name + '. You are a ghost.\n');
          opponent.connection.write('\n'+player.name + ' tried to harm you, but they are a ghost.\n');
          opponent.connection.write(getPrompt(opponent));        
        } else {
          process.stdout.write(player.name+' tries to harm '+opponent.name+', but they are a ghost.\n');
          player.connection.write('You cannot harm ' + opponent.name + '. They are a ghost.\n');
          opponent.connection.write('\n'+player.name + ' tried to harm you, but you are a ghost.\n');
          opponent.connection.write(getPrompt(opponent));
        }
      } else {
        process.stdout.write(player.name+' tries to harm '+opponent.name+', but they are too far away.\n');
        player.connection.write('That player is too far away.\n');
      }
    }
  } else {
    process.stdout.write(player.name+' tries to harm '+opponent.name+', but they do not exist.\n');
    player.connection.write('That player does not exist.\n');
  }
}
function goTo (player,location) {
  if (locations[location]) {
    player.location = location;
    process.stdout.write(player.name+' goes to '+location+'.\n');
    player.connection.write('You are now in '+location+'.\n');
  } else {
    process.stdout.write(player.name+' tries to go to '+location+', but it does not exist.\n');
    player.connection.write(location+' does not exist.\n');
  }
}
function tradeGoldForArmor (player,t) {
  if (player.location == 'The Town') {
    if (player.gold >= 2) {
      process.stdout.write(player.name+' trades gold for armor.\n');
      player.connection.write('You trade gold for armor.\n');
      player.gold = player.gold - 2;
      player.armor++;
    } else {
      process.stdout.write(player.name+' tries to trade gold for armor, but they don\'t have the gold.\n');
      player.connection.write('You cannot trade gold for armor, you are not in The Town.\n');     
    }
  } else {
    process.stdout.write(player.name+' tries to trade gold for armor, but they are not in The Town.\n');
    player.connection.write('You cannot trade gold for armor, you are not in The Town.\n');
  }
}
function discover (player) {
  var p = '';
  for (var i in players) {
    if ((players[i].location == player.location) && (players[i].name != player.name)) {
      p += players[i].name + ' ';
    }
  }
  if (p != '') {
    player.connection.write('You can see: '+p+'\n');
    player.connection.write('You can go to The Castle, The Town, The Outskirts\n');
  } else {
    player.connection.write('You can see no one.\n');
    player.connection.write('You can go to The Castle, The Town, The Outskirts\n');
  }
}
function parse (connection,data,player) {
  if (data.match(/help/g)) {
    connection.write(getHelp(player));
  } else if (data.match(/character/g)) {
    connection.write(getCharacter(player));
  } else if (data.match(/location/g)) {
    connection.write(getLocation(player));
  } else if (data.match(/attack/g)) {
    attack(player,data.slice(7,data.length-1));
  } else if (data.match(/go to/g)) {
    goTo(player,data.slice(6,data.length-1));
  } else if (data.match(/trade gold for armor/g)) {
    tradeGoldForArmor(player);
  } else if (data.match(/discover/g)) {
    discover(player);
  }
}
