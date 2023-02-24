let url = "./cuadros.json";
fetch(url)
  .then((res) => res.json())
  .then((data) => fglobal(data))
  .catch((error) => console.log(error));

fglobal(cuadros);

function fglobal(cuadros) {
  let carrito = [];
  let carritoJSON = "";
  let contenedor = document.getElementById("contenedor");
  let carritoRender = document.getElementById("cart-row");
  let modal = document.getElementById("myModal");
  let cartNav = document.getElementById("cart-nav");
  let botonCarrito = document.getElementById("cart-button");
  let total = document.getElementById("total");
  botonCarrito.addEventListener("click", mostrar);
  let contenedorCarritoTotal = document.getElementById(
    "contenedorCarritoTotal"
  );
  let totalFinal = "";
  let unidades = "";

  renderizar(cuadros);

  comprobar(carrito);

  function comprobar() {
    if (localStorage.getItem("Carrito")) {
      carrito = JSON.parse(localStorage.getItem("Carrito"));
      renderizarCarro(carrito);
      totalRender(carrito);
    } else {
      totalRenderVacio(carrito);
    }
  }

  let niña = document.getElementById("niña");
  let mujer = document.getElementById("mujer");
  let niño = document.getElementById("niño");
  let hombre = document.getElementById("hombre");

  let inicio = document.getElementById("Inicio");
  let logo = document.getElementById("Logo");

  inicio.addEventListener("click", renderizarTodo);
  logo.addEventListener("click", renderizarTodo);

  niña.addEventListener("click", filtro);
  mujer.addEventListener("click", filtro);
  niño.addEventListener("click", filtro);
  hombre.addEventListener("click", filtro);

  function filtro(e) {
    e.preventDefault();
    console.log(e.target.id);
    let categoriaFiltrado = cuadros.filter(
      (cuadro) => cuadro.categoria == e.target.id
    );
    renderizar(categoriaFiltrado);
  }

  function renderizarTodo(e) {
    e.preventDefault();
    renderizar(cuadros);
  }

  function renderizar(array) {
    contenedor.innerHTML = "";
    for (const cuadros of array) {
      let tarjetaBody = document.createElement("div");
      let { img, nombre, precio, id } = cuadros;

      tarjetaBody.className = "tarjeta-body";
      tarjetaBody.innerHTML = `
          <div class="card">
              <div class="card-img">
                  <img src="${img}" alt="Card image cap">
              </div>
              <h5 class="card-title">${nombre}</h5>
              <p class="card-text">
              Pregunte los talle antes de comprar.</p>
              <div class="cardBody">
                  <h6 class= "precio"><strong>Precio: $ ${precio.toFixed(
                    2
                  )}</strong></h6>
                  <button id="${id}"  class="btn btn-secondary me-md-2">Comprar</button>
              </div>
          </div>
          `;

      contenedor.append(tarjetaBody);
    }

    let comprar = document.getElementsByClassName("btn btn-secondary me-md-2");

    for (boton of comprar) {
      boton.addEventListener("click", addCarrito);
    }
  }

  function renderizarCarro(array) {
    carritoRender.innerHTML = "";
    for (let cuadros of array) {
      let cart = document.createElement("div");
      let { img, nombre, precio, id, unidades, subtotal } = cuadros;
      cart.className = "cart-render";
      cart.innerHTML = `
          <div class="cart-row">
              <div  style="flex:1"><img class="row-image" src="${img}"></div>
              <div  style="flex:2"><p class="cart-p">${nombre}</p></div>
              <div  style="flex:1"><p class="cart-p">$${precio.toFixed(
                2
              )}</p></div>
              <div style="flex:1">
                  <p class="quantity">${unidades}</p>
                  <div class="quantity">
                  <img id="${id}" class="chg-quantity update-cart " src="./imagen/arriba.jpg">
                  <img id="${id}" class="chg-quantity-2 update-cart" src="./imagen/abajo.jpg">
                  </div>
              </div>
              <div style="flex:1"><p class="cart-p">$${subtotal.toFixed(
                2
              )}</p></div>
          </div>
          `;
      carritoRender.append(cart);
    }

    let add = document.getElementsByClassName("chg-quantity update-cart");
    for (let a of add) {
      a.addEventListener("click", addCarrito);
    }
    let remove = document.getElementsByClassName("chg-quantity-2 update-cart");
    for (let b of remove) {
      b.addEventListener("click", removeItem);
    }
  }

  function addCarrito(e) {
    let productoBuscado = cuadros.find((cuadro) => cuadro.id == e.target.id);

    let indexCuadro = carrito.findIndex(
      (cuadro) => cuadro.id == productoBuscado.id
    );

    if (indexCuadro != -1) {
      carrito[indexCuadro].unidades++;

      carrito[indexCuadro].subtotal =
        carrito[indexCuadro].precio * carrito[indexCuadro].unidades;

      carritoJSON = JSON.stringify(carrito);

      localStorage.setItem("Carrito", carritoJSON);
    } else {
      carrito.push({
        id: productoBuscado.id,
        nombre: productoBuscado.nombre,
        categoria: productoBuscado.categoria,
        precio: productoBuscado.precio,
        img: productoBuscado.img,
        unidades: 1,
        subtotal: productoBuscado.precio,
      });

      carritoJSON = JSON.stringify(carrito);
      localStorage.setItem("Carrito", carritoJSON);
    }
    renderizarCarro(carrito);
    totalRender(carrito);
    tostadin("Item Agregado", {
      background: "#777799",
    });
  }

  function removeItem(e) {
    let productoBuscado = cuadros.find((cuadro) => cuadro.id == e.target.id);
    let indexCuadro = carrito.findIndex(
      (cuadro) => cuadro.id == productoBuscado.id
    );

    if (indexCuadro != -1) {
      if (carrito[indexCuadro].unidades >= 2) {
        carrito[indexCuadro].unidades--;
        carrito[indexCuadro].subtotal =
          carrito[indexCuadro].subtotal - carrito[indexCuadro].precio;
        carritoJSON = JSON.stringify(carrito);
        localStorage.setItem("Carrito", carritoJSON);
      } else {
        carrito.splice(indexCuadro, 1);
        carritoJSON = JSON.stringify(carrito);
        localStorage.setItem("Carrito", carritoJSON);
      }
    }
    totalFinal = carrito.reduce((a, b) => a + b.subtotal, 0);
    unidades = carrito.reduce((a, b) => a + b.unidades, 0);
    renderizarCarro(carrito);
    totalRender(carrito);
    tostadin("Item removido", { background: "grey" });
  }

  function totalRender(array) {
    totalFinal = carrito.reduce((a, b) => a + b.subtotal, 0);
    unidades = carrito.reduce((a, b) => a + b.unidades, 0);
    total.innerHTML = "";
    let totalResumen = document.createElement("div");
    totalResumen.className = "total";
    totalResumen.innerHTML = `
      <span class="close">&times;</span> 
      <h5 class="totalh5" >Items: <strong>${unidades}</strong></h5>
      <h5 class="totalh5" >Total:<strong> $ ${totalFinal.toFixed(
        2
      )}</strong></h5>
      <button id="clear" style="float:right; margin:5px;" type="button" class="btn btn-outline-success">Pagar ahora</button>
      `;
    total.append(totalResumen);

    let span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
      modal.style.display = "none";
    };

    cartNav.innerHTML = "";
    if (array.lenght != 0) {
      let parrafo = document.createElement("div");
      parrafo.className = "cart-total";
      parrafo.innerHTML = `<p>${unidades}</p>`;
      cartNav.append(parrafo);
    } else {
      let parrafo = document.createElement("div");
      parrafo.className = "cart-total";
      parrafo.innerHTML = `<p>0</p>`;
      cartNav.append(parrafo);
    }

    let clear = document.getElementById("clear");
    clear.addEventListener("click", borrarStorage);
  }

  function totalRenderVacio(array) {
    total.innerHTML = "";
    let totalResumen = document.createElement("div");
    totalResumen.className = "total";
    totalResumen.innerHTML = `
          <span class="close">&times;</span> 
          <h5 class="totalh5">Items: <strong> 0 </strong></h5>
          <h5 class="totalh5">Total:<strong> $ 0.00 </strong></h5>
          `;
    total.append(totalResumen);
    cartNav.innerHTML = "";
    let parrafo = document.createElement("div");
    parrafo.className = "cart-total";
    parrafo.innerHTML = `<p>0</p>`;
    cartNav.append(parrafo);

    let span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
      modal.style.display = "none";
    };
  }

  function mostrar(e) {
    modal.style.display = "block";
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  function borrarStorage() {
    localStorage.removeItem("Carrito");
    contenedorCarritoTotal.className = "modal-content";
    modal.style.display = "none";

    carrito = [];
    totalRenderVacio(carrito);
    renderizarCarro(carrito);
    renderizar(cuadros);
    comprobar(carrito);
    Swal.fire({
      title: "Pago aprobado!",
      text: "Gracias por su compra",
      icon: "success",
      showConfirmButton: false,
      iconColor: "green",
    });
  }

  function tostadin(text, style) {
    Toastify({
      text: text,
      style: style,
      duration: 2000,
    }).showToast();
  }
}
