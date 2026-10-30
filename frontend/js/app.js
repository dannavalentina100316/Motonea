document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const errorMessage = document.getElementById("error-message");
    const modelsGrid = document.getElementById("models-grid");
    const btnLogout = document.getElementById("btn-logout");
    const btnVerCredito = document.getElementById("btn-ver-credito");

    const API_URL = window.location.port === "3000" ? "/api" : "http://localhost:3000/api";

    // Lógica del botón Salir
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    // Crear dinámicamente el modal general para detalles y asesorías
    if (!document.getElementById("moto-modal")) {
        const modalHTML = `
            <div id="moto-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 1000; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box;">
                <div style="background: #ffffff; border-radius: 16px; max-width: 650px; width: 100%; overflow: hidden; position: relative; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">
                    <button id="close-modal" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.5); color: white; border: none; font-size: 20px; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; z-index: 10;">&times;</button>
                    <div id="modal-image" style="width: 100%; height: 260px; background-size: cover; background-position: center;"></div>
                    <div style="padding: 24px;">
                        <span id="modal-type" style="color: #ea580c; font-weight: 700; text-transform: uppercase; font-size: 13px; letter-spacing: 0.5px;"></span>
                        <h2 id="modal-title" style="margin: 6px 0 2px 0; color: #0f172a; font-size: 28px;"></h2>
                        <strong id="modal-price" style="display: block; color: #1e3a8a; font-size: 22px; margin-bottom: 16px;"></strong>
                        
                        <div id="modal-specs-container">
                            <h4 style="margin: 0 0 10px 0; color: #334155;">Especificaciones Técnicas:</h4>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; background: #f8fafc; padding: 16px; border-radius: 10px;">
                                <div><span style="color: #64748b; font-size: 13px; display: block;">Cilindraje</span><strong id="modal-engine" style="color: #0f172a;"></strong></div>
                                <div><span style="color: #64748b; font-size: 13px; display: block;">Potencia</span><strong id="modal-power" style="color: #0f172a;"></strong></div>
                                <div><span style="color: #64748b; font-size: 13px; display: block;">Torque</span><strong id="modal-torque" style="color: #0f172a;"></strong></div>
                                <div><span style="color: #64748b; font-size: 13px; display: block;">Frenos</span><strong id="modal-brakes" style="color: #0f172a;"></strong></div>
                            </div>
                        </div>
                        <p id="modal-description" style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0;"></p>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const motoModal = document.getElementById("moto-modal");
    const closeModal = document.getElementById("close-modal");
    const modalImage = document.getElementById("modal-image");
    const modalType = document.getElementById("modal-type");
    const modalTitle = document.getElementById("modal-title");
    const modalPrice = document.getElementById("modal-price");
    const modalSpecsContainer = document.getElementById("modal-specs-container");
    const modalEngine = document.getElementById("modal-engine");
    const modalPower = document.getElementById("modal-power");
    const modalTorque = document.getElementById("modal-torque");
    const modalBrakes = document.getElementById("modal-brakes");
    const modalDescription = document.getElementById("modal-description");

    if (closeModal) {
        closeModal.addEventListener("click", () => {
            motoModal.style.display = "none";
        });
    }

    if (motoModal) {
        motoModal.addEventListener("click", (e) => {
            if (e.target === motoModal) {
                motoModal.style.display = "none";
            }
        });
    }

    // Información para los botones de asesoría
    const asesoriaInfo = {
        cotizacion: {
            title: "Solicita tu cotización",
            type: "Asesoría Comercial",
            price: "¡Gratis y sin compromiso!",
            image: "https://imgv2-1-f.scribdassets.com/img/document/633725838/original/ee588e2daa/1689144254?v=1",
            details: "Obtén una cotización detallada con los precios de lista, SOAT, matrícula y opciones de financiamiento para el modelo de moto que prefieras. Un asesor se pondrá en contacto contigo."
        },
        testdrive: {
            title: "Reserva tu Test Drive",
            type: "Experiencia de Manejo",
            price: "Prueba la moto de tus sueños",
            image: "https://marketplace.canva.com/EAFbTZyWb6o/1/0/566w/canva-flyer-de-venta-de-motos-audaz-azul-O6JrurA6N6Q.jpg",
            details: "Experimenta el poder, la comodidad y el rendimiento de nuestras referencias en pista o circuito autorizado. Agenda tu prueba de manejo hoy mismo con tu documento de identidad y licencia vigente."
        },
        credito: {
            title: "Solicita tu crédito",
            type: "Financiamiento Fácil",
            price: "Aprobación rápida en línea",
            image: "https://tse2.mm.bing.net/th/id/OIP.FHp8AoDnJ-kW0DY1VTXU8gHaGN?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
            details: "Financiamos hasta el 100% de tu motocicleta con plazos flexibles de hasta 72 meses y tasas de interés preferenciales. Simula tu cuota inicial y requisitos mínimos de forma inmediata."
        },
        tecnico: {
            title: "Servicio técnico especializado",
            type: "Mantenimiento y Garantía",
            price: "Repuestos originales",
            image: "https://tse3.mm.bing.net/th/id/OIP.adjppUv2m-577U2bzV6GNgAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
            details: "Mantén tu motocicleta al día con nuestros talleres certificados, mecánicos expertos, diagnóstico computarizado y uso exclusivo de repuestos originales para garantizar tu seguridad."
        },
        puntos: {
            title: "Puntos de atención y sedes",
            type: "Encuéntranos cerca",
            price: "Red de concesionarios Motonea",
            image: "https://tse3.mm.bing.net/th/id/OIP.ybg1GjfQ6-yJRl-zYJAGOwHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
            details: "Visita nuestra red de salas de venta y centros de servicio autorizados. Contamos con vitrinas modernas, asesores expertos y stock permanente de vehículos y accesorios."
        }
    };

    document.querySelectorAll(".btn-asesoria").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const tipo = btn.getAttribute("data-tipo");
            const info = asesoriaInfo[tipo];
            if (info) {
                modalImage.style.backgroundImage = `url('${info.image}')`;
                modalType.textContent = info.type;
                modalTitle.textContent = info.title;
                modalPrice.textContent = info.price;
                modalSpecsContainer.style.display = "none";
                modalDescription.textContent = info.details;
                motoModal.style.display = "flex";
            }
        });
    });

    // Lógica para el botón "VER MÁS" de créditos
    if (btnVerCredito) {
        btnVerCredito.addEventListener("click", (e) => {
            e.preventDefault();
            const infoCredito = asesoriaInfo["credito"];
            if (infoCredito && motoModal) {
                modalImage.style.backgroundImage = `url('${infoCredito.image}')`;
                modalType.textContent = infoCredito.type;
                modalTitle.textContent = infoCredito.title;
                modalPrice.textContent = infoCredito.price;
                if (modalSpecsContainer) modalSpecsContainer.style.display = "none";
                modalDescription.textContent = infoCredito.details;
                motoModal.style.display = "flex";
            }
        });
    }

    async function readApiResponse(response) {
        const responseBody = await response.text();

        try {
            return JSON.parse(responseBody);
        } catch {
            throw new Error(`El servidor respondió de forma inesperada (HTTP ${response.status}). Abre el sitio desde http://localhost:3000.`);
        }
    }

    // CATÁLOGO DE MOTOS CON TUS IMÁGENES ORIGINALES INTACTAS
    const motorcycles = {
        TVS: [
            { 
                name: "Apache RTR 200", 
                type: "Deportiva", 
                price: "$14.990.000", 
                image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=900&q=80",
                engine: "197.75 cc", power: "20.5 HP @ 8500 rpm", torque: "16.8 Nm @ 7500 rpm", brakes: "Disco ABS Doble Canal",
                details: "La Apache RTR 200 ofrece un rendimiento deportivo excepcional con tecnología Race Tuned Fuel Injection y modos de manejo ajustables."
            },
            { 
                name: "Raider 125", 
                type: "Urbana", 
                price: "$9.490.000", 
                image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
                engine: "124.8 cc", power: "11.2 HP @ 7500 rpm", torque: "11.2 Nm @ 6000 rpm", brakes: "Disco delantero / Tambor trasero",
                details: "Diseño moderno y agresivo con tablero digital a color, excelente rendimiento de combustible para la ciudad y postura cómoda."
            },
            { 
                name: "NTORQ 125", 
                type: "Scooter", 
                price: "$10.990.000", 
                image: "https://th.bing.com/th/id/R.94f6606e135d7d4cc375ec61dd63d1d1?rik=r6XzV4WfXog8MA&pid=ImgRaw&r=0",
                engine: "124.79 cc", power: "9.25 HP @ 7000 rpm", torque: "10.5 Nm @ 5500 rpm", brakes: "Disco delantero / Tambor trasero",
                details: "Scooter deportivo conectado con tecnología SmartXonnect, conectividad Bluetooth, navegación paso a paso y excelente aceleración."
            }
        ],
        Victory: [
            { 
                name: "Venom 250", 
                type: "Street", 
                price: "$13.990.000", 
                image: "https://tse3.mm.bing.net/th/id/OIP.LiFB-_l2FxFj_O7w2iIJYwHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                engine: "249 cc", power: "20 HP @ 8000 rpm", torque: "20.5 Nm @ 6500 rpm", brakes: "Disco Lobulado en ambas ruedas",
                details: "Naked urbana de alta cilindrada con actitud imponente, iluminación LED completa e inyección electrónica."
            },
            { 
                name: "Bomber 250", 
                type: "Naked", 
                price: "$15.490.000", 
                image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=900&q=80",
                engine: "249 cc", power: "22 HP @ 8500 rpm", torque: "21 Nm @ 7000 rpm", brakes: "Disco ABS",
                details: "Estilo neo-retro con potencia destacada para rodadas urbanas y de carretera."
            },
            { 
                name: "One 125", 
                type: "Urbana", 
                price: "$8.990.000", 
                image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
                engine: "125 cc", power: "10 HP @ 7500 rpm", torque: "9.5 Nm @ 6000 rpm", brakes: "Tambor combinado",
                details: "Sencilla, resistente y económica, ideal para el trabajo diario en la ciudad."
            }
        ],
        Kymco: [
            { 
                name: "Agility 125", 
                type: "Scooter", 
                price: "$10.290.000", 
                image: "https://tse1.mm.bing.net/th/id/OIP.pAx3tcdVyotauqJGY-hBfQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                engine: "124.6 cc", power: "9.3 HP @ 7500 rpm", torque: "9.6 Nm @ 6500 rpm", brakes: "Disco / Tambor",
                details: "La scooter líder por durabilidad, maniobrabilidad y agilidad en el tráfico urbano."
            },
            { 
                name: "Like 125", 
                type: "Scooter premium", 
                price: "$12.790.000", 
                image: "https://tse2.mm.bing.net/th/id/OIP.pETU41yINVzfsHNvqmcBkwHaFy?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                engine: "124.8 cc", power: "11.1 HP @ 8500 rpm", torque: "10.4 Nm @ 6500 rpm", brakes: "Disco CBS",
                details: "Elegancia retro clásica combinada con tecnología moderna y acabados de lujo."
            },
            { 
                name: "X-Town 300", 
                type: "Maxi scooter", 
                price: "$25.990.000", 
                image: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?auto=format&fit=crop&w=900&q=80",
                engine: "276 cc", power: "24.1 HP @ 7250 rpm", torque: "25 Nm @ 6250 rpm", brakes: "Disco ABS Doble",
                details: "Máximo confort en viajes largos, gran espacio de almacenamiento bajo el asiento y gran estabilidad."
            }
        ],
        Benelli: [
            { 
                name: "TNT 150i", 
                type: "Street", 
                price: "$11.990.000", 
                image: "https://tse3.mm.bing.net/th/id/OIP.iPUBlNvwrmp6yHXjiD5E4gHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                engine: "149.8 cc", power: "13 HP @ 8000 rpm", torque: "12.8 Nm @ 6000 rpm", brakes: "Disco en ambas ruedas",
                details: "Chasis multitubular tipo Trellis e inyección electrónica con un sonido italiano único."
            },
            { 
                name: "TRK 502", 
                type: "Adventure", 
                price: "$34.990.000", 
                image: "https://tse2.mm.bing.net/th/id/OIP.YTpXHA0h2agumjdtcYr3QgHaGR?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                engine: "500 cc Bicilíndrico", power: "47.6 HP @ 8500 rpm", torque: "46 Nm @ 6000 rpm", brakes: "Doble disco ABS",
                details: "Diseñada para conquistar rutas y viajar sin límites con máxima protección aerodinámica."
            },
            { 
                name: "Leoncino 500", 
                type: "Scrambler", 
                price: "$29.990.000", 
                image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
                engine: "500 cc", power: "47.6 HP @ 8500 rpm", torque: "46 Nm @ 6000 rpm", brakes: "Disco ABS",
                details: "Diseño auténtico de la herencia Benelli con toque moderno y sonido incomparable."
            }
        ],
        Kawasaki: [
            { 
                name: "Ninja 400", 
                type: "Deportiva", 
                price: "$34.990.000", 
                image: "https://tse4.mm.bing.net/th/id/OIP.mF9N-R9QnLyE1FVG0POB1AHaFJ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                engine: "399 cc Bicilíndrico", power: "45 HP @ 10000 rpm", torque: "38 Nm @ 8000 rpm", brakes: "Disco lobulado ABS",
                details: "Dominadora de la categoría supersport ligera con aceleración contundente y maniobrabilidad precisa."
            },
            { 
                name: "Z400", 
                type: "Naked", 
                price: "$31.990.000", 
                image: "https://th.bing.com/th/id/R.71550277a5c80eac2e008eaee7a3b43b?rik=nr7VDBBvRsghqw&pid=ImgRaw&r=0",
                engine: "399 cc", power: "45 HP @ 10000 rpm", torque: "38 Nm @ 8000 rpm", brakes: "Disco ABS",
                details: "Actitud agresiva Sugomi, chasis liviano y desempeño urbano y de pista de alto nivel."
            },
            { 
                name: "Versys 650", 
                type: "Touring", 
                price: "$42.990.000", 
                image: "https://tse3.mm.bing.net/th/id/OIP.QxzINjeVfSPL4eFYpVVeOQHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                engine: "649 cc Bicilíndrico", power: "69 HP @ 8500 rpm", torque: "64 Nm @ 7000 rpm", brakes: "Doble disco ABS",
                details: "Suspensión de largo recorrido y posición de conducción erguida para devorar kilómetros."
            }
        ],
        Zontes: [
            { 
                name: "200U1", 
                type: "Supermoto", 
                price: "$15.990.000", 
                image: "https://tse2.mm.bing.net/th/id/OIP.pyC0ChRtX7nYCPB0JRccMAHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                engine: "198 cc", power: "21.5 HP @ 9000 rpm", torque: "19 Nm @ 7000 rpm", brakes: "Disco ABS Bosch",
                details: "Equipamiento futurista, encendido Keyless sin llave, embrague antirrebote e iluminación full LED."
            },
            { 
                name: "T1 350", 
                type: "Adventure", 
                price: "$24.990.000", 
                image: "https://tse3.mm.bing.net/th/id/OIP.Gs1SbQcMkjFPJ_8gfI-_FgHaE0?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                engine: "348 cc", power: "38.8 HP @ 9500 rpm", torque: "32.8 Nm @ 7500 rpm", brakes: "Disco ABS",
                details: "Tablero TFT a color, pantalla parabrisas eléctrica e inyección Bosch."
            },
            { 
                name: "R1 125", 
                type: "Urbana", 
                price: "$10.490.000", 
                image: "https://tse1.mm.bing.net/th/id/OIP.5em-_Cl9O4b6awEZMJueDAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                engine: "125 cc", power: "14.5 HP @ 9000 rpm", torque: "13 Nm @ 7000 rpm", brakes: "Disco ABS",
                details: "Tecnología de gama alta adaptada a la movilidad urbana eficiente."
            }
        ]
    };

    function showMotoDetails(motorcycle) {
        if (!motoModal) return;
        modalImage.style.backgroundImage = `url('${motorcycle.image}')`;
        modalType.textContent = motorcycle.type;
        modalTitle.textContent = motorcycle.name;
        modalPrice.textContent = motorcycle.price;
        
        modalSpecsContainer.style.display = "block";
        modalEngine.textContent = motorcycle.engine || "N/A";
        modalPower.textContent = motorcycle.power || "N/A";
        modalTorque.textContent = motorcycle.torque || "N/A";
        modalBrakes.textContent = motorcycle.brakes || "N/A";
        modalDescription.textContent = motorcycle.details || "Modelo disponible para conocer y reservar en nuestras sedes.";
        
        motoModal.style.display = "flex";
    }

    function renderModels(brand) {
        if (!modelsGrid) {
            return;
        }

        const models = motorcycles[brand] || [];
        const title = document.getElementById("models-title");
        const description = document.getElementById("models-description");

        if (title) title.textContent = `Motos ${brand}`;
        if (description) description.textContent = `Modelos destacados de ${brand} disponibles para conocer y reservar.`;

        modelsGrid.innerHTML = models.map((motorcycle, index) => `
            <article class="model-card">
                <div class="model-image" style="background-image: url('${motorcycle.image}')"></div>
                <div class="model-content">
                    <span class="model-type">${motorcycle.type}</span>
                    <h4>${motorcycle.name}</h4>
                    <strong>${motorcycle.price}</strong>
                    <button type="button" class="btn-ver-moto" data-brand="${brand}" data-index="${index}">Ver moto</button>
                </div>
            </article>
        `).join("");

        document.querySelectorAll(".btn-ver-moto").forEach(button => {
            button.addEventListener("click", (e) => {
                const b = e.target.getAttribute("data-brand");
                const idx = e.target.getAttribute("data-index");
                const selectedMoto = motorcycles[b][idx];
                showMotoDetails(selectedMoto);
            });
        });
    }

    if (modelsGrid) {
        const brandLinks = document.querySelectorAll(".brand-link");
        const brandCards = document.querySelectorAll(".brand-card[data-brand]");

        const selectBrand = (brand) => {
            brandLinks.forEach((link) => {
                link.classList.toggle("active", link.dataset.brand === brand);
            });
            renderModels(brand);
            const modelosSection = document.getElementById("modelos");
            if (modelosSection) {
                modelosSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        };

        brandLinks.forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                selectBrand(link.dataset.brand);
            });
        });

        brandCards.forEach((card) => {
            card.addEventListener("click", () => selectBrand(card.dataset.brand));
            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectBrand(card.dataset.brand);
                }
            });
        });

        renderModels("TVS");
    }

    // Lógica para Login conectada al Backend
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (email === "" || password === "") {
                showError("Por favor, completa todos los campos.");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await readApiResponse(response);

                if (!response.ok) {
                    throw new Error(data.error || "Credenciales inválidas");
                }

                alert("¡Inicio de sesión exitoso!");
                window.location.href = "dashboard.html";
            } catch (error) {
                showError(error instanceof TypeError
                    ? "No se pudo conectar con el servidor. Inícialo desde la carpeta backend y abre http://localhost:3000."
                    : error.message);
            }
        });
    }

    // Lógica para Registro conectada al Backend
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (name === "" || email === "" || password === "") {
                showError("Todos los campos son obligatorios.");
                return;
            }

            if (password.length < 6) {
                showError("La contraseña debe tener al menos 6 caracteres.");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await readApiResponse(response);

                if (!response.ok) {
                    throw new Error(data.error || "Error en el registro");
                }

                window.location.href = "dashboard.html";
            } catch (error) {
                showError(error instanceof TypeError
                    ? "No se pudo conectar con el servidor. Inícialo desde la carpeta backend y abre http://localhost:3000."
                    : error.message);
            }
        });
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
            setTimeout(() => {
                errorMessage.style.display = "none";
            }, 3000);
        }
    }
});