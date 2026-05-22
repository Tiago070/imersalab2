/**
 * DATA LAYER - Ambientes do Campus Ceres
 * 
 * Este arquivo centraliza os dados dos ambientes disponíveis para visualização 360°.
 * Estrutura modular permite fácil expansão para futuros ambientes.
 */

const ambientes = [
  // ===== LABORATÓRIOS =====
  {
    id: "lab-informatica",
    categoria: "Laboratórios",
    titulo: "Laboratório de Informática",
    descricao: "Espaço equipado com computadores de alta performance para ensino de programação, desenvolvimento de software e pesquisa em tecnologia.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1773334750/lab-informatica-preview_pfrzo4.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597658/lab-informatica-360_nbdgmv.jpg",
    disponivel: true,
    dataAdicao: "2025-01-15"
  },
  {
    id: "lab-robotica",
    categoria: "Laboratórios",
    titulo: "Laboratório de Robótica",
    descricao: "Atua no âmbito do Núcleo de Estudos e Pesquisa em Tecnologia da Informação (NEPeTI), com capacitação, pesquisa e inovação em Tecnologias Emergentes como Impressão 3D, Realidade Virtual e Robótica",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1773334751/lab-robotica-preview_vhlgyp.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597661/lab-robotica-360_lfhrv2.jpg",
    disponivel: true,
    dataAdicao: "2025-02-01"
  },
  {
    id: "lab-quimica",
    categoria: "Laboratórios",
    titulo: "Laboratório de Química",
    descricao: "Espaço de análise e experimentos químicos com equipamentos especializados e área de segurança adequada.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1778528503/lab-quimica_wajwg6.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597659/lab-quimica-360_stjx7f.jpg",
    disponivel: true,
    dataAdicao: "2025-02-01"
  },
  {
    id: "lab-pedagogia",
    categoria: "Laboratórios",
    titulo: "Laboratório de Práticas Pedagógicas",
    descricao: "Ambiente para desenvolvimento de metodologias educacionais, pesquisa em ensino e preparação de materiais didáticos.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1778528503/lab-praticas_fnlvb5.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597658/lab-pedagogia-360_bum2on.jpg",
    disponivel: true,
    dataAdicao: "2025-02-01"
  },
  {
    id: "fabrica-software",
    categoria: "Laboratórios",
    titulo: "Fábrica de Software",
    descricao: "Centro de desenvolvimento de soluções de software com metodologias ágeis, simulando ambientes corporativos de produção.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1773335513/fab-software-preview_s9jv81.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597652/fabrica-software-360_sq8ywn.jpg",
    disponivel: true,
    dataAdicao: "2025-02-05"
  },
  {
    id: "gpsaca",
    categoria: "Laboratórios",
    titulo: "GPSaCA",
    descricao: "Grupo de Pesquisa sobre Sáude da Criança e do Adolescente atuando em pesquisa e extensão no campo da saúde.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1773336142/gpsaca-preview_d3ofkk.png",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597656/gpsaca-360_lw4eop.jpg",
    disponivel: true,
    dataAdicao: "2025-02-05"
  },
  {
    id: "cebio",
    categoria: "Laboratórios",
    titulo: "CEBIO",
    descricao: "Centro de Excelência em Bioinsumos dedicado à pesquisa e inovação sustentável.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1773336032/cebio-preview_lpxnfz.png",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597651/cebio-360_ji1x4k.jpg",
    disponivel: true,
    dataAdicao: "2025-02-05"
  },
  {
    id: "labam",
    categoria: "Laboratórios",
    titulo: "LABAM",
    descricao: "Laboratório de Análises Biogeoquímicas e Ambientais para estudos ambientais e pesquisa aplicada.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1779195201/Captura_de_tela_2026-05-19_095142_zssfe5.png",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597659/labam-360_nzri3e.jpg",
    disponivel: true,
    dataAdicao: "2025-02-05"
  },
  {
    id: "limbio",
    categoria: "Laboratórios",
    titulo: "LIMBIO",
    descricao: "Laboratório de Interações Microbianas e Biotecnologia para análises microbiológicas e pesquisa em ciências biológicas.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1779195201/Captura_de_tela_2026-05-19_095215_swocpu.png",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597660/limbio-360_oupwwd.jpg",
    disponivel: true,
    dataAdicao: "2025-02-05"
  },
  {
    id: "labti",
    categoria: "Laboratórios",
    titulo: "LabTI",
    descricao: "Laboratório de Tecnologias de Irrigação com infraestrutura para pesquisa e desenvolvimento.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1773335735/labti-preview_gvvu4f.png",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597662/labti-360_ou4izo.jpg",
    disponivel: true,
    dataAdicao: "2025-02-05"
  },

  // ===== SALAS DE AULA =====
  {
    id: "sala-bloco-d",
    categoria: "Salas de Aula",
    titulo: "Sala de Aula - Bloco D",
    descricao: "Sala de aula equipada com tecnologia audiovisual moderna para aulas teóricas e apresentações.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1778528543/sala-d_w5ef6o.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597664/sala-bloco-d-360_f5oeco.jpg",
    disponivel: true,
    dataAdicao: "2025-01-15"
  },
  {
    id: "sala-bloco-e",
    categoria: "Salas de Aula",
    titulo: "Sala de Aula - Bloco E",
    descricao: "Sala de aula equipada com tecnologia audiovisual moderna para aulas teóricas e apresentações.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1778528543/sala-e_u6ulsw.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597665/sala-bloco-e-360_mcapwb.jpg",
    disponivel: true,
    dataAdicao: "2025-01-15"
  },

  // ===== BLOCOS =====
  {
    id: "bloco-a",
    categoria: "Blocos",
    titulo: "Bloco A",
    descricao: "Estrutura predial dos setores administrativos do campus.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597671/bloco-a-preview_uhys4o.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597645/bloco-a-360_wv9hsv.jpg",
    disponivel: true,
    dataAdicao: "2025-02-10"
  },
  {
    id: "bloco-b",
    categoria: "Blocos",
    titulo: "Bloco B",
    descricao: "Estrutura predial de apoio acadêmico e administrativo do campus.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597671/bloco-b-preview_nm3yu3.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597646/bloco-b-360_vicbut.jpg",
    disponivel: true,
    dataAdicao: "2025-02-10"
  },
  {
    id: "bloco-c",
    categoria: "Blocos",
    titulo: "Bloco C",
    descricao: "Estrutura predial que abriga laboratórios e espaços de pesquisa.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597672/bloco-c-preview_kk8p3i.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597650/bloco-c-360_pjxvuo.jpg",
    disponivel: true,
    dataAdicao: "2025-02-10"
  },
  {
    id: "bloco-d",
    categoria: "Blocos",
    titulo: "Bloco D",
    descricao: "Bloco com salas de aula e espaços de apoio para atividades educacionais.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597673/bloco-d-preview_tiyvhh.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597691/bloco-d-360_zfidj8.jpg",
    disponivel: true,
    dataAdicao: "2025-02-10"
  },
  {
    id: "bloco-e",
    categoria: "Blocos",
    titulo: "Bloco E",
    descricao: "Bloco com salas de aula, laboratórios e um miniauditório.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597673/bloco-e-preview_jkxhjy.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597647/bloco-e-360_k1rvns.jpg",
    disponivel: true,
    dataAdicao: "2025-02-10"
  },
  {
    id: "bloco-f",
    categoria: "Blocos",
    titulo: "Bloco F",
    descricao: "Estrutura predial com salas de aula e espaços para atividades práticas e laboratoriais.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597673/bloco-f-preview_j8tdo6.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597647/bloco-f-360_drvt55.jpg",
    disponivel: true,
    dataAdicao: "2025-02-10"
  },
  {
    id: "bloco-g",
    categoria: "Blocos",
    titulo: "Bloco G",
    descricao: "Bloco de laboratórios e espaços de pesquisa.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597674/bloco-g-preview_zf96ws.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597648/bloco-g-360_xpn2tb.jpg",
    disponivel: true,
    dataAdicao: "2025-02-10"
  },

  // ===== ASSISTÊNCIA ESTUDANTIL =====
  {
    id: "cae",
    categoria: "Assistência Estudantil",
    titulo: "CAE",
    descricao: "Coordenação de Assistência Estudantil, responsável por políticas e ações de apoio aos discentes.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597674/cae-preview_cdhg8r.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597649/cae-360_oncn4i.jpg",
    disponivel: true,
    dataAdicao: "2025-02-15"
  },
  {
    id: "refeitorio",
    categoria: "Assistência Estudantil",
    titulo: "Refeitório",
    descricao: "Espaço para refeições e convivência da comunidade acadêmica com cardápio diversificado.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597683/refeitorio-preview_h13by7.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597664/refeitorio-360_bsmdno.jpg",
    disponivel: true,
    dataAdicao: "2025-01-15"
  },
  {
    id: "alojamentos-masc",
    categoria: "Assistência Estudantil",
    titulo: "Alojamentos Masculinos",
    descricao: "Espaço residencial para estudantes que necessitam de hospedagem no campus.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597667/alojamentos-masc-preview_usvihn.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597651/alojamentos-masc-360_fi5mgv.jpg",
    disponivel: true,
    dataAdicao: "2025-02-15"
  },
  {
    id: "alojamentos-fem",
    categoria: "Assistência Estudantil",
    titulo: "Alojamentos Femininos",
    descricao: "Espaço residencial para estudantes que necessitam de hospedagem no campus.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597667/alojamentos-fem-preview_qlbqrj.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597644/alojamentos-fem-360_cqdcgb.jpg",
    disponivel: true,
    dataAdicao: "2025-02-15"
  },

  // ===== NÚCLEO ESPORTIVO =====
  {
    id: "ginasio",
    categoria: "Núcleo Esportivo",
    titulo: "Ginásio",
    descricao: "Espaço coberto para prática de esportes coletivos, eventos e atividades recreativas.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597676/ginasio-preview_nvaepu.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597659/ginasio-360_e02xw2.jpg",
    disponivel: true,
    dataAdicao: "2025-02-20"
  },
  {
    id: "quadra",
    categoria: "Núcleo Esportivo",
    titulo: "Quadra",
    descricao: "Quadra esportiva coberta para prática de voleibol, basquete e outros esportes.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597681/quadra-preview_ffmfa5.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597672/quadra-360_oov4fg.jpg",
    disponivel: true,
    dataAdicao: "2025-02-20"
  },
  {
    id: "piscina",
    categoria: "Núcleo Esportivo",
    titulo: "Piscina",
    descricao: "Instalação aquática para aulas de natação, treinamento e atividades recreativas.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597679/piscina-preview_pk5utq.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597669/piscina-360_xrtrcy.jpg",
    disponivel: true,
    dataAdicao: "2025-02-20"
  },
  {
    id: "campo-futebol-atletismo",
    categoria: "Núcleo Esportivo",
    titulo: "Campo de Futebol e Atletismo",
    descricao: "Espaço para prática de futebol, corrida e provas de atletismo.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597680/campo-futebol-atletismo-preview_uzwwpb.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597651/campo-futebol-atletismo-360_y8nccj.jpg",
    disponivel: true,
    dataAdicao: "2025-02-20"
  },
  {
    id: "academia-musculacao",
    categoria: "Núcleo Esportivo",
    titulo: "Academia de Musculação",
    descricao: "Espaço equipado com máquinas e pesos para prática de musculação e treinamento resistido.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1778528544/academia_rsdwyc.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597644/academia-musculacao-360_yxmi9b.jpg",
    disponivel: true,
    dataAdicao: "2025-02-20"
  },

  // ===== ESPAÇOS COMUNS =====
  {
    id: "campus-ceres-aereo",
    categoria: "Espaços Comuns",
    titulo: "IF Goiano - Campus Ceres (Aéreo)",
    descricao: "Visão aérea do Campus Ceres capturada por drone. Explore a vista panorâmica e inicie o tour 360° a partir daqui acessando o menu de ambientes no canto superior esquerdo.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597674/campus-ceres-aereo-preview_edovrn.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597651/campus-ceres-aereo-360_rjg81m.jpg",
    disponivel: true,
    dataAdicao: "2026-02-16"
  },
  {
    id: "quiosques",
    categoria: "Espaços Comuns",
    titulo: "Quiosques",
    descricao: "Espaços de convivência espalhados pelo campus.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597688/quiosques-preview_bhrv9s.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597663/quiosques-360_ua9rhh.jpg",
    disponivel: true,
    dataAdicao: "2025-02-25"
  },
  {
    id: "patio-central",
    categoria: "Espaços Comuns",
    titulo: "Pátio Central",
    descricao: "Espaço verde e aberto para integração e convivência entre os estudantes.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597684/patio-central-preview_o9o2xx.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597661/patio-central-360_syalhv.jpg",
    disponivel: true,
    dataAdicao: "2025-01-15"
  },
  {
    id: "mirante",
    categoria: "Espaços Comuns",
    titulo: "Mirante",
    descricao: "Área de lazer com vista para a mata do campus e o rio verde.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597687/mirante-preview_rjqs7n.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597661/mirante-360_tybbl6.jpg",
    disponivel: true,
    dataAdicao: "2025-02-25"
  },
  {
    id: "biblioteca",
    categoria: "Espaços Comuns",
    titulo: "Biblioteca",
    descricao: "Centro de recursos informacionais com salão de estudos e acervo de livros, revistas e acesso a bases de dados para pesquisa.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597672/biblioteca-preview_bf1gfi.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1777311556/Acervo_de_Livros_syxsxq.jpg",
    disponivel: true,
    dataAdicao: "2025-01-15"
  },
  {
    id: "centro-vivencias",
    categoria: "Espaços Comuns",
    titulo: "Centro de Vivências",
    descricao: "Espaço para realização de eventos, atividades culturais e de integração da comunidade acadêmica.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1778528506/centro-vivencias_qt36se.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597658/centro-vivencias-360_gle1yq.jpg",
    disponivel: true,
    dataAdicao: "2025-02-25"
  },
  {
    id: "auditorio-multifuncional",
    categoria: "Espaços Comuns",
    titulo: "Auditório Multifuncional",
    descricao: "Espaço versátil para palestras, seminários, apresentações e eventos acadêmicos.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597668/auditorio-multifuncional-preview_holucm.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597645/auditorio-multifuncional-360_bzibjq.jpg",
    disponivel: true,
    dataAdicao: "2025-02-25"
  },

  // ===== PROJETOS INSTITUCIONAIS =====
  {
    id: "equoterapia",
    categoria: "Projetos Institucionais",
    titulo: "Equoterapia",
    descricao: "Projeto institucional que utiliza equinos como ferramenta terapêutica e educacional.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597677/equoterapia-preview_tnptzn.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597655/equoterapia-360_f9itew.jpg",
    disponivel: true,
    dataAdicao: "2025-03-01"
  },
  {
    id: "trilha-ecologica",
    categoria: "Projetos Institucionais",
    titulo: "Trilha Ecológica",
    descricao: "Caminho planejado para educação ambiental e contato com o ecossistema local.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597684/trilha-ecologica-preview_ajs77i.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597671/trilha-ecologica-360_rop9oo.jpg",
    disponivel: true,
    dataAdicao: "2025-03-01"
  },
  {
    id: "bau-ciencia",
    categoria: "Projetos Institucionais",
    titulo: "Baú da Ciência",
    descricao: "Espaço itinerante para divulgação científica e experimentação em ciências.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597670/bau-ciencia-preview_rlxf1b.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597644/bau-ciencia-360_xrrtb4.jpg",
    disponivel: true,
    dataAdicao: "2025-03-01"
  },

  // ===== SETORES DE PRODUÇÃO =====
  {
    id: "avicultura-ovinocultura",
    categoria: "Setores de Produção",
    titulo: "Avicultura/Ovinocultura",
    descricao: "Setor dedicado à criação de aves e ovinos, com objetivo educacional e de pesquisa.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597669/avicultura-ovinocultura-preview_kd0pno.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597651/avicultura-ovinocultura-360_bsoxcs.jpg",
    disponivel: true,
    dataAdicao: "2025-03-05"
  },
  {
    id: "bovinocultura",
    categoria: "Setores de Produção",
    titulo: "Bovinocultura",
    descricao: "Setor para criação e manejo de bovinos com foco em pesquisa e ensino.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597674/bovinocultura-preview_vmvps3.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597649/bovinocultura-360_k4oq1j.jpg",
    disponivel: true,
    dataAdicao: "2025-03-05"
  },
  {
    id: "suinocultura",
    categoria: "Setores de Produção",
    titulo: "Suinocultura",
    descricao: "Setor especializado em criação de suínos com metodologias modernas de produção.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597684/suinocultura-preview_zh9df7.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597666/suinocultura-360_zuv4ve.jpg",
    disponivel: true,
    dataAdicao: "2025-03-05"
  },
  {
    id: "pivo-central",
    categoria: "Setores de Produção",
    titulo: "Pivô Central",
    descricao: "Sistema de irrigação automatizado para pesquisa e prática em irrigação agrícola.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597681/pivo-central-preview_nexnn7.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597664/pivo-central-360_vthjqh.jpg",
    disponivel: true,
    dataAdicao: "2025-03-05"
  },
  {
    id: "fabrica-racao",
    categoria: "Setores de Produção",
    titulo: "Fábrica de Ração",
    descricao: "Instalação para produção de ração animal com equipamentos adequados.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597676/fabrica-racao-preview_n7m54l.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597653/fabrica-racao-360_dwioac.jpg",
    disponivel: true,
    dataAdicao: "2025-03-05"
  },
  {
    id: "fruticultura",
    categoria: "Setores de Produção",
    titulo: "Fruticultura",
    descricao: "Área de cultivo de frutas para ensino, pesquisa e produção experimental.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597675/fruticultura-preview_glvwtg.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597657/fruticultura-360_bsrufg.jpg",
    disponivel: true,
    dataAdicao: "2025-03-05"
  },
  {
    id: "mecanizacao-agricola",
    categoria: "Setores de Produção",
    titulo: "Mecanização Agrícola",
    descricao: "Setor com máquinas e implementos agrícolas para ensino e pesquisa em mecanização.",
    imagemPreview: "https://res.cloudinary.com/duay00cii/image/upload/v1771597677/mecanizacao-agricola-preview_ehf8i8.jpg",
    imagem360: "https://res.cloudinary.com/duay00cii/image/upload/v1771597660/mecanizacao-agricola-360_hf8tg4.jpg",
    disponivel: true,
    dataAdicao: "2025-03-05"
  },
];

/**
 * Agrupa ambientes por categoria
 * @returns {Object} Objeto com categorias como chaves e array de ambientes como valores
 */
function agruparAmbientesPorCategoria() {
  return ambientes.reduce((acc, ambiente) => {
    if (!acc[ambiente.categoria]) {
      acc[ambiente.categoria] = [];
    }
    acc[ambiente.categoria].push(ambiente);
    return acc;
  }, {});
}

/**
 * Obtém um ambiente específico por ID
 * @param {string} id - ID do ambiente
 * @returns {Object|null} Ambiente encontrado ou null
 */
function obterAmbientePorId(id) {
  return ambientes.find(ambiente => ambiente.id === id) || null;
}

/**
 * Filtra ambientes disponíveis
 * @returns {Array} Lista de ambientes disponíveis
 */
function obterAmbientesDisponiveis() {
  return ambientes.filter(ambiente => ambiente.disponivel);
}

/**
 * Obtém categorias únicas
 * @returns {Array} Array de categorias
 */
function obterCategorias() {
  return [...new Set(ambientes.map(a => a.categoria))];
}
