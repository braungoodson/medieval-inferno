var net = require('net');
var uuid = require('node-uuid');
var players = [];
players.length = 0;
var namePool = ["Anderson","Rebbecca","Phung","Kacey","Janina","Evan","Nicholle","Adalberto","Renata","Josefine","Louella","Kimberli","Velma","Raisa","Lavette","Noel","Elenore","Teressa","Tawna","Essie","Alessandra","Bradley","Arianna","Corliss","Zetta","Jake","Rupert","Alissa","Doretta","Afton","Tesha","Earl","Christie","Ileen","Elena","Levi","Palmer","Keshia","Walker","Rosenda","Robby","Norbert","Elaine","Clifford","Sharron","Danial","Krista","Ranee","Annalisa","Janeen","Temika","Becky","Sharice","Lucina","Hettie","Carlota","Margo","Shela","Miguelina","Kittie","Ute","Lona","Rubie","Carmina","Berta","Mariko","Douglas","Hoa","Kristen","Demetra","Toi","Willard","Carole","Tonja","Rona","Mervin","Lanny","Megan","Terri","Diann","Yessenia","Donita","Tobias","Fae","Pennie","Shirlee","Cris","Franklyn","Natisha","Lulu","Benedict","Lieselotte","Hassan","Kieth","Allyn","Jillian","Laverne","Lakeesha","Vicky","Allena","Tona","Joan","Harley","Kandice","Lucienne","Sophie","Linnea","Alishia","Bobette","Mayola","Kathern","Thi","Emilie","Toby","Bertha","Orlando","Katia","Anneliese","Palma","Agnus","Katherine","Cleopatra","Elza","Pete","Judith","Nguyet","Roberto","Janella","Curtis","Vito","Krystyna","Herma","Fairy","Shanelle","Terrence","Lyndsay","Nathanael","Augustus","Samantha","Rosana","Erline","Jere","Rina","Tarah","Charise","Nancie","Delfina","Leatha","Tamala","Sook","Roxy","Zoraida","Juanita","Davina","Krystina","Lucile","Romeo","Kendra","Angeline","Vonnie","Florene","Jay","Tawanna","Sherman","Dennis","Natalia","Jeannette","Hortensia","Kirby","Evia","Lincoln","Alexia","Khalilah","Tonie","Terra","Alberta","Starr","Dexter","Josue","Monte","Patrina","Faviola","Almeta","Man","Seema","Ardath","Kyla","Florine","Keeley","Kylee","Onita","Sharonda","Nenita","Rema","Zulma","Lucila","Ewa","Piper","Corey","Clarence"];
var server = net.createServer(function(connection){
  var player = {
    id: uuid.v4(),
    name: namePool[Math.floor(Math.random()*199)],
    health: 10,
    gold: 1,
    weapons: {
      sword: {
        damage: 1
      }
    },
    armor: 1,
    help: 0
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
  connection.write(getPrompt());
  connection.on('data',function(d){
    if (d.toString().length > 1) {
      parse(connection,d.toString(),player);
    }
    connection.write(getPrompt());
  });
  connection.on('end',function(){
    process.stdout.write(getFarewell(player));
    delete players[player.id];
  });
});
server.listen(10000,function(){
  process.stdout.write(getIntro());
  process.stdout.write('* Server alive on 10000.\n')
});
function getPrompt () {
  return '\033[31m--> \033[0m';
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
  return '- Commands:\n\thelp\n\tcharacter\n';
}
function getCharacter (player) {
  return JSON.stringify(player,null,2)+'\n';
}
function parse (connection,data,player) {
  if (data.match(/help/g)) {
    connection.write(getHelp(player));
  }
  if (data.match(/character/g)) {
    connection.write(getCharacter(player));
  }
}
