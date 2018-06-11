function deleteTale(id){
  $.ajax({
    url: '/admin/removetale',
    data: {id: id},
    type: 'DELETE',
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

function deletePost(id) {
    $.ajax({
        url: '/admin/removepost',
        data: {id: id},
        type: 'DELETE',
        success: function(msg){
            if(msg && msg.success){
                location.reload();
            }
        }
    });
}

function deletePostMainImg(id, filename) {
    $.ajax({
        url: '/admin/removepostimg',
        data: {id: id, filename: filename},
        type: 'DELETE',
        success: function(msg){
            if(msg && msg.success){
                location.reload();
            }
        }
    });
}