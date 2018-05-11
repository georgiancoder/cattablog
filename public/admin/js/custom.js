function deleteDirectorAvatar(id, el){
  var that = el;
  $.ajax({
    url: '/admin/removediravatar',
    data: {id: id},
    type: 'PUT',
    success: function(msg){
      if(msg && msg.success){
        location.reload();
      }
    }
  })
}

function deleteDirector(id,el){
  var that = el;
  $.ajax({
    url: '/admin/deldirector',
    data: {id: id},
    type: 'DELETE',
    success: function(msg){
      if(msg && msg.success){
        $(that).parent().parent().remove();
      }
    },
    error: function(xhr){
      alert(xhr.status);
    }
  })
}

function deleteActor(id,el){
  var that = el;
  $.ajax({
    url: '/admin/delactor',
    data: {id: id},
    type: 'DELETE',
    success: function(msg){
      if(msg && msg.success){
        $(that).parent().parent().remove();
      }
    },
    error: function(xhr){
      alert(xhr.status);
    }
  })
}

function deleteActorAvatar(id,el){
  var that = el;
  $.ajax({
    url: '/admin/removeactavatar',
    data: {id: id},
    type: 'PUT',
    success: function(msg){
      if(msg && msg.success){
        location.reload();
      }
    }
  })
}

function deleteCategory(id){
  $.ajax({
    url: '/admin/removecategory',
    data: {id: id},
    type: 'DELETE',
    success: function(msg){
      if(msg && msg.success){
        location.reload();
      }
    }
  })
}

function deleteMovie(id){
  $.ajax({
    url: '/admin/deletemovie',
    data: {id: id},
    type: 'DELETE',
    success: function(msg){
      if(msg && msg.success){
        location.reload();
      }
    }
  })
}

function deleteMoviePoster(id){
  $.ajax({
    url: '/admin/removemovieposter',
    data: {id: id},
    type: 'PUT',
    success: function(msg){
      if(msg && msg.success){
        location.reload();
      }
    }
  })
}

function deleteMovieSubtitle(id,lng){
  $.ajax({
    url: '/admin/removemoviesubtitle',
    data: {id: id, lng: lng},
    type: 'PUT',
    success: function(msg){
      if(msg && msg.success){
        location.reload();
      }
    }
  })
}


$().ready(function(){





});
