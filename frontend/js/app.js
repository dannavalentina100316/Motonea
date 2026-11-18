document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const errorMessage = document.getElementById("error-message");
    const modelsGrid = document.getElementById("models-grid");
    const btnLogout = document.getElementById("btn-logout");
    // Verificar que exista una sesión activa
if (window.location.pathname.endsWith("dashboard.html")) {
    const usuario = sessionStorage.getItem("motoneaUser");

    if (!usuario) {
        window.location.href = "index.html";
    }
}
 // Mostrar el nombre del usuario en el dashboard
const userGreeting = document.getElementById("user-greeting");
const usuarioSesion = sessionStorage.getItem("motoneaUser");

if (userGreeting && usuarioSesion) {
    const usuario = JSON.parse(usuarioSesion);
    userGreeting.textContent = `Hola, ${usuario.name}`;
}
    const btnVerCredito = document.getElementById("btn-ver-credito");
    const btnCatalogoCompleto = document.getElementById("btn-catalogo-completo");
    const btnCatalogoInicio = document.getElementById("btn-catalogo-inicio");
    const btnCampanasSeguridad = document.getElementById("btn-campanas-seguridad");
    const btnVehiculosElectricos = document.getElementById("btn-vehiculos-electricos");

    // Botones de categorías
    const btnVerTerreno = document.getElementById("btn-ver-terreno");
    const btnVerAutomaticas = document.getElementById("btn-ver-automaticas");
    const btnVerSemi = document.getElementById("btn-ver-semi");
    const btnVerDeportivas = document.getElementById("btn-ver-deportivas");
    const btnVerAltagama = document.getElementById("btn-ver-altagama");

    const API_URL = window.location.port === "3000" ? "/api" : "http://localhost:3000/api";

    // Lógica del botón Salir
    if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        sessionStorage.removeItem("motoneaUser");
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
        },
        seguridad: {
            title: "Campañas de seguridad vial",
            type: "Consejos para cada recorrido",
            price: "Tu seguridad empieza antes de salir",
            image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
            details: "Usa siempre un casco certificado y bien ajustado, además de prendas visibles y protección adecuada. Antes de cada viaje revisa frenos, llantas, luces y espejos. Respeta las señales, mantén una distancia segura y evita conducir si estás cansado."
        },
        "motos-electricas": {
            title: "Motos eléctricas",
            type: "Movilidad eléctrica",
            price: "Para tus recorridos diarios",
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Harley_Davidson_LiveWire_right_noBG.jpg/960px-Harley_Davidson_LiveWire_right_noBG.jpg",
            details: "Las motos eléctricas utilizan un motor alimentado por batería y se recargan conectándolas a una fuente compatible. Antes de elegir, compara autonomía, tiempo de carga, garantía y disponibilidad de servicio para el modelo específico."
        },
        "bicicletas-electricas": {
            title: "Bicicletas eléctricas",
            type: "Movilidad eléctrica",
            price: "Asistencia para pedalear",
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/LACMTA_Bike_Share_electric_bicycle_-_drive_side.jpg/960px-LACMTA_Bike_Share_electric_bicycle_-_drive_side.jpg",
            details: "La asistencia eléctrica complementa el pedaleo y puede hacer más cómodos los recorridos urbanos. Revisa autonomía, batería, modos de asistencia y las reglas locales aplicables a bicicletas eléctricas."
        },
        "patinetas-electricas": {
            title: "Patinetas eléctricas",
            type: "Movilidad eléctrica",
            price: "Una opción compacta",
            image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Ex_scooter%2C_Frankfurt_am_Main_%28LRM_20210815_134347%29.jpg/960px-Ex_scooter%2C_Frankfurt_am_Main_%28LRM_20210815_134347%29.jpg",
            details: "Las patinetas eléctricas están pensadas para desplazamientos cortos. Verifica autonomía, tiempo de carga, elementos de seguridad y las normas de circulación de tu ciudad antes de utilizarlas."
        }
    };

    function showAdvisoryInfo(info) {
        if (!info || !motoModal) return;

        modalImage.style.backgroundImage = `url('${info.image}')`;
        modalType.textContent = info.type;
        modalTitle.textContent = info.title;
        modalPrice.textContent = info.price;
        modalSpecsContainer.style.display = "none";
        modalDescription.textContent = info.details;
        motoModal.style.display = "flex";
    }

    document.querySelectorAll(".btn-asesoria").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const tipo = btn.getAttribute("data-tipo");
            showAdvisoryInfo(asesoriaInfo[tipo]);
        });
    });

    if (btnCampanasSeguridad) {
        btnCampanasSeguridad.addEventListener("click", () => {
            showAdvisoryInfo(asesoriaInfo.seguridad);
        });
    }

    if (btnVehiculosElectricos) {
        btnVehiculosElectricos.addEventListener("click", () => {
            document.getElementById("vehiculos-electricos")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    document.querySelectorAll(".btn-electric-info").forEach(button => {
        button.addEventListener("click", () => {
            showAdvisoryInfo(asesoriaInfo[button.dataset.tipo]);
        });
    });

    // Lógica para el botón "VER MÁS" de créditos
    if (btnVerCredito) {
        btnVerCredito.addEventListener("click", (e) => {
            e.preventDefault();
            showAdvisoryInfo(asesoriaInfo.credito);
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
                image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Flickr_-_ronsaunders47_-_SUZUKI_GT250._250cc_TWO_STROKE_TWIN.UK.jpg/960px-Flickr_-_ronsaunders47_-_SUZUKI_GT250._250cc_TWO_STROKE_TWIN.UK.jpg",
                imageCredit: "https://commons.wikimedia.org/wiki/File:Flickr_-_ronsaunders47_-_SUZUKI_GT250._250cc_TWO_STROKE_TWIN.UK.jpg",
                engine: "249 cc", power: "22 HP @ 8500 rpm", torque: "21 Nm @ 7000 rpm", brakes: "Disco ABS",
                details: "Estilo neo-retro con potencia destacada para rodadas urbanas y de carretera."
            },
            { 
                name: "One 125", 
                type: "Urbana", 
                price: "$8.990.000", 
                image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Motorcycle_World%2C_Whalley%2C_Surrey_%288253755811%29.jpg/960px-Motorcycle_World%2C_Whalley%2C_Surrey_%288253755811%29.jpg",
                imageCredit: "https://commons.wikimedia.org/wiki/File:Motorcycle_World,_Whalley,_Surrey_(8253755811).jpg",
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
                image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Kreta_%28GR%29%2C_Rethymno%2C_Motorroller_--_2023_--_8344_%28crop%29.jpg/960px-Kreta_%28GR%29%2C_Rethymno%2C_Motorroller_--_2023_--_8344_%28crop%29.jpg",
                imageCredit: "https://commons.wikimedia.org/wiki/File:Kreta_(GR),_Rethymno,_Motorroller_--_2023_--_8344_(crop).jpg",
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
                image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Triumph_21_%281962%29_-_7316813864.jpg/960px-Triumph_21_%281962%29_-_7316813864.jpg",
                imageCredit: "https://commons.wikimedia.org/wiki/File:Triumph_21_(1962)_-_7316813864.jpg",
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
                name: "Ninja 650",
                type: "Deportiva",
                price: "Consultar precio",
                image: "https://images.unsplash.com/photo-1606907568152-58fcb0a0a4e5?auto=format&fit=crop&w=900&q=80",
                engine: "649 cc Bicilíndrico",
                power: "Consultar ficha",
                torque: "Consultar ficha",
                brakes: "Consultar ficha",
                details: "Motocicleta deportiva de media cilindrada. Imagen ilustrativa; consulta la ficha técnica y disponibilidad de la versión."
            },
            { 
                name: "Z400", 
                type: "Naked", 
                price: "$31.990.000", 
                image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/US_Navy_050804-N-0879R-001_A_Sailor_rides_his_motorcycle_on_board_Naval_Station_Pearl_Harbor.jpg/500px-US_Navy_050804-N-0879R-001_A_Sailor_rides_his_motorcycle_on_board_Naval_Station_Pearl_Harbor.jpg",
                imageCredit: "https://commons.wikimedia.org/wiki/File:US_Navy_050804-N-0879R-001_A_Sailor_rides_his_motorcycle_on_board_Naval_Station_Pearl_Harbor.jpg",
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

        ],
        "Referencias Motonea": [
            {
                name: "Urbana 110",
                type: "Semiautomática (referencia)",
                price: "Consultar precio",
                image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/2026_Honda_Wave_110_Special_Edition_%28Alloy_Type%29.jpg/960px-2026_Honda_Wave_110_Special_Edition_%28Alloy_Type%29.jpg",
                imageCredit: "https://commons.wikimedia.org/wiki/File:2026_Honda_Wave_110_Special_Edition_(Alloy_Type).jpg",
                engine: "Consultar ficha",
                power: "Consultar ficha",
                torque: "Consultar ficha",
                brakes: "Consultar ficha",
                details: "Imagen y nombre de referencia para mostrar la categoría. Confirma con un asesor el modelo comercial, sus especificaciones y disponibilidad."
            },
            {
                name: "Urbana 125",
                type: "Semiautomática (referencia)",
                price: "Consultar precio",
                image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Honda_wave_110_in_kuala_lumpur.jpg/960px-Honda_wave_110_in_kuala_lumpur.jpg",
                imageCredit: "https://commons.wikimedia.org/wiki/File:Honda_wave_110_in_kuala_lumpur.jpg",
                engine: "Consultar ficha",
                power: "Consultar ficha",
                torque: "Consultar ficha",
                brakes: "Consultar ficha",
                details: "Imagen y nombre de referencia para mostrar la categoría. Confirma con un asesor el modelo comercial, sus especificaciones y disponibilidad."
            },
            {
                name: "Urbana 150",
                type: "Semiautomática (referencia)",
                price: "Consultar precio",
                image: "https://tse2.mm.bing.net/th/id/OIP.YaE740f7k0rctg2WV2x1wAHaEk?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                engine: "Consultar ficha",
                power: "Consultar ficha",
                torque: "Consultar ficha",
                brakes: "Consultar ficha",
                details: "Imagen y nombre de referencia para mostrar la categoría. Confirma con un asesor el modelo comercial, sus especificaciones y disponibilidad."
            }
        ]
    };

    const accessoryCatalog = {
        arrastre: {
            title: "Catálogo de kits de arrastre",
            description: "Referencias ilustrativas de cadenas y piñones. Confirma compatibilidad con marca, modelo y año de tu moto.",
            products: [
                {
                    name: "Kit de arrastre urbano",
                    reference: "KA-428H-01",
                    image: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Pignoni_50_cc.jpg",
                    imageCredit: "https://commons.wikimedia.org/wiki/File:Pignoni_50_cc.jpg",
                    details: "Referencia visual de piñón para transmisión. El paso y número de dientes deben confirmarse según la motocicleta."
                },
                {
                    name: "Cadena y transmisión tipo Jawa",
                    reference: "KA-520-02",
                    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Flickr_-_ronsaunders47_-_SPEEDWAY_MOTORCYCLE._JAWA_ENGINE..jpg/960px-Flickr_-_ronsaunders47_-_SPEEDWAY_MOTORCYCLE._JAWA_ENGINE..jpg",
                    imageCredit: "https://commons.wikimedia.org/wiki/File:Flickr_-_ronsaunders47_-_SPEEDWAY_MOTORCYCLE._JAWA_ENGINE..jpg",
                    details: "Imagen de referencia del conjunto de transmisión. Consulta la referencia compatible antes de comprar."
                }
            ]
        },
        frenos: {
            title: "Catálogo de partes de freno",
            description: "Discos y componentes de freno de referencia. La compatibilidad depende de la motocicleta.",
            products: [
                {
                    name: "Disco de freno delantero",
                    reference: "FR-DIS-01",
                    image: "https://upload.wikimedia.org/wikipedia/commons/8/88/Aisobrake1.jpg",
                    imageCredit: "https://commons.wikimedia.org/wiki/File:Aisobrake1.jpg",
                    details: "Componente de frenado mostrado como referencia. Verifica diámetro, anclajes y compatibilidad con tu moto."
                },
                {
                    name: "Discos delanteros para motocicleta",
                    reference: "FR-DIS-02",
                    image: "https://tse3.mm.bing.net/th/id/OIP.o15LkQoKbEM1ELQ_qorHGgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                    details: "Imagen de referencia de discos de freno. Consulta disponibilidad y aplicación para tu modelo."
                }
            ]
        },
        cascos: {
            title: "Catálogo de cascos",
            description: "Opciones de protección ilustrativas. Antes de comprar, verifica talla, ajuste y homologación vigente.",
            products: [
                {
                    name: "Casco integral",
                    reference: "CAS-IN-01",
                    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Full-Face_Helmet_9274.jpg/500px-Full-Face_Helmet_9274.jpg",
                    imageCredit: "https://commons.wikimedia.org/wiki/File:Full-Face_Helmet_9274.jpg",
                    details: "Casco integral de referencia. El diseño no confirma certificación ni disponibilidad comercial."
                },
                {
                    name: "Casco urbano",
                    reference: "CAS-UR-02",
                    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Couple_Riding_Motorcycle_in_Bike_lane_W_Lone_Mountain_Rd.jpg/500px-Couple_Riding_Motorcycle_in_Bike_lane_W_Lone_Mountain_Rd.jpg",
                    imageCredit: "https://commons.wikimedia.org/wiki/File:Couple_Riding_Motorcycle_in_Bike_lane_W_Lone_Mountain_Rd.jpg",
                    details: "Imagen de referencia de uso de casco en ciudad. Revisa el tipo de casco y su certificación antes de comprar."
                }
            ]
        },
        accesorios: {
            title: "Catálogo de accesorios para motociclista",
            description: "Elementos de protección y comodidad. Revisa materiales, tallas y especificaciones antes de elegir.",
            products: [
                {
                    name: "Guantes de conducción",
                    reference: "ACC-GUA-01",
                    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Hyod_racing_gloves_%2826574882235%29.jpg/500px-Hyod_racing_gloves_%2826574882235%29.jpg",
                    imageCredit: "https://commons.wikimedia.org/wiki/File:Hyod_racing_gloves_(26574882235).jpg",
                    details: "Guantes de referencia para conducción. La imagen no representa una oferta o marca disponible en Motonea."
                },
                {
                    name: "Guantes con protección",
                    reference: "ACC-GUA-02",
                    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Metal_Motorcycle_Gloves.jpg/500px-Metal_Motorcycle_Gloves.jpg",
                    imageCredit: "https://commons.wikimedia.org/wiki/File:Metal_Motorcycle_Gloves.jpg",
                    details: "Imagen de referencia de guantes con protección. Confirma talla y características con el proveedor."
                },
                {
                    name: "Equipo de protección",
                    reference: "ACC-EQP-03",
                    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/MotoEqipments_HelmetBootsJacketAndGloves.jpg/500px-MotoEqipments_HelmetBootsJacketAndGloves.jpg",
                    imageCredit: "https://commons.wikimedia.org/wiki/File:MotoEqipments_HelmetBootsJacketAndGloves.jpg",
                    details: "Conjunto de equipo mostrado como referencia visual. Consulta disponibilidad de cada elemento por separado."
                }
            ]
        },
        maleteros: {
            title: "Catálogo de maleteros y equipaje",
            description: "Baúles y maletas de referencia. Verifica capacidad, soportes y compatibilidad con tu motocicleta.",
            products: [
                {
                    name: "Juego de maletas laterales",
                    reference: "MAL-LAT-01",
                    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Kofferset02.JPG/500px-Kofferset02.JPG",
                    imageCredit: "https://commons.wikimedia.org/wiki/File:Kofferset02.JPG",
                    details: "Juego de equipaje lateral de referencia. Requiere verificar el sistema de anclaje compatible."
                },
                {
                    name: "Baúl trasero para scooter",
                    reference: "MAL-TR-02",
                    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Empty_nutshell_on_top_of_the_top-case_of_my_motorscooter%2C_just_after_a_squirrel_had_decided_to_use_it_as_a_safe_location_for_having_lunch.jpg/500px-Empty_nutshell_on_top_of_the_top-case_of_my_motorscooter%2C_just_after_a_squirrel_had_decided_to_use_it_as_a_safe_location_for_having_lunch.jpg",
                    imageCredit: "https://commons.wikimedia.org/wiki/File:Empty_nutshell_on_top_of_the_top-case_of_my_motorscooter,_just_after_a_squirrel_had_decided_to_use_it_as_a_safe_location_for_having_lunch.jpg",
                    details: "Imagen de referencia de un baúl trasero. Confirma capacidad y sistema de montaje antes de comprar."
                },
                {
                    name: "Baúl de viaje",
                    reference: "MAL-VIA-03",
                    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/SHAD_logo_on_top_case_2025JPG.jpg/500px-SHAD_logo_on_top_case_2025JPG.jpg",
                    imageCredit: "https://commons.wikimedia.org/wiki/File:SHAD_logo_on_top_case_2025JPG.jpg",
                    details: "Detalle de baúl para motocicleta usado como referencia visual. Marca y disponibilidad por confirmar."
                }
            ]
        }
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

    function renderMotorcycleCatalog(entries, titleText, descriptionText, showBackButton, activeBrand = "") {
        if (!modelsGrid) return;

        const title = document.getElementById("models-title");
        const description = document.getElementById("models-description");

        if (title) title.textContent = titleText;
        if (description) description.textContent = descriptionText;
        if (btnCatalogoCompleto) btnCatalogoCompleto.hidden = showBackButton;
        if (btnCatalogoInicio) btnCatalogoInicio.hidden = !showBackButton;
        document.querySelectorAll(".brand-link").forEach(link => {
            link.classList.toggle("active", !showBackButton && link.dataset.brand === activeBrand);
        });

        modelsGrid.innerHTML = entries.map(({ brand, motorcycle, index }) => `
            <article class="model-card">
                <img class="model-image" src="${motorcycle.image}" alt="${brand} ${motorcycle.name}, imagen de referencia" loading="lazy">
                <div class="model-content">
                    <span class="model-type">${brand} · ${motorcycle.type}</span>
                    <h4>${motorcycle.name}</h4>
                    <strong>${motorcycle.price}</strong>
                    <button type="button" class="btn-ver-moto-catalogo" data-brand="${brand}" data-index="${index}">Ver moto</button>
                    ${motorcycle.imageCredit ? `<a class="image-credit" href="${motorcycle.imageCredit}" target="_blank" rel="noopener noreferrer">Crédito de imagen</a>` : ""}
                </div>
            </article>
        `).join("");

        modelsGrid.querySelectorAll(".btn-ver-moto-catalogo").forEach(button => {
            button.addEventListener("click", () => {
                const brand = button.dataset.brand;
                const index = Number(button.dataset.index);
                showMotoDetails(motorcycles[brand][index]);
            });
        });

    }

    function renderModels(brand) {
        const models = motorcycles[brand] || [];
        const entries = models.map((motorcycle, index) => ({ brand, motorcycle, index }));
        renderMotorcycleCatalog(
            entries,
            `Motos ${brand}`,
            `Modelos destacados de ${brand} disponibles para conocer y reservar.`,
            false,
            brand
        );
    }

    function scrollToCatalog() {
        const modelosSection = document.getElementById("modelos");
        if (modelosSection) {
            modelosSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function renderCompleteCatalog() {
        const catalog = Object.entries(motorcycles).flatMap(([brand, models]) =>
            models.map((motorcycle, index) => ({ brand, motorcycle, index }))
        );
        renderMotorcycleCatalog(
            catalog,
            "Catálogo completo de motocicletas",
            `${catalog.length} modelos y referencias de todas nuestras marcas. Las imágenes son referenciales; consulta disponibilidad y ficha técnica.`,
            true
        );
        scrollToCatalog();
    }

    function renderAccessoryCatalog(category) {
        const catalog = accessoryCatalog[category];
        if (!catalog || !modelsGrid) return;

        if (btnCatalogoCompleto) btnCatalogoCompleto.hidden = true;
        if (btnCatalogoInicio) btnCatalogoInicio.hidden = false;
        document.querySelectorAll(".brand-link").forEach(link => link.classList.remove("active"));

        const title = document.getElementById("models-title");
        const description = document.getElementById("models-description");
        if (title) title.textContent = catalog.title;
        if (description) description.textContent = catalog.description;

        modelsGrid.innerHTML = catalog.products.map(product => `
            <article class="model-card product-card">
                <img class="model-image" src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="model-content">
                    <span class="model-type">${catalog.title}</span>
                    <h4>${product.name}</h4>
                    <p class="product-reference">Referencia: ${product.reference}</p>
                    <strong>Consultar precio</strong>
                    <button type="button" class="btn-ver-producto">Ver detalles</button>
                    ${product.imageCredit ? `<a class="image-credit" href="${product.imageCredit}" target="_blank" rel="noopener noreferrer">Crédito de imagen</a>` : ""}
                </div>
            </article>
        `).join("");

        modelsGrid.querySelectorAll(".btn-ver-producto").forEach((button, index) => {
            button.addEventListener("click", () => {
                const product = catalog.products[index];
                showAdvisoryInfo({
                    title: product.name,
                    type: catalog.title,
                    price: `Referencia: ${product.reference}`,
                    image: product.image,
                    details: product.details
                });
            });
        });
        scrollToCatalog();
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

    if (btnCatalogoCompleto) {
        btnCatalogoCompleto.addEventListener("click", renderCompleteCatalog);
    }

    if (btnCatalogoInicio) {
        btnCatalogoInicio.addEventListener("click", () => {
            renderModels("TVS");
            scrollToCatalog();
        });
    }

    document.querySelectorAll(".accessory-item").forEach(button => {
        button.addEventListener("click", () => {
            renderAccessoryCatalog(button.dataset.accessory);
        });
    });

    // --- FUNCIÓN GENÉRICA PARA FILTRAR POR CATEGORÍA ---
    function filtrarPorCategoria(palabrasClave, tituloSeccion, descSeccion) {
        if (!modelsGrid) return;

        const motosFiltradas = [];
        Object.keys(motorcycles).forEach(brandKey => {
            motorcycles[brandKey].forEach((moto, index) => {
                const tipo = (moto.type || "").toLowerCase();
                const coincide = palabrasClave.some(palabra => tipo.includes(palabra));
                if (coincide) {
                    motosFiltradas.push({ brand: brandKey, motorcycle: moto, index });
                }
            });
        });

        renderMotorcycleCatalog(
            motosFiltradas,
            tituloSeccion,
            descSeccion,
            true
        );
        if (motosFiltradas.length === 0) {
            modelsGrid.innerHTML = `<p class="empty-catalog">No hay modelos disponibles en esta categoría actualmente.</p>`;
        }
        scrollToCatalog();
    }

    // Eventos de los botones de categorías
    if (btnVerTerreno) {
        btnVerTerreno.addEventListener("click", (e) => {
            e.preventDefault();
            filtrarPorCategoria(["adventure", "supermoto", "todo terreno"], "Motos Todo Terreno", "Modelos de aventura y doble propósito. Las imágenes son de referencia; consulta disponibilidad y ficha técnica.");
        });
    }

    if (btnVerAutomaticas) {
        btnVerAutomaticas.addEventListener("click", (e) => {
            e.preventDefault();
            filtrarPorCategoria(["scooter"], "Motos Automáticas", "Scooters con transmisión automática. Las imágenes son de referencia; consulta disponibilidad y ficha técnica.");
        });
    }

    if (btnVerSemi) {
        btnVerSemi.addEventListener("click", (e) => {
            e.preventDefault();
            filtrarPorCategoria(["semiautomática"], "Motos Semiautomáticas", "Referencias visuales para esta categoría. Confirma con un asesor los modelos comerciales disponibles y sus especificaciones.");
        });
    }

    if (btnVerDeportivas) {
        btnVerDeportivas.addEventListener("click", (e) => {
            e.preventDefault();
            filtrarPorCategoria(["deportiva"], "Motos Deportivas", "Modelos de estilo deportivo. Las imágenes son de referencia; consulta disponibilidad y ficha técnica.");
        });
    }

    if (btnVerAltagama) {
        btnVerAltagama.addEventListener("click", (e) => {
            e.preventDefault();
            filtrarPorCategoria(["adventure", "touring"], "Motos de Alta Gama y Touring", "Tres referencias de aventura y turismo. Las imágenes son referenciales; consulta disponibilidad y ficha técnica.");
        });
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
sessionStorage.setItem("motoneaUser", JSON.stringify(data.user));

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

                sessionStorage.setItem("motoneaUser", JSON.stringify(data.user));
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