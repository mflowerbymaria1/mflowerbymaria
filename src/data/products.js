export const defaultCategories = [
    { id: 'cat-madre', name: 'Álbum de figuritas - Día de la Madre', slug: 'album-de-figuritas-dia-de-la-madre' },
    { id: 'cat-cuadernos-a4', name: 'Cuadernos A4 Sistema de discos 📓', slug: 'cuadernos-a4' },
    { id: 'cat-cuadernos-a5', name: 'Cuadernos A5 Sistema de discos 📓', slug: 'cuadernos-a5' },
    { id: 'cat-capsula-arg', name: 'Cápsula Argentina', slug: 'capsula-argentina' },
    { id: 'cat-ficheros', name: 'Ficheros N° 3', slug: 'ficheros-n-3' },
    { id: 'cat-block-hojas', name: 'Block de hojas', slug: 'block-de-hojas' },
    { id: 'cat-block-papeles', name: 'Block de papeles', slug: 'block-de-papeles' },
    { id: 'cat-libretas', name: 'Libretas A5', slug: 'libretas-a5' },
    { id: 'cat-para-sumar', name: 'Para sumar a tu carrito', slug: 'para-sumar-a-tu-carrito' },
    { id: 'cat-planners', name: 'Planners', slug: 'planners' },
    { id: 'cat-repuestos', name: 'Repuestos', slug: 'repuestos' },
    { id: 'cat-set-separadores', name: 'Set de separadores', slug: 'set-separadores' },
    { id: 'cat-stickers', name: 'Stickers & Varios', slug: 'stickers-varios' }
];

