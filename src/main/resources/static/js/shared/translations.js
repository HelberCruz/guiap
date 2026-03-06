// Sistema centralizado de traduções - TODAS AS TELAS
const translations = {
    'pt-BR': {
        // ===== HEADER E NAVEGAÇÃO COMUM =====
        'appName': 'MeuGuia',
        'backToHome': 'Voltar a Página Inicial',
        'theme': 'Tema',
        'logout': 'Sair',
        'profile': 'Perfil',
        'settings': 'Configurações',
        'help': 'Ajuda',
        'faq': 'Dúvidas',
        'language': 'Idioma',
        'information': 'Informações',
        
        // Status
        'online': 'Online',
        
        // ===== MENU PRINCIPAL =====
        // Seções do Menu
        'timeline': 'Linha do tempo',
        'saved': 'Salvos',
        
        // Seção Salvos
        'savedItems': 'Itens Salvos',
        'savedDescription': 'Gerencie todos os itens que você salvou para consultas futuras.',
        'savedRoutes': 'Roteiros Salvos',
        'savedRoutesDesc': 'Você tem 5 roteiros salvos. Seus últimos salvamentos foram há 2 dias.',
        'favoritePlaces': 'Locais Favoritos',
        'favoritePlacesDesc': '12 locais marcados como favoritos para visitas futuras.',
        'restaurants': 'Restaurantes',
        'restaurantsDesc': '8 restaurantes salvos para experimentar durante suas viagens.',
        
        // Seção Linha do Tempo
        'timelineDescription': 'Acompanhe suas atividades e eventos recentes em ordem cronológica.',
        'recentActivity': 'Atividade Recente',
        'recentActivityDesc': 'Você fez login 5 vezes na última semana. Sua última atividade foi hoje às 14:32.',
        'travelHistory': 'Histórico de Viagens',
        'travelHistoryDesc': 'Revise todos os destinos que você já visitou ou planejou.',
        'upcomingEvents': 'Próximos Eventos',
        'upcomingEventsDesc': 'Visualize seus planos futuros e atividades agendadas.',
        
        // Seção Perfil
        'yourInformation': 'Suas Informações',
        'editProfile': 'Editar Perfil',
        'personalInfo': 'Informações Pessoais',
        'name': 'Nome',
        'cpf': 'CPF',
        'phone': 'Telefone',
        'userId': 'ID do Usuário',
        'accessLevel': 'Nível de Acesso',
        'changePassword': 'Alterar Senha',
        'changePhoto': 'Alterar Foto',
        'notInformed': 'Não informado',
        
        // Botões de Ação
        'save': 'Salvar',
        'cancel': 'Cancelar',
        'edit': 'Editar',
        
        // Seção Dúvidas
        'faqDescription': 'Encontre respostas para as perguntas mais comuns sobre o uso do sistema.',
        'howItWorks': 'Como funciona para criar seu roteiro?',
        'followSteps': 'Siga estes passos simples para criar seu roteiro personalizado:',
        'step1Title': 'Após o login',
        'step1Desc': 'Acesse sua conta no sistema para começar a criar seu roteiro.',
        'step2Title': 'Informe o endereço inicial',
        'step2Desc': 'Digite o endereço de onde deseja ser o ponto inicial de seu roteiro.',
        'step3Title': 'Selecione o tema',
        'step3Desc': 'Escolha o tema do roteiro: gastronomia, história, festas, paisagens, etc.',
        'step4Title': 'Gere seu roteiro',
        'step4Desc': 'Clique no botão "Gerar meu roteiro" para criar seu itinerário personalizado.',
        'step5Title': 'Confirme o roteiro',
        'step5Desc': 'Verifique se o roteiro está de acordo com o que quiera e clique em "Confirmar roteiro".',
        'step6Title': 'Divirta-se!',
        'step6Desc': 'Siga os pontos propostos pelo roteiro e aproveite sua experiência!',
        
        // Guia Manual
        'manualGuide': 'Como criar o guia manualmente',
        'manualGuideDesc': 'Crie seu próprio roteiro personalizado seguindo estes passos:',
        'manualStep1Title': 'Acesse o criador manual',
        'manualStep1Desc': 'Na página principal, clique em "Criar Roteiro Manual" para iniciar.',
        'manualStep2Title': 'Defina o título e descrição',
        'manualStep2Desc': 'Dê um nome para seu roteiro e adicione uma descrição sobre o que os usuários podem esperar.',
        'manualStep3Title': 'Adicione locais',
        'manualStep3Desc': 'Pesquise e adicione os locais que deseja incluir no roteiro. Você pode organizá-los na ordem preferida.',
        'manualStep4Title': 'Configure detalhes',
        'manualStep4Desc': 'Defina o tempo estimado em cada local, adicione dicas e informações relevantes.',
        'manualStep5Title': 'Adicione imagens',
        'manualStep5Desc': 'Inclua fotos dos locais para tornar o roteiro mais atraente e informativo.',
        'manualStep6Title': 'Salve e publique',
        'manualStep6Desc': 'Revise seu roteiro e clique em "Salvar" ou "Publicar" para disponibilizá-lo.',
        
        // Seção Idioma
        'languageDescription': 'Selecione e configure o idioma de sua preferência.',
        'portuguese': 'Português (Brasil)',
        'english': 'English',
        'spanish': 'Español',
        'currentLanguage': 'Idioma atual',
        'clickToChange': 'Clique para alterar',
        
        // Footer
        'copyright': '© 2025 Sistema de Dashboard. Todos os direitos reservados.',
        
        // ===== TELA INICIAL =====
        'createItinerary': 'Crie seu roteiro personalizado',
        'itineraryDescription': 'Informe a localização e selecione um tema para gerar um roteiro único',
        'enterLocation': 'Digite seu endereço de partida',
        'useMyLocation': 'Usar minha localização',
        'chooseTheme': 'Escolha o tema do seu roteiro',
        'themeDescription': 'Selecione uma categoria para explorar destinos incríveis',
        'parties': 'Festas',
        'partiesDesc': 'Descubra os melhores eventos e festivais',
        'gastronomy': 'Gastronomia',
        'gastronomyDesc': 'Explore a culinária local e restaurantes',
        'history': 'História',
        'historyDesc': 'Conheça a rica história e patrimônios',
        'landscapes': 'Paisagens',
        'landscapesDesc': 'Descubra as mais belas paisagens naturais',
        'culture': 'Cultura',
        'cultureDesc': 'Vivencie as tradições e expressões culturais',
        'manualGuideCard': 'Criar Guia Manualmente',
        'manualGuideCardDesc': 'Personalize seu próprio roteiro de viagem',
        'generateItinerary': 'Gerar Meu Roteiro',
        'generatingItinerary': 'Gerando seu roteiro personalizado...',
        'pleaseWait': 'Isso pode levar alguns segundos',
        
        // Mensagens de Validação
        'selectTheme': 'Por favor, selecione um tema para o seu roteiro.',
        'enterLocationAlert': 'Por favor, informe sua localização.',
        'copyrightHome': '© 2025 MeuGuia - Todos os direitos reservados',
        
        // ===== TELA DE ROTEIRO GERADO =====
        'itineraryGuide': 'Roteiro do Guia',
        'backToStart': 'Voltar para Início',
        'share': 'Compartilhar',
        'favorite': 'Favoritar',
        'itineraryLocation': 'Localização do Roteiro',
        'explorePoints': 'Explore os pontos selecionados',
        'confirmItinerary': 'Confirmar Roteiro',
        'totalDistance': 'Distância total',
        'estimatedTime': 'Tempo estimado',
        'routePoints': 'Pontos do Roteiro',
        'itineraryMap': 'Mapa do Roteiro',
        'viewLocationsMap': 'Visualize os locais no mapa',
        'mapFunctionality': 'Funcionalidade do Mapa',
        'routePointsView': 'Visualização dos pontos do roteiro',
        'optimizedRoutes': 'Rotas otimizadas entre locais',
        'travelTimes': 'Tempo de deslocamento',
        'stepByStepNavigation': 'Navegação passo a passo',
        
        // Descrições por tema
        'historyDescription': 'Explore os pontos históricos e culturais da região',
        'gastronomyDescription': 'Descubra os sabores e restaurantes locais',
        'landscapesDescription': 'Aprecie as vistas mais impressionantes da região',
        'cultureDescription': 'Conheça a rica cena cultural local',
        'partiesDescription': 'Viva a animação da vida noturna',
        'manualDescription': 'Seu roteiro personalizado com os melhores pontos',
        
        // Cards de localização
        'visitTime': 'Visita',
        'next': 'próximo',
        'rating': 'Avaliação',
        'editLocation': 'Editar',
        'noLocationsFound': 'Nenhum local encontrado para este roteiro.',
        
        // Mensagens do roteiro
        'noItineraryFound': 'Nenhum roteiro encontrado. Redirecionando para a página inicial.',
        'itineraryAddedToFavorites': 'Roteiro adicionado aos favoritos!',
        'editingLocation': 'Editando local - Em produção, esta funcionalidade permitiria personalizar o roteiro.',
        'sharingItinerary': 'Compartilhando roteiro - Em produção, esta funcionalidade permitiria compartilhar via redes sociais ou link.',
        
        // ===== MENSAGENS DO SISTEMA =====
        'loading': 'Carregando...',
        'saving': 'Salvando...',
        'updating': 'Atualizando...',
        'success': 'Sucesso!',
        'error': 'Erro!',
        'warning': 'Aviso!',
        'info': 'Informação',
        
        // Confirmações
        'confirmLogout': 'Tem certeza que deseja sair?',
        'confirmDelete': 'Tem certeza que deseja excluir?',
        'confirmAction': 'Confirmar ação?',
        
        // Upload de imagem
        'selectImagesOnly': 'Por favor, selecione apenas imagens',
        'imageMaxSize': 'A imagem deve ter no máximo 5MB',
        'confirmProfilePhoto': 'Deseja usar esta imagem como foto de perfil?',
        'uploadError': 'Erro ao fazer upload',
        'profileUpdateSuccess': 'Perfil atualizado com sucesso!',
        
        // Desenvolvimento
        'underDevelopment': 'Funcionalidade em desenvolvimento...',
        'comingSoon': 'Em breve...'
    },
    'en': {
        // ===== COMMON HEADER AND NAVIGATION =====
        'appName': 'MyGuide',
        'backToHome': 'Back to Home Page',
        'theme': 'Theme',
        'logout': 'Logout',
        'profile': 'Profile',
        'settings': 'Settings',
        'help': 'Help',
        'faq': 'FAQ',
        'language': 'Language',
        'information': 'Information',
        
        // Status
        'online': 'Online',
        
        // ===== MAIN MENU =====
        // Menu Sections
        'timeline': 'Timeline',
        'saved': 'Saved',
        
        // Saved Section
        'savedItems': 'Saved Items',
        'savedDescription': 'Manage all items you have saved for future reference.',
        'savedRoutes': 'Saved Routes',
        'savedRoutesDesc': 'You have 5 saved routes. Your last saves were 2 days ago.',
        'favoritePlaces': 'Favorite Places',
        'favoritePlacesDesc': '12 locations marked as favorites for future visits.',
        'restaurants': 'Restaurants',
        'restaurantsDesc': '8 restaurants saved to try during your travels.',
        
        // Timeline Section
        'timelineDescription': 'Track your activities and recent events in chronological order.',
        'recentActivity': 'Recent Activity',
        'recentActivityDesc': 'You logged in 5 times last week. Your last activity was today at 14:32.',
        'travelHistory': 'Travel History',
        'travelHistoryDesc': 'Review all destinations you have visited or planned.',
        'upcomingEvents': 'Upcoming Events',
        'upcomingEventsDesc': 'View your future plans and scheduled activities.',
        
        // Profile Section
        'yourInformation': 'Your Information',
        'editProfile': 'Edit Profile',
        'personalInfo': 'Personal Information',
        'name': 'Name',
        'cpf': 'CPF',
        'phone': 'Phone',
        'userId': 'User ID',
        'accessLevel': 'Access Level',
        'changePassword': 'Change Password',
        'changePhoto': 'Change Photo',
        'notInformed': 'Not informed',
        
        // Action Buttons
        'save': 'Save',
        'cancel': 'Cancel',
        'edit': 'Edit',
        
        // FAQ Section
        'faqDescription': 'Find answers to the most common questions about using the system.',
        'howItWorks': 'How does it work to create your itinerary?',
        'followSteps': 'Follow these simple steps to create your personalized itinerary:',
        'step1Title': 'After login',
        'step1Desc': 'Access your account in the system to start creating your itinerary.',
        'step2Title': 'Enter the starting address',
        'step2Desc': 'Enter the address where you want to be the starting point of your itinerary.',
        'step3Title': 'Select the theme',
        'step3Desc': 'Choose the itinerary theme: gastronomy, history, parties, landscapes, etc.',
        'step4Title': 'Generate your itinerary',
        'step4Desc': 'Click the "Generate my itinerary" button to create your personalized itinerary.',
        'step5Title': 'Confirm the itinerary',
        'step5Desc': 'Check if the itinerary matches what you wanted and click "Confirm itinerary".',
        'step6Title': 'Have fun!',
        'step6Desc': 'Follow the points proposed by the itinerary and enjoy your experience!',
        
        // Manual Guide
        'manualGuide': 'How to create the guide manually',
        'manualGuideDesc': 'Create your own personalized itinerary by following these steps:',
        'manualStep1Title': 'Access the manual creator',
        'manualStep1Desc': 'On the main page, click "Create Manual Itinerary" to start.',
        'manualStep2Title': 'Define title and description',
        'manualStep2Desc': 'Give a name to your itinerary and add a description about what users can expect.',
        'manualStep3Title': 'Add locations',
        'manualStep3Desc': 'Search and add the locations you want to include in the itinerary. You can organize them in your preferred order.',
        'manualStep4Title': 'Configure details',
        'manualStep4Desc': 'Set the estimated time at each location, add tips and relevant information.',
        'manualStep5Title': 'Add images',
        'manualStep5Desc': 'Include photos of the locations to make the itinerary more attractive and informative.',
        'manualStep6Title': 'Save and publish',
        'manualStep6Desc': 'Review your itinerary and click "Save" or "Publish" to make it available.',
        
        // Language Section
        'languageDescription': 'Select and configure your preferred language.',
        'portuguese': 'Portuguese (Brazil)',
        'english': 'English',
        'spanish': 'Spanish',
        'currentLanguage': 'Current language',
        'clickToChange': 'Click to change',
        
        // Footer
        'copyright': '© 2025 Dashboard System. All rights reserved.',
        
        // ===== HOME SCREEN =====
        'createItinerary': 'Create your personalized itinerary',
        'itineraryDescription': 'Enter your location and select a theme to generate a unique itinerary',
        'enterLocation': 'Enter your starting address',
        'useMyLocation': 'Use my location',
        'chooseTheme': 'Choose your itinerary theme',
        'themeDescription': 'Select a category to explore amazing destinations',
        'parties': 'Parties',
        'partiesDesc': 'Discover the best events and festivals',
        'gastronomy': 'Gastronomy',
        'gastronomyDesc': 'Explore local cuisine and restaurants',
        'history': 'History',
        'historyDesc': 'Discover rich history and heritage',
        'landscapes': 'Landscapes',
        'landscapesDesc': 'Discover the most beautiful natural landscapes',
        'culture': 'Culture',
        'cultureDesc': 'Experience traditions and cultural expressions',
        'manualGuideCard': 'Create Guide Manually',
        'manualGuideCardDesc': 'Customize your own travel itinerary',
        'generateItinerary': 'Generate My Itinerary',
        'generatingItinerary': 'Generating your personalized itinerary...',
        'pleaseWait': 'This may take a few seconds',
        
        // Validation Messages
        'selectTheme': 'Please select a theme for your itinerary.',
        'enterLocationAlert': 'Please enter your location.',
        'copyrightHome': '© 2025 MyGuide - All rights reserved',
        
        // ===== GENERATED ITINERARY SCREEN =====
        'itineraryGuide': 'Guide Itinerary',
        'backToStart': 'Back to Start',
        'share': 'Share',
        'favorite': 'Favorite',
        'itineraryLocation': 'Itinerary Location',
        'explorePoints': 'Explore the selected points',
        'confirmItinerary': 'Confirm Itinerary',
        'totalDistance': 'Total distance',
        'estimatedTime': 'Estimated time',
        'routePoints': 'Route Points',
        'itineraryMap': 'Itinerary Map',
        'viewLocationsMap': 'View locations on map',
        'mapFunctionality': 'Map Functionality',
        'routePointsView': 'Route points visualization',
        'optimizedRoutes': 'Optimized routes between locations',
        'travelTimes': 'Travel times',
        'stepByStepNavigation': 'Step by step navigation',
        
        // Theme descriptions
        'historyDescription': 'Explore historical and cultural points of the region',
        'gastronomyDescription': 'Discover local flavors and restaurants',
        'landscapesDescription': 'Appreciate the most impressive views of the region',
        'cultureDescription': 'Experience the rich local cultural scene',
        'partiesDescription': 'Experience the excitement of nightlife',
        'manualDescription': 'Your personalized itinerary with the best points',
        
        // Location cards
        'visitTime': 'Visit',
        'next': 'next',
        'rating': 'Rating',
        'editLocation': 'Edit',
        'noLocationsFound': 'No locations found for this itinerary.',
        
        // Itinerary messages
        'noItineraryFound': 'No itinerary found. Redirecting to home page.',
        'itineraryAddedToFavorites': 'Itinerary added to favorites!',
        'editingLocation': 'Editing location - In production, this feature would allow itinerary customization.',
        'sharingItinerary': 'Sharing itinerary - In production, this feature would allow sharing via social media or link.',
        
        // ===== SYSTEM MESSAGES =====
        'loading': 'Loading...',
        'saving': 'Saving...',
        'updating': 'Updating...',
        'success': 'Success!',
        'error': 'Error!',
        'warning': 'Warning!',
        'info': 'Information',
        
        // Confirmations
        'confirmLogout': 'Are you sure you want to logout?',
        'confirmDelete': 'Are you sure you want to delete?',
        'confirmAction': 'Confirm action?',
        
        // Image upload
        'selectImagesOnly': 'Please select images only',
        'imageMaxSize': 'The image must be maximum 5MB',
        'confirmProfilePhoto': 'Do you want to use this image as profile photo?',
        'uploadError': 'Error uploading',
        'profileUpdateSuccess': 'Profile updated successfully!',
        
        // Development
        'underDevelopment': 'Functionality under development...',
        'comingSoon': 'Coming soon...'
    },
    'es': {
        // ===== ENCABEZADO Y NAVEGACIÓN COMÚN =====
        'appName': 'MiGuía',
        'backToHome': 'Volver a la Página de Inicio',
        'theme': 'Tema',
        'logout': 'Salir',
        'profile': 'Perfil',
        'settings': 'Configuraciones',
        'help': 'Ayuda',
        'faq': 'Preguntas',
        'language': 'Idioma',
        'information': 'Información',
        
        // Estado
        'online': 'En línea',
        
        // ===== MENÚ PRINCIPAL =====
        // Secciones del Menú
        'timeline': 'Línea de tiempo',
        'saved': 'Guardados',
        
        // Sección Guardados
        'savedItems': 'Elementos Guardados',
        'savedDescription': 'Administre todos los elementos que ha guardado para referencia futura.',
        'savedRoutes': 'Rutas Guardadas',
        'savedRoutesDesc': 'Tienes 5 rutas guardadas. Tus últimos guardados fueron hace 2 días.',
        'favoritePlaces': 'Lugares Favoritos',
        'favoritePlacesDesc': '12 ubicaciones marcadas como favoritas para visitas futuras.',
        'restaurants': 'Restaurantes',
        'restaurantsDesc': '8 restaurantes guardados para probar durante tus viajes.',
        
        // Sección Línea de Tiempo
        'timelineDescription': 'Realiza un seguimiento de tus actividades y eventos recientes en orden cronológico.',
        'recentActivity': 'Actividad Reciente',
        'recentActivityDesc': 'Iniciaste sesión 5 veces la semana pasada. Tu última actividad fue hoy a las 14:32.',
        'travelHistory': 'Historial de Viajes',
        'travelHistoryDesc': 'Revisa todos los destinos que has visitado o planeado.',
        'upcomingEvents': 'Próximos Eventos',
        'upcomingEventsDesc': 'Visualiza tus planes futuros y actividades programadas.',
        
        // Sección Perfil
        'yourInformation': 'Tu Información',
        'editProfile': 'Editar Perfil',
        'personalInfo': 'Información Personal',
        'name': 'Nombre',
        'cpf': 'CPF',
        'phone': 'Teléfono',
        'userId': 'ID de Usuario',
        'accessLevel': 'Nivel de Acceso',
        'changePassword': 'Cambiar Contraseña',
        'changePhoto': 'Cambiar Foto',
        'notInformed': 'No informado',
        
        // Botones de Acción
        'save': 'Guardar',
        'cancel': 'Cancelar',
        'edit': 'Editar',
        
        // Sección Preguntas
        'faqDescription': 'Encuentra respuestas a las preguntas más comunes sobre el uso del sistema.',
        'howItWorks': '¿Cómo funciona para crear tu itinerario?',
        'followSteps': 'Sigue estos simples pasos para crear tu itinerario personalizado:',
        'step1Title': 'Después del inicio de sesión',
        'step1Desc': 'Accede a tu cuenta en el sistema para comenzar a crear tu itinerario.',
        'step2Title': 'Ingresa la dirección de inicio',
        'step2Desc': 'Ingresa la dirección desde donde deseas que sea el punto de partida de tu itinerario.',
        'step3Title': 'Selecciona el tema',
        'step3Desc': 'Elige el tema del itinerario: gastronomía, historia, fiestas, paisajes, etc.',
        'step4Title': 'Genera tu itinerario',
        'step4Desc': 'Haz clic en el botón "Generar mi itinerario" para crear tu itinerario personalizado.',
        'step5Title': 'Confirma el itinerario',
        'step5Desc': 'Verifica si el itinerario coincide con lo que querías y haz clic en "Confirmar itinerario".',
        'step6Title': '¡Diviértete!',
        'step6Desc': '¡Sigue los puntos propuestos por el itinerario y disfruta de tu experiencia!',
        
        // Guía Manual
        'manualGuide': 'Cómo crear la guía manualmente',
        'manualGuideDesc': 'Crea tu propio itinerario personalizado siguiendo estos pasos:',
        'manualStep1Title': 'Accede al creador manual',
        'manualStep1Desc': 'En la página principal, haz clic en "Crear Itinerario Manual" para comenzar.',
        'manualStep2Title': 'Define el título y la descripción',
        'manualStep2Desc': 'Dale un nombre a tu itinerario y agrega una descripción sobre lo que los usuarios pueden esperar.',
        'manualStep3Title': 'Agrega ubicaciones',
        'manualStep3Desc': 'Busca y agrega las ubicaciones que deseas incluir en el itinerario. Puedes organizarlas en el orden preferido.',
        'manualStep4Title': 'Configura los detalles',
        'manualStep4Desc': 'Establece el tiempo estimado en cada ubicación, agrega consejos e información relevante.',
        'manualStep5Title': 'Agrega imágenes',
        'manualStep5Desc': 'Incluye fotos de las ubicaciones para hacer el itinerario más atractivo e informativo.',
        'manualStep6Title': 'Guarda y publica',
        'manualStep6Desc': 'Revisa tu itinerario y haz clic en "Guardar" o "Publicar" para disponibilizarlo.',
        
        // Sección Idioma
        'languageDescription': 'Selecciona y configura tu idioma preferido.',
        'portuguese': 'Portugués (Brasil)',
        'english': 'Inglés',
        'spanish': 'Español',
        'currentLanguage': 'Idioma actual',
        'clickToChange': 'Haz clic para cambiar',
        
        // Footer
        'copyright': '© 2025 Sistema de Dashboard. Todos los derechos reservados.',
        
        // ===== PANTALLA DE INICIO =====
        'createItinerary': 'Crea tu itinerario personalizado',
        'itineraryDescription': 'Ingresa tu ubicación y selecciona un tema para generar un itinerario único',
        'enterLocation': 'Ingresa tu dirección de partida',
        'useMyLocation': 'Usar mi ubicación',
        'chooseTheme': 'Elige el tema de tu itinerario',
        'themeDescription': 'Selecciona una categoría para explorar destinos increíbles',
        'parties': 'Fiestas',
        'partiesDesc': 'Descubre los mejores eventos y festivales',
        'gastronomy': 'Gastronomía',
        'gastronomyDesc': 'Explora la cocina local y restaurantes',
        'history': 'Historia',
        'historyDesc': 'Conoce la rica historia y patrimonios',
        'landscapes': 'Paisajes',
        'landscapesDesc': 'Descubre los paisajes naturales más bellos',
        'culture': 'Cultura',
        'cultureDesc': 'Vivencia las tradiciones y expresiones culturales',
        'manualGuideCard': 'Crear Guía Manualmente',
        'manualGuideCardDesc': 'Personaliza tu propio itinerario de viaje',
        'generateItinerary': 'Generar Mi Itinerario',
        'generatingItinerary': 'Generando tu itinerario personalizado...',
        'pleaseWait': 'Esto puede tomar unos segundos',
        
        // Mensajes de Validación
        'selectTheme': 'Por favor, selecciona un tema para tu itinerario.',
        'enterLocationAlert': 'Por favor, ingresa tu ubicación.',
        'copyrightHome': '© 2025 MiGuía - Todos los derechos reservados',
        
        // ===== PANTALLA DE ITINERARIO GENERADO =====
        'itineraryGuide': 'Itinerario de la Guía',
        'backToStart': 'Volver al Inicio',
        'share': 'Compartir',
        'favorite': 'Favorito',
        'itineraryLocation': 'Ubicación del Itinerario',
        'explorePoints': 'Explora los puntos seleccionados',
        'confirmItinerary': 'Confirmar Itinerario',
        'totalDistance': 'Distancia total',
        'estimatedTime': 'Tiempo estimado',
        'routePoints': 'Puntos de la Ruta',
        'itineraryMap': 'Mapa del Itinerario',
        'viewLocationsMap': 'Visualiza los locales en el mapa',
        'mapFunctionality': 'Funcionalidad del Mapa',
        'routePointsView': 'Visualización de puntos de ruta',
        'optimizedRoutes': 'Rutas optimizadas entre ubicaciones',
        'travelTimes': 'Tiempos de viaje',
        'stepByStepNavigation': 'Navegación paso a paso',
        
        // Descripciones por tema
        'historyDescription': 'Explora los puntos históricos y culturales de la región',
        'gastronomyDescription': 'Descubre los sabores y restaurantes locales',
        'landscapesDescription': 'Aprecia las vistas más impresionantes de la región',
        'cultureDescription': 'Conoce la rica escena cultural local',
        'partiesDescription': 'Vive la animación de la vida nocturna',
        'manualDescription': 'Tu itinerario personalizado con los mejores puntos',
        
        // Tarjetas de ubicación
        'visitTime': 'Visita',
        'next': 'próximo',
        'rating': 'Calificación',
        'editLocation': 'Editar',
        'noLocationsFound': 'No se encontraron ubicaciones para este itinerario.',
        
        // Mensajes del itinerario
        'noItineraryFound': 'No se encontró ningún itinerario. Redirigiendo a la página de inicio.',
        'itineraryAddedToFavorites': '¡Itinerario agregado a favoritos!',
        'editingLocation': 'Editando ubicación - En producción, esta funcionalidad permitiría personalizar el itinerario.',
        'sharingItinerary': 'Compartiendo itinerario - En producción, esta funcionalidad permitiría compartir a través de redes sociales o enlace.',
        
        // ===== MENSAJES DEL SISTEMA =====
        'loading': 'Cargando...',
        'saving': 'Guardando...',
        'updating': 'Actualizando...',
        'success': '¡Éxito!',
        'error': '¡Error!',
        'warning': '¡Advertencia!',
        'info': 'Información',
        
        // Confirmaciones
        'confirmLogout': '¿Estás seguro de que deseas salir?',
        'confirmDelete': '¿Estás seguro de que deseas eliminar?',
        'confirmAction': '¿Confirmar acción?',
        
        // Carga de imagen
        'selectImagesOnly': 'Por favor, selecciona solo imágenes',
        'imageMaxSize': 'La imagen debe tener máximo 5MB',
        'confirmProfilePhoto': '¿Deseas usar esta imagen como foto de perfil?',
        'uploadError': 'Error al cargar',
        'profileUpdateSuccess': '¡Perfil actualizado con éxito!',
        
        // Desarrollo
        'underDevelopment': 'Funcionalidad en desarrollo...',
        'comingSoon': 'Próximamente...',
         // ===== CADASTRO =====
        'registerTitle': 'Cadastro - MeuGuia',
        'registerHeader': 'Crie sua conta para começar a usar',
        'fullName': 'Nome Completo',
        'fullNamePlaceholder': 'Digite seu nome completo',
        'email': 'E-mail',
        'emailPlaceholder': 'Digite seu e-mail',
        'cpf': 'CPF',
        'cpfPlaceholder': 'Digite seu CPF',
        'password': 'Senha',
        'passwordPlaceholder': 'Crie uma senha',
        'confirmPassword': 'Confirmar Senha',
        'confirmPasswordPlaceholder': 'Confirme sua senha',
        'registerButton': 'Cadastrar',
        'orDivider': 'ou',
        'registerWithGoogle': 'Cadastrar com Google',
        'backToLogin': 'Voltar para Login',
        'copyright': '© 2025 MeuGuia - Todos os direitos reservados',
        'passwordMismatch': 'As senhas não coincidem!',
        'passwordError': 'Erro de senha',
        'registrationSuccess': 'Cadastro realizado com sucesso!',
        'registrationError': 'Erro no cadastro',
        
        // ===== LOGIN =====
        'loginTitle': 'Login - MeuGuia',
        'loginHeader': 'Faça login para acessar sua conta',
        'emailOrUsername': 'E-mail',
        'emailOrUsernamePlaceholder': 'Digite seu e-mail',
        'passwordLogin': 'Senha',
        'passwordLoginPlaceholder': 'Digite sua senha',
        'rememberMe': 'Lembrar-me',
        'forgotPassword': 'Esqueci minha senha',
        'loginButton': 'Fazer Login',
        'noAccount': 'Não tem uma conta?',
        'signupLink': 'Cadastrar',
        'signIn': 'Entrar',
        'loginError': 'E-mail ou senha incorretos',
        'logoutSuccess': 'Você foi desconectado com sucesso.',
        'togglePassword': 'Mostrar/Ocultar senha',
        'loginSuccess': 'Login realizado com sucesso!',
        
        // ===== MAPA =====
        'mapTitle': 'Mapa - GUIAP',
        'menu': 'Menu',
        'searchMap': 'Pesquisar no mapa...',
        'search': 'Buscar',
        'profile': 'Perfil',
        'logoutMap': 'Sair',
        'backToHome': 'Voltar à Página Inicial',
        'savedLocations': 'Locais Salvos',
        'recentLocations': 'Recentes',
        'savedRoutes': 'Rotas Salvas',
        'shareLocation': 'Compartilhar Local',
        'myContributions': 'Minhas Contribuições',
        'settings': 'Configurações',
        'help': 'Ajuda',
        'zoomIn': 'Zoom In',
        'zoomOut': 'Zoom Out',
        'myLocation': 'Minha Localização',
        'findingLocation': 'Buscando sua localização...',
        'information': 'Informações',
        'busStation': 'Rodoviária de Itapetininga',
        'busAddress': 'Terminal Rodoviário - Jardim Paulista, Itapetininga - SP, 18201',
        'busPhone': '(15) 3271-XXXX',
        'church': 'Igreja Matriz',
        'churchAddress': 'Pça. Duque de Caxias 158 (Centro), Itapetininga, SP, 18200-003',
        'churchPhone': '(15) 3271-0250',
        'rating': 'Avaliação',
        'estimatedTime': 'Tempo estimado até o destino:',
        'bus': 'Ônibus',
        'car': 'Carro',
        'walking': 'Caminhada',
        'busTime': '45min',
        'carTime': '2h',
        'walkingTime': '6h',
        'publicTransport': 'Serviço de transporte público com diversas linhas atendendo a região de Itapetininga e cidades vizinhas.',
        'historicalChurch': 'Igreja histórica localizada no centro da cidade, com arquitetura impressionante e importância cultural para a região.',
        
        // ===== CRIAR-GUIA ===== (se você tiver esta tela)
        'createGuideTitle': 'Criar Guia - MeuGuia',
        // ... adicione mais conforme necessário
    },
    'en': {
        // ... suas traduções atuais ...
        
        // ===== REGISTRATION =====
        'registerTitle': 'Registration - MyGuide',
        'registerHeader': 'Create your account to get started',
        'fullName': 'Full Name',
        'fullNamePlaceholder': 'Enter your full name',
        'email': 'Email',
        'emailPlaceholder': 'Enter your email',
        'cpf': 'CPF',
        'cpfPlaceholder': 'Enter your CPF',
        'password': 'Password',
        'passwordPlaceholder': 'Create a password',
        'confirmPassword': 'Confirm Password',
        'confirmPasswordPlaceholder': 'Confirm your password',
        'registerButton': 'Register',
        'orDivider': 'or',
        'registerWithGoogle': 'Register with Google',
        'backToLogin': 'Back to Login',
        'copyright': '© 2025 MyGuide - All rights reserved',
        'passwordMismatch': 'Passwords do not match!',
        'passwordError': 'Password error',
        'registrationSuccess': 'Registration successful!',
        'registrationError': 'Registration error',
        
        // ===== LOGIN =====
        'loginTitle': 'Login - MyGuide',
        'loginHeader': 'Log in to access your account',
        'emailOrUsername': 'Email',
        'emailOrUsernamePlaceholder': 'Enter your email',
        'passwordLogin': 'Password',
        'passwordLoginPlaceholder': 'Enter your password',
        'rememberMe': 'Remember me',
        'forgotPassword': 'Forgot password',
        'loginButton': 'Log In',
        'noAccount': 'Don\'t have an account?',
        'signupLink': 'Sign Up',
        'signIn': 'Sign In',
        'loginError': 'Incorrect email or password',
        'logoutSuccess': 'You have been successfully logged out.',
        'togglePassword': 'Show/Hide password',
        'loginSuccess': 'Login successful!',
        
        // ===== MAP =====
        'mapTitle': 'Map - GUIAP',
        'menu': 'Menu',
        'searchMap': 'Search on map...',
        'search': 'Search',
        'profile': 'Profile',
        'logoutMap': 'Logout',
        'backToHome': 'Back to Home Page',
        'savedLocations': 'Saved Locations',
        'recentLocations': 'Recent',
        'savedRoutes': 'Saved Routes',
        'shareLocation': 'Share Location',
        'myContributions': 'My Contributions',
        'settings': 'Settings',
        'help': 'Help',
        'zoomIn': 'Zoom In',
        'zoomOut': 'Zoom Out',
        'myLocation': 'My Location',
        'findingLocation': 'Finding your location...',
        'information': 'Information',
        'busStation': 'Itapetininga Bus Station',
        'busAddress': 'Bus Terminal - Jardim Paulista, Itapetininga - SP, 18201',
        'busPhone': '(15) 3271-XXXX',
        'church': 'Main Church',
        'churchAddress': 'Pça. Duque de Caxias 158 (Centro), Itapetininga, SP, 18200-003',
        'churchPhone': '(15) 3271-0250',
        'rating': 'Rating',
        'estimatedTime': 'Estimated time to destination:',
        'bus': 'Bus',
        'car': 'Car',
        'walking': 'Walking',
        'busTime': '45min',
        'carTime': '2h',
        'walkingTime': '6h',
        'publicTransport': 'Public transport service with several lines serving the Itapetininga region and neighboring cities.',
        'historicalChurch': 'Historic church located in the city center, with impressive architecture and cultural importance for the region.',
    },
    'es': {
        // ... suas traduções atuais ...
        
        // ===== REGISTRO =====
        'registerTitle': 'Registro - MiGuía',
        'registerHeader': 'Crea tu cuenta para comenzar',
        'fullName': 'Nombre Completo',
        'fullNamePlaceholder': 'Ingresa tu nombre completo',
        'email': 'Correo Electrónico',
        'emailPlaceholder': 'Ingresa tu correo',
        'cpf': 'CPF',
        'cpfPlaceholder': 'Ingresa tu CPF',
        'password': 'Contraseña',
        'passwordPlaceholder': 'Crea una contraseña',
        'confirmPassword': 'Confirmar Contraseña',
        'confirmPasswordPlaceholder': 'Confirma tu contraseña',
        'registerButton': 'Registrar',
        'orDivider': 'o',
        'registerWithGoogle': 'Registrarse con Google',
        'backToLogin': 'Volver a Iniciar Sesión',
        'copyright': '© 2025 MiGuía - Todos los derechos reservados',
        'passwordMismatch': '¡Las contraseñas no coinciden!',
        'passwordError': 'Error de contraseña',
        'registrationSuccess': '¡Registro exitoso!',
        'registrationError': 'Error en el registro',
        
        // ===== INICIO DE SESIÓN =====
        'loginTitle': 'Inicio de Sesión - MiGuía',
        'loginHeader': 'Inicia sesión para acceder a tu cuenta',
        'emailOrUsername': 'Correo Electrónico',
        'emailOrUsernamePlaceholder': 'Ingresa tu correo',
        'passwordLogin': 'Contraseña',
        'passwordLoginPlaceholder': 'Ingresa tu contraseña',
        'rememberMe': 'Recordarme',
        'forgotPassword': 'Olvidé mi contraseña',
        'loginButton': 'Iniciar Sesión',
        'noAccount': '¿No tienes una cuenta?',
        'signupLink': 'Registrarse',
        'signIn': 'Entrar',
        'loginError': 'Correo o contraseña incorrectos',
        'logoutSuccess': 'Has sido desconectado exitosamente.',
        'togglePassword': 'Mostrar/Ocultar contraseña',
        'loginSuccess': '¡Inicio de sesión exitoso!',
        
        // ===== MAPA =====
        'mapTitle': 'Mapa - GUIAP',
        'menu': 'Menú',
        'searchMap': 'Buscar en el mapa...',
        'search': 'Buscar',
        'profile': 'Perfil',
        'logoutMap': 'Salir',
        'backToHome': 'Volver a la Página de Inicio',
        'savedLocations': 'Ubicaciones Guardadas',
        'recentLocations': 'Recientes',
        'savedRoutes': 'Rutas Guardadas',
        'shareLocation': 'Compartir Ubicación',
        'myContributions': 'Mis Contribuciones',
        'settings': 'Configuraciones',
        'help': 'Ayuda',
        'zoomIn': 'Acercar',
        'zoomOut': 'Alejar',
        'myLocation': 'Mi Ubicación',
        'findingLocation': 'Buscando tu ubicación...',
        'information': 'Información',
        'busStation': 'Terminal de Autobuses de Itapetininga',
        'busAddress': 'Terminal Rodoviário - Jardim Paulista, Itapetininga - SP, 18201',
        'busPhone': '(15) 3271-XXXX',
        'church': 'Iglesia Principal',
        'churchAddress': 'Pça. Duque de Caxias 158 (Centro), Itapetininga, SP, 18200-003',
        'churchPhone': '(15) 3271-0250',
        'rating': 'Calificación',
        'estimatedTime': 'Tiempo estimado hasta el destino:',
        'bus': 'Autobús',
        'car': 'Auto',
        'walking': 'Caminando',
        'busTime': '45min',
        'carTime': '2h',
        'walkingTime': '6h',
        'publicTransport': 'Servicio de transporte público con varias líneas que atienden la región de Itapetininga y ciudades vecinas.',
        'historicalChurch': 'Iglesia histórica ubicada en el centro de la ciudad, con arquitectura impresionante e importancia cultural para la región.',
    
    }
};

// ===== EXPORTAÇÃO GLOBAL =====
// Torna disponível no escopo global para todos os scripts
if (typeof window !== 'undefined') {
    window.translations = translations;
    console.log('Translations carregadas globalmente com', 
                Object.keys(translations).length, 'idiomas disponíveis');
}

// Compatibilidade com CommonJS (Node.js/Webpack)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations };
}

// Compatibilidade com ES6 Modules
if (typeof exports !== 'undefined') {
    exports.translations = translations;
}

// Função auxiliar global para acessar traduções diretamente
window.getTranslation = function(key, lang = null) {
    if (!window.translations) {
        console.warn('Translations ainda não carregadas');
        return key;
    }
    
    const targetLang = lang || 
                      localStorage.getItem('preferredLanguage') || 
                      'pt-BR';
    
    return window.translations[targetLang]?.[key] || key;
};