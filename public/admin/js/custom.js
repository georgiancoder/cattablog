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