export const products = [
    // 1. ÁLBUM DÍA DE LA MADRE
    {
        id: "d67f9b95-c763-4685-8c1e-e3575bc26e58",
        name: "ÁLBUM DE FIGURITAS",
        category: "Álbum de figuritas - Día de la Madre",
        shortDescription: "El regalo perfecto para mamá. 31 fotos en sobres para completar.",
        description: "El regalo perfecto para mamá 💕\n\n• Tarjeta día de la madre\n• Stickers para decorar - EDICIÓN ESPECIAL\n• Álbum para completar\n• 5 sobres con figuritas (fotos)\n• Sobre transparente para guardado\n\nTOTAL DE FOTOS 31 (30 fotos verticales y 1 horizontal)\n\nEs un producto personalizado, al finalizar la compra nos envían las fotos por e-mail/whatsapp y nosotras nos encargamos del resto. (enviar las imágenes junto con su número de pedido).",
        price: "27.900",
        isBestSeller: true,
        stock: 50,
        image: "/images/banner_dia_de_la_madre.png",
        images: ["/images/banner_dia_de_la_madre.png"]
    },

    // 2. CUADERNOS A5 SISTEMA DE DISCOS
    {
        id: "99f9677a-3686-42df-8fe2-14ca0acd78f7",
        name: "Cuaderno A5 Snoopy",
        category: "Cuadernos A5 Sistema de discos 📓",
        shortDescription: "A5, 100 hojas, diseño exclusivo Snoopy + stickers de regalo 🐶✨",
        description: "¡El nuevo Cuaderno A5 Snoopy con sistema de discos inteligente no puede más de tierno y lindo! Diseñado con todo el amor y la magia de Snoopy para llenar tus días de ternura y organización perfecta.\n\nContiene:\n- Interior de 100 hojas A5 de excelente calidad.\n- 2 separadores internos con diseño exclusivo.\n- 1 señalador a juego.\n- Calendario 2026.\n- 6 temarios de examen y estudio.\n- Sistema de discos inteligente para agregar, sacar y reorganizar tus hojas como quieras.\n- 🎁 ¡De regalo! Planchita de stickers exclusivos de Snoopy para decorar tus apuntes y portadas.\n\nEl compañero más lindo para la facu, el cole, el trabajo o tus notas del día a día. [WHOLESALE:18785]",
        price: "28.900",
        isBestSeller: true,
        stock: 20,
        image: "/images/cuaderno_snoopy_front.jpg",
        images: [
            "/images/cuaderno_snoopy_front.jpg",
            "/images/cuaderno_snoopy_separador.jpg"
        ]
    },
    {
        id: "ce4ebaa4-7784-4fbc-b571-55eceb800b52",
        name: "Cuaderno Croissant A5 sistema de discos",
        category: "Cuadernos A5 Sistema de discos 📓",
        shortDescription: "A5, 100 hojas, diseño Croissant.",
        description: "Diseño exclusivo Croissant. Contiene: Interior 100 hojas A5, 2 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:17200]",
        price: "26.500",
        image: "/images/mockup_croissant_front.jpg",
        images: ["/images/mockup_croissant_front.jpg", "/images/mockup_croissant_back.jpg"]
    },
    {
        id: "cuaderno-honguitos",
        name: "Cuaderno A5 - Honguitos sistema de discos",
        category: "Cuadernos A5 Sistema de discos 📓",
        shortDescription: "A5, 100 hojas, diseño Honguitos.",
        description: "Diseño exclusivo Honguitos. Contiene: Interior 100 hojas A5, 2 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:17200]",
        price: "26.500",
        image: "/images/hongos_1.jpg",
        images: ["/images/hongos_1.jpg", "/images/hongos_2.jpg"]
    },
    {
        id: 106,
        name: "Cuaderno A5 Candy sistema de discos",
        category: "Cuadernos A5 Sistema de discos 📓",
        shortDescription: "A5, 100 hojas, diseño Candy.",
        description: "Diseño exclusivo Candy. Contiene: Interior 100 hojas A5, 2 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:17200]",
        price: "26.500",
        image: "/images/mockup_candy_front.jpg",
        images: ["/images/mockup_candy_front.jpg", "/images/mockup_candy_back.jpg"]
    },
    {
        id: 103,
        name: "Cuaderno A5 Pretty Girls sistema de discos",
        category: "Cuadernos A5 Sistema de discos 📓",
        shortDescription: "A5, 100 hojas, diseño Pretty Girls.",
        description: "Diseño exclusivo Pretty Girls. Contiene: Interior 100 hojas A5, 2 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:17200]",
        price: "26.500",
        isBestSeller: true,
        image: "/images/mockup_pretty_girls_front.jpg",
        images: ["/images/mockup_pretty_girls_front.jpg", "/images/mockup_pretty_girls_back.jpg"]
    },
    {
        id: "5eadcc0d-c0b6-4a42-a6f2-88cffd05e47e",
        name: "Cuaderno A5 Serena sistema de discos",
        category: "Cuadernos A5 Sistema de discos 📓",
        shortDescription: "A5, 100 hojas, diseño Serena.",
        description: "Diseño exclusivo Serena. Contiene: Interior 100 hojas A5, 2 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:17200]",
        price: "26.500",
        image: "/images/mockup_amelie_front.jpg",
        images: ["/images/mockup_amelie_front.jpg"]
    },

    // 3. CUADERNOS A4 SISTEMA DE DISCOS
    {
        id: "020c3add-7e0a-4fd8-9071-0639a363898c",
        name: "Cuaderno A4 FUTURA",
        category: "Cuadernos A4 Sistema de discos 📓",
        shortDescription: "A4, 100 hojas, 4 separadores, diseño exclusivo Futura.",
        description: "Diseño exclusivo Futura con sistema de discos inteligente.\n\nContiene:\n- Interior de 100 hojas A4 de excelente calidad y gramaje.\n- 4 separadores internos con diseño exclusivo.\n- Calendario 2026.\n- 6 temarios de examen y estudio.\n- Sistema de discos inteligente para agregar, sacar y reorganizar tus hojas como quieras. [WHOLESALE:21000]",
        price: "31.900",
        isBestSeller: true,
        stock: 15,
        image: "/images/cuaderno_futura_front.jpg",
        images: [
            "/images/cuaderno_futura_front.jpg",
            "/images/cuaderno_futura_back.jpg"
        ]
    },
    {
        id: "eace54b2-8062-48d9-bc4c-ee4beaca3201",
        name: "Cuaderno A4 Croissant",
        category: "Cuadernos A4 Sistema de discos 📓",
        shortDescription: "A4, 100 hojas, diseño Croissant.",
        description: "Diseño exclusivo Croissant. Contiene: Interior 100 hojas A4, 2 separadores internos, 1 señalador, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        isBestSeller: true,
        image: "/images/mockup_croissant_back.jpg",
        images: ["/images/mockup_croissant_back.jpg", "/images/mockup_croissant_front.jpg"]
    },
    {
        id: "b7962807-6cb8-4607-ba84-b01b7816f4c7",
        name: "Cuaderno A4 Candy sistema de discos",
        category: "Cuadernos A4 Sistema de discos 📓",
        shortDescription: "A4, 100 hojas, diseño Candy.",
        description: "Diseño exclusivo Candy. Contiene: Interior 100 hojas A4, 2 separadores internos, 1 señalador, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_candy_front.jpg",
        images: ["/images/mockup_candy_front.jpg", "/images/mockup_candy_back.jpg"]
    },
    {
        id: "2825de91-c921-4ced-a59c-4d85313020a6",
        name: "Cuaderno A4 Cherry sistema de discos",
        category: "Cuadernos A4 Sistema de discos 📓",
        shortDescription: "A4, 100 hojas, diseño Cherry.",
        description: "Diseño exclusivo Cherry. Contiene: Interior 100 hojas A4, 2 separadores internos, 1 señalador, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_amelie_front.jpg",
        images: ["/images/mockup_amelie_front.jpg"]
    },
    {
        id: "5671cf27-a954-4a68-b239-ba821c771354",
        name: "Cuaderno A4 Aurora sistema de discos",
        category: "Cuadernos A4 Sistema de discos 📓",
        shortDescription: "A4, 100 hojas, diseño Aura.",
        description: "Diseño exclusivo Aura. Contiene: Interior 100 hojas A4, 2 separadores internos, 1 señalador, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_pretty_girls_front.jpg",
        images: ["/images/mockup_pretty_girls_front.jpg"]
    },
    {
        id: "a35cada1-ba0e-43f9-b858-003896a2082d",
        name: "Cuaderno A4 Más amor sistema de discos",
        category: "Cuadernos A4 Sistema de discos 📓",
        shortDescription: "A4, 100 hojas, diseño Más amor.",
        description: "Diseño exclusivo Más amor. Contiene: Interior 100 hojas A4, 2 separadores internos, 1 señalador, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_yendo_front.jpg",
        images: ["/images/mockup_yendo_front.jpg"]
    },
    {
        id: "e4024e4c-707d-46ee-861a-4dc89438cc8e",
        name: "Cuaderno A4 Serena sistema de discos",
        category: "Cuadernos A4 Sistema de discos 📓",
        shortDescription: "A4, 100 hojas, diseño Serena.",
        description: "Diseño exclusivo Serena. Contiene: Interior 100 hojas A4, 2 separadores internos, 1 señalador, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_amelie_front.jpg",
        images: ["/images/mockup_amelie_front.jpg"]
    },
    {
        id: 102,
        name: "Cuaderno A4 Amelie sistema de discos",
        category: "Cuadernos A4 Sistema de discos 📓",
        shortDescription: "A4, 100 hojas, diseño Amelie.",
        description: "Diseño exclusivo Amelie. Contiene: Interior 100 hojas A4, 2 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        isBestSeller: true,
        image: "/images/mockup_amelie_front.jpg",
        images: ["/images/mockup_amelie_front.jpg", "/images/mockup_amelie_back.jpg"]
    },
    {
        id: 13,
        name: "Cuaderno A4 Pinky Jirafa sistema de discos",
        category: "Cuadernos A4 Sistema de discos 📓",
        shortDescription: "A4, 100 hojas, diseño Pinky Jirafa.",
        description: "Diseño exclusivo Pinky Jirafa. Contiene: Interior 100 hojas A4, 2 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_jirafa_back.jpg",
        images: ["/images/mockup_jirafa_back.jpg", "/images/mockup_jirafa_front.jpg"]
    },
    {
        id: 104,
        name: "Cuaderno A4 Coffee Time sistema de discos",
        category: "Cuadernos A4 Sistema de discos 📓",
        shortDescription: "A4, 100 hojas, diseño Coffee Time.",
        description: "Diseño exclusivo Coffee Time. Contiene: Interior 100 hojas A4, 2 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_coffee_time_front.jpg",
        images: ["/images/mockup_coffee_time_front.jpg"]
    },
    {
        id: 105,
        name: "Cuaderno A4 Yendo sistema de discos",
        category: "Cuadernos A4 Sistema de discos 📓",
        shortDescription: "A4, 100 hojas, diseño Yendo.",
        description: "Diseño exclusivo Yendo. Contiene: Interior 100 hojas A4, 2 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_yendo_front.jpg",
        images: ["/images/mockup_yendo_front.jpg", "/images/mockup_yendo_back.jpg"]
    },

    // 4. CÁPSULA ARGENTINA
    {
        id: "2",
        name: "Cuaderno A4 Pink Buenos Aires sistema de discos",
        category: "Cápsula Argentina",
        shortDescription: "A4, 90 hojas, anillado inteligente.",
        description: "Contiene: Interior 90 hojas A4, 3 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos de colores (no se pueden elegir). [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_combinado_ia.png",
        images: ["/images/mockup_combinado_ia.png", "/images/mockup_back_cover.png"]
    },
    {
        id: "12",
        name: "Cuaderno A4 Sol de Mayo sistema de discos",
        category: "Cápsula Argentina",
        shortDescription: "A4, 100 hojas, diseño Sol de Mayo.",
        description: "Edición Limitada. Diseño exclusivo Sol de Mayo. Contiene: Interior 100 hojas A4, 2 separadores internos, calendario 2026, 6 temarios de exámen, anillado inteligente, discos. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_sol_de_mayo_front.jpg",
        images: ["/images/mockup_sol_de_mayo_front.jpg", "/images/mockup_sol_de_mayo_back.jpg"]
    },
    {
        id: "8bd15072-44f0-4dc7-aaa1-274dd8519613",
        name: "Cuaderno A4 Malvinas Argentinas",
        category: "Cápsula Argentina",
        shortDescription: "A4, 100 hojas, sistema de discos.",
        description: "Edición Limitada Cápsula Argentina. Diseño exclusivo \"Malvinas Argentinas\". Contiene: Interior 100 hojas A4, 2 separadores internos, 1 señalador, calendario 2026, 6 temarios de exámen, anillado inteligente y discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_sol_de_mayo_front.jpg",
        images: ["/images/mockup_sol_de_mayo_front.jpg"]
    },
    {
        id: "72d015d8-8bad-42bb-aa40-77a65140d1fc",
        name: "Cuaderno A4 AFA",
        category: "Cápsula Argentina",
        shortDescription: "A4, 100 hojas, sistema de discos.",
        description: "Edición Limitada Cápsula Argentina. Diseño exclusivo \"AFA\". Contiene: Interior 100 hojas A4, 2 separadores internos, 1 señalador, calendario 2026, 6 temarios de exámen, anillado inteligente y discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_sol_de_mayo_front.jpg",
        images: ["/images/mockup_sol_de_mayo_front.jpg"]
    },
    {
        id: "2dbbf727-6c61-434f-a490-14a575c3d6c5",
        name: "Cuaderno A4 Mi Buenos Aires querido",
        category: "Cápsula Argentina",
        shortDescription: "A4, 100 hojas, sistema de discos.",
        description: "Edición Limitada Cápsula Argentina. Diseño exclusivo \"Mi Buenos Aires querido\". Contiene: Interior 100 hojas A4, 2 separadores internos, 1 señalador, calendario 2026, 6 temarios de exámen, anillado inteligente y discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/mockup_combinado_ia.png",
        images: ["/images/mockup_combinado_ia.png"]
    },
    {
        id: "4d920446-d890-4f1c-bc60-32f109147930",
        name: "Cuaderno A4 Obelisco",
        category: "Cápsula Argentina",
        shortDescription: "A4, 100 hojas, sistema de discos.",
        description: "Edición Limitada Cápsula Argentina. Diseño exclusivo \"Obelisco\". Contiene: Interior 100 hojas A4, 2 separadores internos, 1 señalador, calendario 2026, 6 temarios de exámen, anillado inteligente y discos de colores. [WHOLESALE:21000]",
        price: "31.900",
        image: "/images/planner_obelisco_original.jpg",
        images: ["/images/planner_obelisco_original.jpg"]
    },
    {
        id: "aadcfa44-a929-428b-9de8-0ae07520b5fa",
        name: "Cuaderno A5 Sean Eternos",
        category: "Cápsula Argentina",
        shortDescription: "A5, 100 hojas, sistema de discos.",
        description: "Edición Limitada Cápsula Argentina. Diseño exclusivo \"Sean Eternos\". Contiene: Interior 100 hojas A5, 2 separadores internos, 1 señalador, calendario 2026, 6 temarios de exámen, anillado inteligente y discos de colores. [WHOLESALE:17200]",
        price: "26.900",
        image: "/images/mockup_sol_de_mayo_front.jpg",
        images: ["/images/mockup_sol_de_mayo_front.jpg"]
    },
    {
        id: "943ae53c-167f-4d6a-b109-7b8b681a7699",
        name: "Cuaderno A5 Gloria Eterna",
        category: "Cápsula Argentina",
        shortDescription: "A5, 100 hojas, sistema de discos.",
        description: "Edición Limitada Cápsula Argentina. Diseño exclusivo \"Gloria Eterna\". Contiene: Interior 100 hojas A5, 2 separadores internos, 1 señalador, calendario 2026, 6 temarios de exámen, anillado inteligente y discos de colores. [WHOLESALE:17200]",
        price: "26.900",
        image: "/images/mockup_sol_de_mayo_front.jpg",
        images: ["/images/mockup_sol_de_mayo_front.jpg"]
    },

    // 5. LIBRETAS A5
    {
        id: "7bc995e9-0a7e-4a34-8f5c-38fb542ea298",
        name: "Libretas A5 PACK X 2",
        category: "Libretas A5",
        shortDescription: "Elegí tus dos diseños favoritos. 24 hojas lisas.",
        description: "Elegí tus dos diseños favoritos. Ideales para llevar a todos lados y plasmar tus mejores ideas.\n\nCaracterísticas:\n- Tapa blanda flexible de alta calidad.\n- Viene con 24 hojas lisas listas para escribir, tomar notas o dibujar.\n- Medidas: A5 (15 x 21 cm aprox). [WHOLESALE:9800]",
        price: "15.000",
        isBestSeller: true,
        image: "/images/mockup_candy_front.jpg",
        images: ["/images/mockup_candy_front.jpg"]
    },
    {
        id: "5f589d3a-0fe5-4b33-83cc-3c7e3f08ca77",
        name: "Libreta A5 Gratitud",
        category: "Libretas A5",
        shortDescription: "Libreta A5 de 24 hojas lisas, diseño Gratitud.",
        description: "Libreta A5 de tapa blanda flexible plastificada. Ideal para notas diarias, journaling o gratitud. [WHOLESALE:5200]",
        price: "8.500",
        image: "/images/mockup_pretty_girls_front.jpg",
        images: ["/images/mockup_pretty_girls_front.jpg"]
    },
    {
        id: "a1c69a0b-b376-4962-8bcb-df5642c4260f",
        name: "Libreta A5 Flora",
        category: "Libretas A5",
        shortDescription: "Libreta A5 de 24 hojas lisas, diseño Flora.",
        description: "Libreta A5 de tapa blanda flexible plastificada. Ideal para notas diarias y dibujo. [WHOLESALE:5200]",
        price: "8.500",
        image: "/images/mockup_amelie_front.jpg",
        images: ["/images/mockup_amelie_front.jpg"]
    },
    {
        id: "c8f3317b-0d06-4d36-bead-779e2625c1ad",
        name: "Libreta A5 Smile",
        category: "Libretas A5",
        shortDescription: "Libreta A5 de 24 hojas lisas, diseño Smile.",
        description: "Libreta A5 de tapa blanda flexible plastificada. [WHOLESALE:5200]",
        price: "8.500",
        image: "/images/mockup_croissant_front.jpg",
        images: ["/images/mockup_croissant_front.jpg"]
    },
    {
        id: "07f47305-057e-4f26-83dd-27f68447ab94",
        name: "Libreta A5 Sardinas",
        category: "Libretas A5",
        shortDescription: "Libreta A5 de 24 hojas lisas, diseño Sardinas.",
        description: "Libreta A5 de tapa blanda flexible plastificada con diseño de sardinas aesthetic. [WHOLESALE:5200]",
        price: "8.500",
        image: "/images/mockup_salchicha_front.jpg",
        images: ["/images/mockup_salchicha_front.jpg"]
    },

    // 6. FICHEROS N° 3
    {
        id: 101,
        name: "Fichero N° 3 Perro Salchicha",
        category: "Ficheros N° 3",
        shortDescription: "Fichero de estudio diseño Perro Salchicha.",
        description: "Diseño exclusivo Perro Salchicha. Complemento ideal para organizar tus fichas de estudio o notas rápidas. Tamaño fichero N° 3, viene con 3 separadores, sistema anillado de discos inteligente. [WHOLESALE:18200]",
        price: "28.000",
        image: "/images/mockup_salchicha_front.jpg",
        images: ["/images/mockup_salchicha_front.jpg", "/images/mockup_salchicha_back.jpg"]
    },
    {
        id: 14,
        name: "Fichero N° 3 Maleva",
        category: "Ficheros N° 3",
        shortDescription: "Fichero de estudio diseño Maleva.",
        description: "Diseño exclusivo Maleva. Complemento ideal para organizar tus fichas de estudio o notas rápidas. Tamaño fichero N° 3, viene con 3 separadores, sistema anillado de discos inteligente. [WHOLESALE:18200]",
        price: "28.000",
        image: "/images/mockup_maleva_front.jpg",
        images: ["/images/mockup_maleva_front.jpg", "/images/mockup_maleva_back.jpg"]
    },

    // 7. BLOCK DE HOJAS
    {
        id: "991c1ca3-826d-468c-a9fd-3a0585882066",
        name: "Midi block SUERTUDO",
        category: "Block de hojas",
        shortDescription: "Block de hojas A5, 40 hojas arrancables con diseño Suertudo.",
        description: "Práctico y versátil, el tamaño justo para acompañarte todos los días en tu escritorio o en la cartera. Cuenta con diseño Suertudo para anotar notas, tareas por hacer y prioridades del día.\n\nContiene: 40 hojas en Block. Tamaño A5 (15 x 21 cm aprox). [WHOLESALE:6900]",
        price: "12.000",
        image: "/images/block_midi_a5.jpg",
        images: ["/images/block_midi_a5.jpg"]
    },
    {
        id: "aacc4c15-e7dd-4e29-a55a-6daaae7a2591",
        name: "Mega block ANIMAL PRINT",
        category: "Block de hojas",
        shortDescription: "Block de hojas A4 extra grande, 40 hojas, diseño Animal Print.",
        description: "Espacio de sobra para planificar en grande. Tu mejor aliado de escritorio con diseño Animal Print para organizar tus días, materias, proyectos y listas de tareas.\n\nContiene: 40 hojas en Block. Tamaño A4 (21 x 29.7 cm aprox). [WHOLESALE:16500]",
        price: "24.900",
        image: "/images/block_mega_a4.jpg",
        images: ["/images/block_mega_a4.jpg"]
    },
    {
        id: "f23acd37-0b96-45db-b8a4-f62eeb9afbb2",
        name: "BABY Block",
        category: "Block de hojas",
        shortDescription: "Block de hojas A6 mini, 40 hojas.",
        description: "Adorable y súper compacto. El tamaño mini ideal para llevar siempre a mano para anotar recordatorios y notas al instante.\n\nContiene: 40 hojas en Block. Tamaño A6 (10 x 15 cm aprox). [WHOLESALE:3500]",
        price: "6.800",
        image: "/images/block_baby_a6.jpg",
        images: ["/images/block_baby_a6.jpg"]
    },
    {
        id: "baa29725-af33-409e-b5e0-6cfa2cc135f4",
        name: "MIDI Block",
        category: "Block de hojas",
        shortDescription: "Block de hojas A5, 40 hojas.",
        description: "Práctico y versátil, el tamaño justo para acompañarte todos los días en tu escritorio o en la cartera. Cuenta con secciones especiales para marcar hidratación, notas, tareas por hacer y prioridades del día.\n\nContiene: 40 hojas en Block. Tamaño A5 (15 x 21 cm aprox). [WHOLESALE:6900]",
        price: "12.000",
        image: "/images/block_midi_a5.jpg",
        images: ["/images/block_midi_a5.jpg"]
    },
    {
        id: "8b0deba4-a64a-4949-a6fd-ec9f491e5c19",
        name: "MEGA Block",
        category: "Block de hojas",
        shortDescription: "Block de hojas A4 extra grande, 50 hojas.",
        description: "Espacio de sobra para planificar en grande. Tu mejor aliado de escritorio para organizar tus días, materias, proyectos y listas de tareas.\n\nContiene: 50 hojas en Block. Tamaño A4 (21 x 29.7 cm aprox). [WHOLESALE:16500]",
        price: "24.900",
        image: "/images/block_mega_a4.jpg",
        images: ["/images/block_mega_a4.jpg"]
    },
    {
        id: "block-cerezas",
        name: "Block A5 Cereza",
        category: "Block de hojas",
        shortDescription: "Block de notas rayado, diseño Cerezas.",
        description: "Block de hojas rayado diseño Cerezas. Práctico y hermoso para llevar a todos lados, anotar recordatorios, notas rápidas o listas. [WHOLESALE:4500]",
        price: "7.500",
        image: "/images/block_hojas_cerezas.jpg",
        images: ["/images/block_hojas_cerezas.jpg"]
    },
    {
        id: "block-osito",
        name: "Block A5 Osito Gomita",
        category: "Block de hojas",
        shortDescription: "Block de notas To Do List, diseño Osito.",
        description: "Block de hojas diseño To Do List Osito. Perfecto para anotar todas tus tareas diarias, hacer listas y organizarte con estilo. [WHOLESALE:4500]",
        price: "7.500",
        image: "/images/block_hojas_osito.jpg",
        images: ["/images/block_hojas_osito.jpg"]
    },

    // 8. BLOCK DE PAPELES
    {
        id: "block-inspiracion",
        name: "Block de papeles A5 Colección Inspiración",
        category: "Block de papeles",
        shortDescription: "Set de 24 papeles en tamaño A5, diseño Colección Inspiración.",
        description: "Block de papeles tamaño A5. Contiene 24 papeles con hermosos diseños de la Colección Inspiración. Ideales para decorar tu journal, hacer collages, notas o lo que te imagines. [WHOLESALE:7500]",
        price: "12.000",
        image: "/images/block_papeles_inspiracion_1.jpg",
        images: ["/images/block_papeles_inspiracion_1.jpg", "/images/block_papeles_inspiracion_2.jpg"]
    },

    // 9. PARA SUMAR A TU CARRITO
    {
        id: "f4a4f935-d583-4b81-9688-70d8b8dc2525",
        name: "Lapicera SERENA",
        category: "Para sumar a tu carrito",
        shortDescription: "Tinta azul, mecanismo retráctil y cuerpo en suaves colores pasteles ✨",
        description: "La lapicera que no puede faltar en tu cartuchera. Su diseño moderno en suaves tonos pasteles se combina con un trazo súper suave y fluido de tinta azul de secado rápido. [WHOLESALE:800]",
        price: "1.200",
        image: "/images/lapicera_serena.jpg",
        images: ["/images/lapicera_serena.jpg"]
    },
    {
        id: "bc333bdd-aa55-4199-9040-e0cc49232c04",
        name: "Porta lapiceras ARCOIRIS",
        category: "Para sumar a tu carrito",
        shortDescription: "Organizador de escritorio diseño Arcoíris en delicado rosa pastel 🌈",
        description: "El toque tierno y aesthetic que tu escritorio estaba esperando. Con su diseño de arcoíris en delicado tono rosa pastel y divisiones funcionales, es perfecto para tener a mano tus lapiceras, marcadores y pinceles favoritos siempre ordenados. [WHOLESALE:14500]",
        price: "23.000",
        image: "/images/porta_lapiceras_arcoiris.jpg",
        images: ["/images/porta_lapiceras_arcoiris.jpg"]
    },
    {
        id: "5a69a967-7ad4-4009-b46b-4db8ea020517",
        name: "Perrito Salchicha",
        category: "Para sumar a tu carrito",
        shortDescription: "Figura decorativa de perrito salchicha en tono rosa pastel para tu escritorio 🐾💖",
        description: "El detalle más tierno y aesthetic para llenar tu escritorio de estilo y personalidad. Diseñado con forma de perrito salchicha en un delicado tono rosa pastel, es el compañero ideal para tu rincón de estudio o trabajo. [WHOLESALE:11500]",
        price: "18.000",
        image: "/images/perrito_salchicha_deco.jpg",
        images: ["/images/perrito_salchicha_deco.jpg"]
    },
    {
        id: "920a7300-5857-4a0a-916e-468ba1496131",
        name: "Mini resaltadores AURORA",
        category: "Para sumar a tu carrito",
        shortDescription: "Pack x 6 mini resaltadores tonos pastel en estuche de PVC ✨",
        description: "Un set adorable y súper práctico para llenar tus apuntes y lecturas de colores suaves y prolijos. Vienen en tamaño mini para llevarlos a todos lados sin ocupar espacio en un estuche de PVC reutilizable. [WHOLESALE:7800]",
        price: "12.500",
        image: "/images/mini_resaltadores_aurora.jpg",
        images: ["/images/mini_resaltadores_aurora.jpg"]
    },

    // 10. PLANNERS
    {
        id: "aebf00a5-b180-4659-865f-550848e4755e",
        name: "Planner A4",
        category: "Planners",
        shortDescription: "Planner horizontal perpetuo, 50 hojas A4.",
        description: "Contiene: planner horizontal, 50 hojas A4. El interior es perpetuo. Organización semanal y mensual: 12 planificadores mensuales para una visión clara de tus meses, 60 planificadores semanales, y 20 hojas de notas. Sistema de discos inteligente. [WHOLESALE:21000]",
        price: "32.000",
        isBestSeller: true,
        image: "/images/planner_obelisco_original.jpg",
        images: ["/images/planner_obelisco_original.jpg"]
    },

    // 11. STICKERS & VARIOS
    {
        id: 8,
        name: "Plancha de stickers troquelados Cositas ricas",
        category: "Stickers & Varios",
        shortDescription: "Stickers autoadhesivos troquelados diseño Galletitas y cositas ricas.",
        description: "Papel autoadhesivo brillante troquelado, listo para despegar y pegar en tus cuadernos, journal o apuntes. [WHOLESALE:5500]",
        price: "8.500",
        isBestSeller: true,
        image: "/images/stickers_galletitas.jpg",
        images: ["/images/stickers_galletitas.jpg"]
    },
    {
        id: 107,
        name: "Plancha de stickers troquelados Carita feliz",
        category: "Stickers & Varios",
        shortDescription: "Stickers autoadhesivos troquelados diseño Caritas sonrientes.",
        description: "Papel autoadhesivo brillante troquelado, listo para despegar y pegar en tus cuadernos, journal o apuntes. [WHOLESALE:5500]",
        price: "8.500",
        image: "/images/stickers_caritas.jpg",
        images: ["/images/stickers_caritas.jpg"]
    },

    // 12. SET DE SEPARADORES
    {
        id: "ee10e155-2422-48b2-9b90-7a1c95409fa9",
        name: "Set de separadores de materias",
        category: "Set de separadores",
        shortDescription: "Set de 3 separadores resistentes para cuadernos con discos.",
        description: "Complemento ideal para organizar tus cuadernos, estos separadores son resistentes y plastificados. [WHOLESALE:3900]",
        price: "6.000",
        image: "/images/mockup_arg_interior_1.png",
        images: ["/images/mockup_arg_interior_1.png"]
    },

    // 13. REPUESTOS (TODAS LAS VARIEDADES COMPLETAS)
    {
        id: "rep-a4-blanco-ray",
        name: "Repuesto Hojas Rayadas A4 (Blanco)",
        category: "Repuestos",
        shortDescription: "100 hojas rayadas A4 papel blanco 80g.",
        description: "Repuesto para cuaderno A4 sistema de discos. Contiene 100 hojas en papel blanco de 80 gr. [WHOLESALE:10400]",
        price: "16.000",
        image: "/images/repuestos_svg/a4_blanco_rayadas.svg",
        images: ["/images/repuestos_svg/a4_blanco_rayadas.svg"]
    },
    {
        id: "rep-a4-blanco-cuad",
        name: "Repuesto Hojas Cuadriculadas A4 (Blanco)",
        category: "Repuestos",
        shortDescription: "100 hojas cuadriculadas A4 papel blanco 80g.",
        description: "Repuesto para cuaderno A4 sistema de discos. Contiene 100 hojas en papel blanco de 80 gr. [WHOLESALE:10400]",
        price: "16.000",
        image: "/images/repuestos_svg/a4_blanco_cuadriculadas.svg",
        images: ["/images/repuestos_svg/a4_blanco_cuadriculadas.svg"]
    },
    {
        id: "rep-a4-blanco-punt",
        name: "Repuesto Hojas Punteadas A4 (Blanco)",
        category: "Repuestos",
        shortDescription: "100 hojas punteadas A4 papel blanco 80g.",
        description: "Repuesto para cuaderno A4 sistema de discos. Contiene 100 hojas en papel blanco de 80 gr. [WHOLESALE:10400]",
        price: "16.000",
        image: "/images/repuestos_svg/a4_blanco_punteadas.svg",
        images: ["/images/repuestos_svg/a4_blanco_punteadas.svg"]
    },
    {
        id: "rep-a4-blanco-lis",
        name: "Repuesto Hojas Lisas A4 (Blanco)",
        category: "Repuestos",
        shortDescription: "100 hojas lisas A4 papel blanco 80g.",
        description: "Repuesto para cuaderno A4 sistema de discos. Contiene 100 hojas en papel blanco de 80 gr. [WHOLESALE:10400]",
        price: "16.000",
        image: "/images/repuestos_svg/a4_blanco_lisas.svg",
        images: ["/images/repuestos_svg/a4_blanco_lisas.svg"]
    },
    {
        id: "rep-a4-nat-ray",
        name: "Repuesto Hojas Rayadas A4 (Natural)",
        category: "Repuestos",
        shortDescription: "100 hojas rayadas A4 papel natural ahuesado 80g.",
        description: "Repuesto para cuaderno A4 sistema de discos. Contiene 100 hojas en papel natural ecológico de 80 gr. [WHOLESALE:10400]",
        price: "16.000",
        image: "/images/repuestos_svg/a4_natural_rayadas.svg",
        images: ["/images/repuestos_svg/a4_natural_rayadas.svg"]
    },
    {
        id: "rep-a4-nat-cuad",
        name: "Repuesto Hojas Cuadriculadas A4 (Natural)",
        category: "Repuestos",
        shortDescription: "100 hojas cuadriculadas A4 papel natural 80g.",
        description: "Repuesto para cuaderno A4 sistema de discos. Contiene 100 hojas en papel natural de 80 gr. [WHOLESALE:10400]",
        price: "16.000",
        image: "/images/repuestos_svg/a4_natural_cuadriculadas.svg",
        images: ["/images/repuestos_svg/a4_natural_cuadriculadas.svg"]
    },
    {
        id: "rep-a4-nat-punt",
        name: "Repuesto Hojas Punteadas A4 (Natural)",
        category: "Repuestos",
        shortDescription: "100 hojas punteadas A4 papel natural 80g.",
        description: "Repuesto para cuaderno A4 sistema de discos. Contiene 100 hojas en papel natural de 80 gr. [WHOLESALE:10400]",
        price: "16.000",
        image: "/images/repuestos_svg/a4_natural_punteadas.svg",
        images: ["/images/repuestos_svg/a4_natural_punteadas.svg"]
    },
    {
        id: "rep-a4-nat-lis",
        name: "Repuesto Hojas Lisas A4 (Natural)",
        category: "Repuestos",
        shortDescription: "100 hojas lisas A4 papel natural 80g.",
        description: "Repuesto para cuaderno A4 sistema de discos. Contiene 100 hojas en papel natural de 80 gr. [WHOLESALE:10400]",
        price: "16.000",
        image: "/images/repuestos_svg/a4_natural_lisas.svg",
        images: ["/images/repuestos_svg/a4_natural_lisas.svg"]
    },
    {
        id: "rep-a5-blanco-ray",
        name: "Repuesto Hojas Rayadas A5 (Blanco)",
        category: "Repuestos",
        shortDescription: "100 hojas rayadas A5 papel blanco 90g.",
        description: "Repuesto para cuaderno A5 sistema de discos. Contiene 100 hojas en papel blanco de 90 gr. [WHOLESALE:8800]",
        price: "13.500",
        image: "/images/repuestos_svg/a5_blanco_rayadas.svg",
        images: ["/images/repuestos_svg/a5_blanco_rayadas.svg"]
    },
    {
        id: "rep-a5-blanco-cuad",
        name: "Repuesto Hojas Cuadriculadas A5 (Blanco)",
        category: "Repuestos",
        shortDescription: "100 hojas cuadriculadas A5 papel blanco 90g.",
        description: "Repuesto para cuaderno A5 sistema de discos. Contiene 100 hojas en papel blanco de 90 gr. [WHOLESALE:8800]",
        price: "13.500",
        image: "/images/repuestos_svg/a5_blanco_cuadriculadas.svg",
        images: ["/images/repuestos_svg/a5_blanco_cuadriculadas.svg"]
    },
    {
        id: "rep-a5-blanco-punt",
        name: "Repuesto Hojas Punteadas A5 (Blanco)",
        category: "Repuestos",
        shortDescription: "100 hojas punteadas A5 papel blanco 90g.",
        description: "Repuesto para cuaderno A5 sistema de discos. Contiene 100 hojas en papel blanco de 90 gr. [WHOLESALE:8800]",
        price: "13.500",
        image: "/images/repuestos_svg/a5_blanco_punteadas.svg",
        images: ["/images/repuestos_svg/a5_blanco_punteadas.svg"]
    },
    {
        id: "rep-a5-blanco-lis",
        name: "Repuesto Hojas Lisas A5 (Blanco)",
        category: "Repuestos",
        shortDescription: "100 hojas lisas A5 papel blanco 90g.",
        description: "Repuesto para cuaderno A5 sistema de discos. Contiene 100 hojas en papel blanco de 90 gr. [WHOLESALE:8800]",
        price: "13.500",
        image: "/images/repuestos_svg/a5_blanco_lisas.svg",
        images: ["/images/repuestos_svg/a5_blanco_lisas.svg"]
    },
    {
        id: "rep-a5-nat-ray",
        name: "Repuesto Hojas Rayadas A5 (Natural)",
        category: "Repuestos",
        shortDescription: "100 hojas rayadas A5 papel natural ahuesado 90g.",
        description: "Repuesto para cuaderno A5 sistema de discos. Contiene 100 hojas en papel natural de 90 gr. [WHOLESALE:8800]",
        price: "13.500",
        image: "/images/repuestos_svg/a5_natural_rayadas.svg",
        images: ["/images/repuestos_svg/a5_natural_rayadas.svg"]
    },
    {
        id: "rep-a5-nat-cuad",
        name: "Repuesto Hojas Cuadriculadas A5 (Natural)",
        category: "Repuestos",
        shortDescription: "100 hojas cuadriculadas A5 papel natural 90g.",
        description: "Repuesto para cuaderno A5 sistema de discos. Contiene 100 hojas en papel natural de 90 gr. [WHOLESALE:8800]",
        price: "13.500",
        image: "/images/repuestos_svg/a5_natural_cuadriculadas.svg",
        images: ["/images/repuestos_svg/a5_natural_cuadriculadas.svg"]
    },
    {
        id: "rep-a5-nat-punt",
        name: "Repuesto Hojas Punteadas A5 (Natural)",
        category: "Repuestos",
        shortDescription: "100 hojas punteadas A5 papel natural 90g.",
        description: "Repuesto para cuaderno A5 sistema de discos. Contiene 100 hojas en papel natural de 90 gr. [WHOLESALE:8800]",
        price: "13.500",
        image: "/images/repuestos_svg/a5_natural_punteadas.svg",
        images: ["/images/repuestos_svg/a5_natural_punteadas.svg"]
    },
    {
        id: "rep-a5-nat-lis",
        name: "Repuesto Hojas Lisas A5 (Natural)",
        category: "Repuestos",
        shortDescription: "100 hojas lisas A5 papel natural 90g.",
        description: "Repuesto para cuaderno A5 sistema de discos. Contiene 100 hojas en papel natural de 90 gr. [WHOLESALE:8800]",
        price: "13.500",
        image: "/images/repuestos_svg/a5_natural_lisas.svg",
        images: ["/images/repuestos_svg/a5_natural_lisas.svg"]
    },
    {
        id: "rep-fichas-blanco-ray",
        name: "Repuesto Fichas N° 3 (Blanco)",
        category: "Repuestos",
        shortDescription: "100 fichas rayadas para fichero N° 3 papel blanco 120g.",
        description: "Repuesto de fichero N° 3, contiene 100 fichas rayadas en papel blanco de 120 gr. [WHOLESALE:7100]",
        price: "10.900",
        image: "/images/repuestos_svg/fichas_blanco_rayadas.svg",
        images: ["/images/repuestos_svg/fichas_blanco_rayadas.svg"]
    },
    {
        id: "rep-fichas-nat-ray",
        name: "Repuesto Fichas N° 3 (Natural)",
        category: "Repuestos",
        shortDescription: "100 fichas rayadas para fichero N° 3 papel natural 120g.",
        description: "Repuesto de fichero N° 3, contiene 100 fichas rayadas en papel natural de 120 gr. [WHOLESALE:7100]",
        price: "10.900",
        image: "/images/repuestos_svg/fichas_natural_rayadas.svg",
        images: ["/images/repuestos_svg/fichas_natural_rayadas.svg"]
    }
];
