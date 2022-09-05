$(document).on('ready', function() {
  const getAllProducts = () => {
    $('.nav-link').removeClass('active')

    $.ajax({
      type: 'GET',
      url: 'https://bsale-exam.herokuapp.com/products',
      dataType: 'json',
      success: function(data) {
        displayCards(data)
      }
    })
  }

  getAllProducts()

  $.ajax({
    type: 'GET',
    url: 'https://bsale-exam.herokuapp.com/categories',
    dataType: 'json',
    success: function(data) {
      let html = ''

      data.forEach(e => {
        html += `<li data-id="${e.id}" class="category nav-item">
          <a class="nav-link" href="#">${e.name}</a>
        </li>`
      })

      $('.category-list').html(html)
    }
  })

  $('body').on('click', '.category', function() {
    const categoryId = $(this).data('id')

    $('.nav-link').removeClass('active')
    $(this).find('a').addClass('active')

    $.ajax({
      type: 'GET',
      url: `https://bsale-exam.herokuapp.com/products/category/${categoryId}`,
      dataType: 'json',
      success: function(data) {
        displayCards(data)
      }
    })
  })

  $('.search-btn').on('click', function(event) {
    event.preventDefault();
    const search = $('.search-input').val()
    
    if (search === '') {
      getAllProducts()
    } else {    
      $.ajax({
        type: 'GET',
        url: `https://bsale-exam.herokuapp.com/search?search=${search}`,
        dataType: 'json',
        success: function(data) {
          displayCards(data)
          $('#offcanvasNavbar').offcanvas('hide')
        }
      })
    }
  })

  $('body').on('click', '.see-product', function() {
    const id = $(this).data('id')

    $.ajax({
      type: 'GET',
      url: `https://bsale-exam.herokuapp.com/products/${id}`,
      dataType: 'json',
      success: function(data) {
        $('#product-modal').modal('show')
        $('.modal-title').text(data[0].name)
        $('.modal-price').text(`Price: ${formatter.format(data[0].price)}`)
        $('.modal-discount').text(`Discount: ${data[0].discount}%`)
      }
    })
  })

  $('.see-all').on('click', function() {
    $('.nav-link').removeClass('active')
    getAllProducts()
  })

  const displayCards = (data) => {
    let html = ''
    if(data.length === 0) html += '<div class="no-products"><h2>Products do not exist</h2></div>'

    data.forEach(e => {
      const image = e.url_image || "http://dystopia-nft.io/not-found.png"
      const price = formatter.format(parseInt(e.price)) ?? formatter.format(0)
      html += `<div class="col col-sm-3">
        <div class="card shadow">
          <div class="img-box">
            <img src="${image}" class="card-img-top" alt="product-image">
          </div>
          <div class="card-body">
            <h6>${e.name}</h6>
            <div>${price}</div>
            <a href="#" data-id="${e.id}" class="see-product btn btn-primary">See Product</a>
          </div>
        </div>
      </div>`
    })

    $('.card-list').html(html)
  }

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
})