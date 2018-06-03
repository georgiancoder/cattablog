$(function(){

    $('.headerCarousel').owlCarousel({
        loop:false,
        margin:10,
        nav:true,
        autoplay: true,
        autoplayHoverPause: true,
        navText:['<img src="img/left-arrow.png" />','<img src="img/right-arrow.png" />'],
        responsive:{
            0:{
                items:1
            }
        }
    });

    $('button.asideButton').click(function(event){
        $('aside.siteRigrhSide').addClass('active');
        $('body').addClass('active');
        event.stopImmediatePropagation();
    });
    $('aside.siteRigrhSide').click(function(){
        $(this).removeClass('active');
        $('body').removeClass('active');
    });
});