const body= document.querySelector('body');
const navbar= document.querySelector('.navbar');
const menu = document.querySelector('.menu-list');
const menuBtn = document.querySelector('.icon.menu-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const profile=document.querySelector('.navbar .menu-list .profile');
var htmlElement = document.querySelector("html");
var user=document.getElementById('user-logo');
var logout=document.querySelector('body > header > nav > div > div.logo > ul:nth-child(3) > li:nth-child(2) > div.logout.hide');
var content=document.getElementById('post-content');

var carousel=document.getElementById('carousel-inner');

window.onload=function(){
    var first_slide=carousel.firstElementChild;
    first_slide.classList.add('active');
}
    

menuBtn.addEventListener('click',()=>{
    menu.classList.add('active');
    menuBtn.classList.add('hide');
    body.classList.add('disabledScroll');
    htmlElement.style.overflowY="hidden";
    menu.style.overflowY="auto";  
});

cancelBtn.addEventListener("click",()=>{
    menu.classList.remove('active');
    menuBtn.classList.remove('hide');
    body.classList.remove('disabledScroll');
    menu.style.overflowY="none";
    htmlElement.style.overflowY="auto";
});

user.addEventListener('click',(e)=>{
    if(logout.classList.contains('hide')===true){
        logout.classList.remove('hide');
    }else{
        logout.classList.add('hide');
    }
});

content.textContent=content.textContent.slice(0,20);


