const user = {
  id: 1,
  name: "Pedro Henrique",
  email: "pedro@email.com",
  phone: "(11) 99999-9999",

  addresses: [
    {
      id: 1,
      street: "Rua das Flores",
      number: "123",
      complement: "Apartamento 12",
      neighborhood: "Centro",
      city: "São Paulo",
      isDefault: true,
    },

    {
      id: 2,
      street: "Av. Paulista",
      number: "500",
      complement: "",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      isDefault: false,
    },
  ],
};

const orders = [
  {
    id: 1045,
    userId: 1,
    status: "completed",
    createdAt: "2026-05-20T19:30:00",

    items: [
      {
        id: 1,
        quantity: 2,
        name: "Temaki",
      },

      {
        id: 2,
        quantity: 1,
        name: "Coca-Cola 2L",
      },
    ],

    total: 89.9,
  },

  {
    id: 1046,
    userId: 1,
    status: "pending",
    createdAt: "2026-05-25T21:10:00",

    items: [
      {
        id: 1,
        quantity: 1,
        name: "Hot Roll",
      },
    ],

    total: 42.5,
  },
];

const isLoggedIn = true;

const profilePage = document.getElementById("profilePage");
const notLogged = document.getElementById("notLogged");

if (!isLoggedIn || !user) {
  profilePage.classList.add("hidden");
  notLogged.classList.remove("hidden");
} else {
  renderUser();
  renderOrders();
}

function renderUser() {

  document.getElementById("userName").textContent = user.name;
  document.getElementById("userEmail").textContent = user.email;
  document.getElementById("userPhone").textContent = user.phone;

  const addressesContainer = document.getElementById("addressesContainer");

  user.addresses.forEach((address) => {

    const addressCard = document.createElement("div");
    addressCard.classList.add("address-card");

    addressCard.innerHTML = `
      ${
        address.isDefault
          ? `<span class="default-badge">Padrão</span>`
          : ""
      }

      <p>
        ${address.street}, ${address.number}
        ${address.complement ? ` - ${address.complement}` : ""}
      </p>

      <p class="address-city">
        ${address.neighborhood} - ${address.city}
      </p>
    `;

    addressesContainer.appendChild(addressCard);
  });
}

function renderOrders() {

  const ordersContainer = document.getElementById("ordersContainer");

  const userOrders = orders.filter(
    (order) => order.userId === user.id
  );

  if (userOrders.length === 0) {

    ordersContainer.innerHTML = `
      <div class="empty-orders">
        <p>Você ainda não fez nenhum pedido</p>

        <button class="btn btn-primary">
          Fazer Primeiro Pedido
        </button>
      </div>
    `;

    return;
  }

  const ordersList = document.createElement("div");
  ordersList.classList.add("orders-list");

  userOrders
    .slice()
    .reverse()
    .forEach((order) => {

      const orderCard = document.createElement("div");
      orderCard.classList.add("order-card");

      const itemsHTML = order.items
        .map((item) => {
          return `
            <p class="order-item">
              ${item.quantity}x ${item.name}
            </p>
          `;
        })
        .join("");

      orderCard.innerHTML = `
        <div class="order-top">

          <div>
            <h3 class="order-id">
              Pedido #${order.id}
            </h3>

            <p class="order-date">
              ${formatDate(order.createdAt)}
            </p>
          </div>

          <span class="status ${order.status}">
            ${getStatusText(order.status)}
          </span>

        </div>

        <div class="order-items">
          ${itemsHTML}
        </div>

        <div class="order-footer">

          <span class="order-total">
            R$ ${order.total.toFixed(2)}
          </span>

          <button class="btn btn-outline">
            Ver Detalhes
          </button>

        </div>
      `;

      ordersList.appendChild(orderCard);
    });

  ordersContainer.appendChild(ordersList);
}

function formatDate(date) {

  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusText(status) {

  const statusMap = {
    pending: "Pendente",
    completed: "Concluído",
  };

  return statusMap[status] || status;
}

document
  .getElementById("logoutBtn")
  .addEventListener("click", () => {

    alert("Logout realizado!");

    location.reload();
  });

lucide.createIcons();