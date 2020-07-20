var dog,happyDog,database,foodS,foodStock;
var state=0;
var feed,addFood;
var fedTime,lastFed,foodObj;
function preload(){
  dogIMG=loadImage("Dog.png");
  happyDogIMG=loadImage("happydog.png");
}
function setup() {
  createCanvas(1800,800);
  dog=createSprite(900,400,100,100);
  dog.addImage(dogIMG)
  database=firebase.database();
  foodStock=database.ref("Food");
  foodStock.on("value",readStock);
  foodObj=new Food();
  feed=createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(46,139,87); 
  foodObj.display();
  if(foodS==0){
    dog.addImage(happyDogIMG);
    state=1;
  }
  drawSprites();
  textSize(35);
  fill(0);
  fedTime=database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  if(lastFed>=12){
    text("Last Feed: "+ lastFed%12,350,30);
  }else if(lastFed==0){
    text("Last Feeed:12 AM",350,30);
  }else{
    text("Last Feed : "+lastFed+"AM",350,30);
  }
}
function readStock(data){
  foodS=data.val();
}
function writeStock(x){
  database.ref("/").update({
    Food:x
  })
}
function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foodS++;
  database.ref("/").update({
    Food:foodS
  })
}