
console.log("Helpdesk iniciado");

// ========================================
// 1. DATOS Y ELEMENTOS HTML
// ========================================

const tickets = [];

const campoTitulo = document.querySelector("#titulo");
const botonCrear = document.querySelector("#crearTicket");
const listaTickets = document.querySelector("#listaTickets");
const contador = document.querySelector("#contador");
const campoPrioridad = document.querySelector("#prioridad");

// Recuperar los tickets guardados
try {
  const ticketsGuardados = localStorage.getItem("tickets");

  if (ticketsGuardados !== null) {
    const datos = JSON.parse(ticketsGuardados);

    if (Array.isArray(datos)) {
      tickets.push(...datos);
    }
  }
} catch (error) {
  console.error("Error al recuperar los tickets:", error);
}

// ========================================
// 2. GUARDAR TICKETS
// ========================================

function guardarTickets() {
  try {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  } catch (error) {
    console.error("Error al guardar los tickets:", error);
    alert("No se pudieron guardar los cambios en el navegador.");
  }
}

// ========================================
// 3. READ: MOSTRAR TODOS LOS TICKETS
// ========================================

function mostrarTickets() {
  listaTickets.innerHTML = "";

  for (const ticket of tickets) {
    const elemento = document.createElement("li");

    const informacion = document.createElement("span");

    informacion.textContent =
      `#${ticket.id} - ${ticket.titulo} ` +
      `(${ticket.estado}) - Prioridad: ${ticket.prioridad} `;

    elemento.appendChild(informacion);

    // ========================================
    // 4. UPDATE: CAMBIAR EL ESTADO
    // ========================================

    const selectorEstado = document.createElement("select");
    const estados = ["Abierto", "En proceso", "Resuelto"];

    for (const estado of estados) {
      const opcion = document.createElement("option");

      opcion.value = estado;
      opcion.textContent = estado;
      opcion.selected = estado === ticket.estado;

      selectorEstado.appendChild(opcion);
    }

    selectorEstado.addEventListener("change", function () {
      ticket.estado = selectorEstado.value;

      guardarTickets();
      mostrarTickets();
    });

    elemento.appendChild(selectorEstado);

    // ========================================
    // 5. DELETE: ELIMINAR UN TICKET
    // ========================================

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";

    botonEliminar.addEventListener("click", function () {
      const confirmar = confirm(
        `¿Deseas eliminar el ticket #${ticket.id}?`
      );

      if (!confirmar) {
        return;
      }

      const indice = tickets.findIndex(
        (item) => item.id === ticket.id
      );

      if (indice !== -1) {
        tickets.splice(indice, 1);

        guardarTickets();
        mostrarTickets();
      }
    });

    elemento.appendChild(botonEliminar);
    listaTickets.appendChild(elemento);
  }

  contador.textContent = `Tickets: ${tickets.length}`;
}

// ========================================
// 6. CREATE: CREAR UN TICKET
// ========================================

botonCrear.addEventListener("click", function () {
  const titulo = campoTitulo.value.trim();

  // Validar descripción vacía
  if (titulo === "") {
    alert("Debes escribir una descripción.");
    campoTitulo.focus();
    return;
  }


  // Calcular el siguiente identificador
  const siguienteId =
    tickets.length > 0
      ? Math.max(...tickets.map((ticket) => ticket.id)) + 1
      : 1;

  // Crear el ticket
  const nuevoTicket = {
    id: siguienteId,
    titulo: titulo,
    estado: "Abierto",
    prioridad: campoPrioridad.value
  };

  tickets.push(nuevoTicket);

  guardarTickets();
  mostrarTickets();

  campoTitulo.value = "";
  campoTitulo.focus();
});

// ========================================
// 7. INICIAR LA APLICACIÓN
// ========================================

mostrarTickets();
