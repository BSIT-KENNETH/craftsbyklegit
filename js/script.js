document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = [];
    const cartCount = document.querySelector('.cart-count');
    const emptyCartMsg = document.querySelector('.empty-cart');
    const cartItemTemplate = document.querySelector('.cart-item');
    const cartItemsContainer = document.querySelector('.cart-items');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const priceAmount = document.querySelector('.price-amount');
    const customerEmail = document.getElementById('customer-email');
    const customerPhone = document.getElementById('customer-phone');

    const addOnsPrices = {
        "none": 0,
        "lights": 15,
        "butterfly": 20,
        "photo-strip": 30
    };

    // Price structure for each flower type
    const flowerPrices = {
        1: { 1: 85, 2: 150, 3: 210, 4: 250, 5: 300, 6: 350, 7: 410, 8: 460, 10: 590, 12: 650, 15: 710 },
        2: { 1: 90, 2: 175, 3: 260, 4: 340, 5: 420, 6: 470, 7: 540, 8: 590, 10: 700, 12: 890, 15: 1100 },
        3: { 1: 70, 2: 110, 3: 160, 4: 195, 5: 240, 6: 285, 7: 340, 8: 400, 10: 550, 12: 600, 15: 800 },
        4: { 1: 100, 2: 170, 3: 290, 4: 360, 5: 460, 6: 510, 7: 610, 8: 790, 10: 910, 12: 1100, 15: 1400 },
        
    };

   checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) return;

    const item = cart[0];
    const email = customerEmail.value;
    const phone = customerPhone.value;

    console.log('Phone to send:', phone);  // <== Add this line

    if (!phone) {
        alert('Please enter your contact number.');
        return;
    }
    if (!email) {
        alert('Please enter your email.');
        return;
    }

    const totalPrice = updatePrice(item.id, item.stems, item.addOn);

    const templateParams = {
        name: email,
        phone: phone,
        time: new Date().toLocaleString(),
        message: item.instructions || 'No special instructions.',
        product: item.name,
        color: item.color,
        stems: item.stems,
        addOn: item.addOn !== 'none' ? item.addOn : 'No add-on',
        price: totalPrice
    };

    emailjs.send('service_5a2gqgh', 'template_2xtwh9r', templateParams)
        .then(function(response) {
            alert('Order sent! We’ll get back to you soon.');
            cart = [];
            updateCart();
            customerEmail.value = '';
            customerPhone.value = '';  // clear phone input too
        }, function(error) {
            console.error('FAILED...', error);
            alert('Failed to send email. Please try again.');
        });
});



    function updatePrice(productId, stemCount, addOn) {
        const basePrice = flowerPrices[productId][stemCount] || 0;
        const addOnPrice = addOnsPrices[addOn] || 0;
        const totalPrice = basePrice + addOnPrice;
        priceAmount.textContent = totalPrice;
        return totalPrice;
    }

    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (cart.length > 0) {
                alert('You can only have one item in your cart at a time. Please remove the current item before adding another.');
                return;
            }

            const product = this.closest('.product');
            const productId = product.getAttribute('data-id');
            const productName = product.getAttribute('data-name');
            const productImg = product.querySelector('img').src;

            cart.push({
                id: productId,
                name: productName,
                image: productImg,
                color: 'default',
                stems: 1,
                instructions: '',
                addOn: 'none'
                
            });

            updateCart();
            updatePrice(productId, 1, 'none');

            document.querySelector('#cart').scrollIntoView({ behavior: 'smooth' });
        });
    });

    function updateCart() {
        cartCount.textContent = cart.length;

        if (cart.length === 0) {
            emptyCartMsg.style.display = 'block';
            cartItemTemplate.style.display = 'none';
            checkoutBtn.disabled = true;
        } else {
            emptyCartMsg.style.display = 'none';
            cartItemTemplate.style.display = 'flex';

            const item = cart[0];
            cartItemTemplate.querySelector('.cart-item-image').src = item.image;
            cartItemTemplate.querySelector('.cart-item-image').alt = item.name;
            cartItemTemplate.querySelector('.cart-item-name').textContent = item.name;

            const colorSelect = cartItemTemplate.querySelector('.color-select');
            colorSelect.value = item.color;

            const stemSelect = cartItemTemplate.querySelector('.stem-select');
            stemSelect.value = item.stems;

            const instructionsTextarea = cartItemTemplate.querySelector('.additional-instructions');
            instructionsTextarea.value = item.instructions;

            checkoutBtn.disabled = false;
        }
    }

    cartItemsContainer.addEventListener('change', function(e) {
        if (e.target.classList.contains('color-select')) {
            cart[0].color = e.target.value;
        }

        if (e.target.classList.contains('stem-select')) {
            const stems = parseInt(e.target.value);
            cart[0].stems = stems;
            updatePrice(cart[0].id, stems, cart[0].addOn);
        }

        if (e.target.classList.contains('add-ons-select')) {
            cart[0].addOn = e.target.value;
            updatePrice(cart[0].id, cart[0].stems, cart[0].addOn);
        }

        if (e.target.classList.contains('additional-instructions')) {
            cart[0].instructions = e.target.value;
        }
    });

    cartItemsContainer.addEventListener('click', function(e) {
        if (e.target.closest('.remove-item')) {
            cart = [];
            updateCart();
        }
    });

    customerEmail.addEventListener('input', function() {
        checkoutBtn.disabled = !this.checkValidity() || cart.length === 0;
    });

    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('header .container').appendChild(mobileMenuBtn);

    const nav = document.querySelector('nav');
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });

    updateCart();
});
 const elements = document.querySelectorAll('.fade-in-left, .fade-in-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Remove this if you want the animation to replay on scroll
      }
    });
  }, {
    threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
  setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
     
      splash.classList.add('fade-out');
    }, 3000); // 3 seconds