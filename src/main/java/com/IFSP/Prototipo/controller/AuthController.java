package com.IFSP.Prototipo.controller;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.IFSP.Prototipo.model.Usuario;
import com.IFSP.Prototipo.service.FileStorageService;
import com.IFSP.Prototipo.service.UsuarioService;

import com.IFSP.Prototipo.service.RoteiroService;
import com.IFSP.Prototipo.service.MapsRoutingService;
import com.IFSP.Prototipo.model.Roteiro;
import com.IFSP.Prototipo.dto.RespostaRoteiroDTO;
import com.IFSP.Prototipo.dto.RoteiroDTO;
import com.IFSP.Prototipo.mapper.RoteiroMapper;
import com.IFSP.Prototipo.model.LocalRoteiro;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;

@Controller
public class AuthController {
    @Autowired
    private RoteiroService roteiroService;

    @Autowired
    private MapsRoutingService mapsRoutingService;

    // Adicione no AuthController.java
    @GetMapping("/api/lugares-reais")
    @ResponseBody
    public Map<String, Object> getLugaresReais(
            @RequestParam String cidade,
            @RequestParam String tema,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Carregar do arquivo JSON
            Resource resource = new ClassPathResource("static/data/lugares-reais.json");
            String jsonContent = new String(Files.readAllBytes(resource.getFile().toPath()));
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> lugaresData = mapper.readValue(jsonContent, Map.class);

            // Buscar lugares para a cidade e tema
            String cidadeKey = cidade.toLowerCase();
            if (lugaresData.containsKey(cidadeKey)) {
                Map<String, Object> cidadeData = (Map<String, Object>) lugaresData.get(cidadeKey);
                if (cidadeData.containsKey(tema)) {
                    response.put("success", true);
                    response.put("lugares", cidadeData.get(tema));
                    response.put("total", ((List) cidadeData.get(tema)).size());
                    return response;
                }
            }

            response.put("success", false);
            response.put("message", "Nenhum lugar encontrado para " + cidade + " - " + tema);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro: " + e.getMessage());
        }

        return response;
    }

    // NOVO ENDPOINT: Salvar roteiro
    @PostMapping("/api/salvar-roteiro")
    @ResponseBody
    public Map<String, Object> salvarRoteiro(@RequestBody Map<String, Object> dadosRoteiro,
            HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        if (session.getAttribute("usuarioLogado") == null) {
            response.put("success", false);
            response.put("message", "Usuário não logado");
            return response;
        }

        try {
            Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");

            // Adicionar título se não existir
            if (!dadosRoteiro.containsKey("titulo")) {
                String localizacao = (String) dadosRoteiro.getOrDefault("userLocation", "");
                String tema = (String) dadosRoteiro.getOrDefault("theme", "");
                dadosRoteiro.put("titulo", "Roteiro " + tema + " - " + localizacao);
            }

            // Salvar no banco
            Roteiro roteiroSalvo = roteiroService.salvarRoteiro(usuario, dadosRoteiro);

            response.put("success", true);
            response.put("message", "Roteiro salvo com sucesso!");
            response.put("roteiroId", roteiroSalvo.getId());
            response.put("titulo", roteiroSalvo.getTitulo());

            // Salvar no session para usar na página de mapa
            session.setAttribute("ultimoRoteiroSalvo", roteiroSalvo.getId());

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro ao salvar roteiro: " + e.getMessage());
        }

        return response;
    }

    // NOVO ENDPOINT: Carregar roteiro para o mapa
    @GetMapping("/api/carregar-roteiro/{id}")
    @ResponseBody
    public RespostaRoteiroDTO carregarRoteiro(@PathVariable Long id, HttpSession session) {
        // Validação de usuário
        if (session.getAttribute("usuarioLogado") == null) {
            return RespostaRoteiroDTO.erro("Usuário não logado");
        }

        try {
            Roteiro roteiro = roteiroService.buscarPorId(id);
            if (roteiro == null) {
                return RespostaRoteiroDTO.erro("Roteiro não encontrado");
            }

            // Verificar se o roteiro pertence ao usuário
            Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
            if (!roteiro.getUsuario().getId().equals(usuario.getId())) {
                return RespostaRoteiroDTO.erro("Acesso negado");
            }

            // Buscar locais
            List<LocalRoteiro> locais = roteiroService.listarLocaisDoRoteiro(roteiro);

            // === NOVO: SE o roteiro não tiver locais (ou tiver poucos), buscar locais
            // populares ===
            if (locais.isEmpty() || locais.size() < 2) {
                System.out.println("⚠️ Roteiro tem poucos locais, buscando locais populares...");

                // Método que vamos criar no RoteiroService
                List<LocalRoteiro> locaisPopulares = roteiroService.buscarLocaisPopularesPorCidadeETema(
                        roteiro.getLocalizacao(),
                        roteiro.getTema());

                if (!locaisPopulares.isEmpty()) {
                    System.out.println("✅ Encontrados " + locaisPopulares.size() + " locais populares");
                    // Adicionar ao roteiro existente
                    locais.addAll(locaisPopulares);
                }
            }
            // === FIM DA NOVA LÓGICA ===

            // Calcular rota
            Map<String, Object> rota = mapsRoutingService.calcularRota(locais);

            // Converter para DTOs
            RoteiroDTO roteiroDTO = RoteiroMapper.toDTOComLocais(roteiro, locais);

            // Retornar resposta padronizada
            return RespostaRoteiroDTO.sucesso(roteiroDTO, rota, locais.size());

        } catch (Exception e) {
            e.printStackTrace();
            return RespostaRoteiroDTO.erro("Erro ao carregar roteiro: " + e.getMessage());
        }
    }

    // NOVO: Endpoint para listar roteiros do usuário
    @GetMapping("/api/meus-roteiros")
    @ResponseBody
    public Map<String, Object> listarRoteiros(HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        if (session.getAttribute("usuarioLogado") == null) {
            response.put("success", false);
            response.put("message", "Usuário não logado");
            return response;
        }

        try {
            Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
            List<Roteiro> roteiros = roteiroService.listarRoteirosPorUsuario(usuario);

            // Converter para DTOs resumidos
            List<RoteiroDTO> roteirosDTO = roteiros.stream()
                    .map(RoteiroMapper::toDTOResumido)
                    .collect(Collectors.toList());

            response.put("success", true);
            response.put("roteiros", roteirosDTO);
            response.put("total", roteiros.size());

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro ao listar roteiros: " + e.getMessage());
        }

        return response;
    }

    @Autowired
    private UsuarioService usuarioService;
    @Value("${openai.api.key:}")
    private String openaiApiKey;
    @Autowired
    private FileStorageService fileStorageService;
    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${google.maps.key:}")
    private String googleMapsKey;

    // AuthController.java - método getApiConfig ATUALIZADO:
    // AuthController.java - método getApiConfig ATUALIZADO E MELHORADO:
    @GetMapping("/api/config")
    @ResponseBody
    public Map<String, String> getApiConfig(HttpSession session, HttpServletRequest request) {
        Map<String, String> config = new HashMap<>();

        if (session.getAttribute("usuarioLogado") != null) {
            // Gemini API Key - fornecida apenas para usuários logados
            if (geminiApiKey != null && !geminiApiKey.isEmpty()) {
                config.put("geminiKey", geminiApiKey);
                config.put("geminiStatus", "active");
            } else {
                config.put("geminiKey", "demo-mode");
                config.put("geminiStatus", "demo");
            }

            // Google Maps API Key - fornecida apenas para usuários logados
            if (googleMapsKey != null && !googleMapsKey.isEmpty()) {
                config.put("googleMapsKey", googleMapsKey);
                config.put("mapsStatus", "active");
            } else {
                config.put("googleMapsKey", "demo-mode");
                config.put("mapsStatus", "demo");
            }

            // Informações adicionais para debug
            Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
            config.put("userId", String.valueOf(usuario.getId()));
            config.put("userName", usuario.getNome());

        } else {
            // Usuário não logado - modo demo limitado
            config.put("geminiKey", "demo-mode");
            config.put("googleMapsKey", "demo-mode");
            config.put("geminiStatus", "demo");
            config.put("mapsStatus", "demo");
        }

        // Informações gerais do sistema
        config.put("status", "active");
        config.put("timestamp", new Date().toString());
        config.put("environment", "production");

        // Para compatibilidade com código antigo
        config.put("openaiKey", config.get("geminiKey"));

        return config;
    }

    // AuthController.java - NOVO MÉTODO para endpoints específicos:
    @GetMapping("/api/gemini-key")
    @ResponseBody
    public Map<String, String> getGeminiKey(HttpSession session) {
        Map<String, String> response = new HashMap<>();

        if (session.getAttribute("usuarioLogado") == null) {
            response.put("apiKey", "demo-mode");
            response.put("status", "unauthenticated");
            return response;
        }

        response.put("apiKey", geminiApiKey != null ? geminiApiKey : "demo-mode");
        response.put("status", "active");
        response.put("service", "gemini-ai");

        return response;
    }

    @GetMapping("/api/google-maps-key")
    @ResponseBody
    public Map<String, String> getGoogleMapsKey(HttpSession session) {
        Map<String, String> response = new HashMap<>();

        if (session.getAttribute("usuarioLogado") == null) {
            response.put("apiKey", "demo-mode");
            response.put("status", "unauthenticated");
            return response;
        }

        response.put("apiKey", googleMapsKey != null ? googleMapsKey : "demo-mode");
        response.put("status", "active");
        response.put("service", "google-maps");

        return response;
    }

    @GetMapping("/")
    public String homePage(Model model) {
        return "index";
    }

    @GetMapping("/login")
    public String loginPage(Model model,
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "success", required = false) String success,
            @RequestParam(value = "logout", required = false) String logout) {

        if (error != null) {
            model.addAttribute("error", "Email ou senha incorretos");
        }
        if (success != null) {
            model.addAttribute("success", "Cadastro realizado com sucesso! Faça login para continuar.");
        }
        if (logout != null) {
            model.addAttribute("info", "Você foi desconectado com sucesso.");
        }

        return "login";
    }

    @GetMapping("/cadastro")
    public String registerPage(Model model) {
        model.addAttribute("usuario", new Usuario());
        return "cadastro";
    }

    @GetMapping("/roteiro")
    public String roteiroPage(HttpSession session, Model model, HttpServletRequest request) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login";
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
        String primeiroNome = extrairPrimeiroNome(usuario.getNome());
        model.addAttribute("primeiroNome", primeiroNome);
        model.addAttribute("usuario", usuario);
        model.addAttribute("userTheme", getUserTheme(request, session));

        return "roteiro";
    }

    @GetMapping("/gastronomia")
    public String gastronomiaPage(HttpSession session, Model model, HttpServletRequest request) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login";
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
        String primeiroNome = extrairPrimeiroNome(usuario.getNome());
        model.addAttribute("primeiroNome", primeiroNome);
        model.addAttribute("userTheme", getUserTheme(request, session));

        return "gastronomia";
    }

    @GetMapping("/mapa")
    public String mapaPage(HttpSession session, Model model, HttpServletRequest request) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login";
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
        String primeiroNome = extrairPrimeiroNome(usuario.getNome());
        model.addAttribute("primeiroNome", primeiroNome);
        model.addAttribute("userTheme", getUserTheme(request, session));

        return "mapa";
    }

    @GetMapping("/criar-guia")
    public String criarGuiaPage(HttpSession session, Model model, HttpServletRequest request) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login";
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
        String primeiroNome = extrairPrimeiroNome(usuario.getNome());
        model.addAttribute("primeiroNome", primeiroNome);
        model.addAttribute("usuario", usuario);
        model.addAttribute("userTheme", getUserTheme(request, session));

        return "criar-guia";
    }

    @PostMapping("/confirmar-roteiro")
    public String confirmarRoteiro(
            @RequestParam(value = "distance", required = false) String distance,
            @RequestParam(value = "time", required = false) String time,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login";
        }

        if (distance != null) {
            redirectAttributes.addFlashAttribute("roteiroDistance", distance);
        }
        if (time != null) {
            redirectAttributes.addFlashAttribute("roteiroTime", time);
        }

        return "redirect:/mapa";
    }

    @PostMapping("/criar-guia")
    public String processarCriacaoGuia(@RequestParam String nomeGuia,
            @RequestParam String destino,
            @RequestParam String tematica,
            @RequestParam(required = false) String[] atividades,
            @RequestParam String duracao,
            @RequestParam String orcamento,
            @RequestParam(required = false) String observacoes,
            Model model) {

        System.out.println("Guia criado: " + nomeGuia);
        System.out.println("Destino: " + destino);
        System.out.println("Temática: " + tematica);
        System.out.println("Duração: " + duracao + " dias");
        System.out.println("Orçamento: " + orcamento);

        if (atividades != null) {
            for (String atividade : atividades) {
                System.out.println("Atividade: " + atividade);
            }
        }

        return "redirect:/inicial?guiaCriado=true";
    }

    @PostMapping("/login")
    public String processLogin(@RequestParam String username,
            @RequestParam String password,
            HttpSession session,
            Model model) {

        Usuario usuario = usuarioService.buscarPorEmail(username);

        if (usuario != null && usuario.getSenha().equals(password)) {
            session.setAttribute("usuarioLogado", usuario);
            session.setAttribute("usuarioNome", usuario.getNome());
            session.setAttribute("usuarioNivel", usuario.getNivelAcesso());

            String primeiroNome = extrairPrimeiroNome(usuario.getNome());
            session.setAttribute("usuarioPrimeiroNome", primeiroNome);

            return "redirect:/inicial";
        }

        return "redirect:/login?error";
    }

    private String extrairPrimeiroNome(String nomeCompleto) {
        if (nomeCompleto == null || nomeCompleto.trim().isEmpty()) {
            return "Usuário";
        }

        String[] partes = nomeCompleto.trim().split(" ");
        return partes[0];
    }

    @GetMapping("/inicial")
    public String inicialPage(HttpSession session, Model model, HttpServletRequest request) {
        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login";
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
        String primeiroNome = extrairPrimeiroNome(usuario.getNome());
        model.addAttribute("primeiroNome", primeiroNome);
        model.addAttribute("usuario", usuario);
        model.addAttribute("userTheme", getUserTheme(request, session));

        return "inicial";
    }

    // NOVO ENDPOINT: Upload de foto de perfil
    @PostMapping("/perfil/upload-foto")
    @ResponseBody
    public Map<String, Object> uploadFotoPerfil(
            @RequestParam("foto") MultipartFile file,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();

        if (session.getAttribute("usuarioLogado") == null) {
            response.put("success", false);
            response.put("message", "Usuário não logado");
            return response;
        }

        try {
            // Validar arquivo
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "Por favor, selecione um arquivo");
                return response;
            }

            // Validar tipo de arquivo
            String contentType = file.getContentType();
            if (contentType == null ||
                    (!contentType.equals("image/jpeg") &&
                            !contentType.equals("image/png") &&
                            !contentType.equals("image/gif"))) {
                response.put("success", false);
                response.put("message", "Por favor, selecione apenas imagens (JPEG, PNG, GIF)");
                return response;
            }

            // Validar tamanho do arquivo (máximo 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                response.put("success", false);
                response.put("message", "A imagem deve ter no máximo 5MB");
                return response;
            }

            Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");

            // Salvar arquivo
            String nomeArquivo = fileStorageService.storeFile(file);

            // Atualizar usuário no banco
            boolean sucesso = usuarioService.atualizarFotoPerfil(usuarioLogado.getId(), nomeArquivo);

            if (sucesso) {
                // Atualizar usuário na sessão
                Usuario usuarioAtualizado = usuarioService.buscarPorId(usuarioLogado.getId());
                session.setAttribute("usuarioLogado", usuarioAtualizado);

                response.put("success", true);
                response.put("message", "Foto de perfil atualizada com sucesso");
                response.put("fotoUrl", "/uploads/" + nomeArquivo);
            } else {
                response.put("success", false);
                response.put("message", "Erro ao atualizar foto de perfil");
            }

        } catch (IOException e) {
            response.put("success", false);
            response.put("message", "Erro ao fazer upload da imagem: " + e.getMessage());
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro inesperado: " + e.getMessage());
        }

        return response;
    }

    // NOVO ENDPOINT: Servir arquivos de upload
    @GetMapping("/uploads/{filename:.+}")
    public void serveFile(@PathVariable String filename, HttpServletResponse response) {
        try {
            Path file = Paths.get("uploads").resolve(filename);
            if (Files.exists(file)) {
                response.setContentType(Files.probeContentType(file));
                Files.copy(file, response.getOutputStream());
                response.getOutputStream().flush();
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            }
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/cadastro")
    public String registerUser(@ModelAttribute Usuario usuario,
            @RequestParam String confirmarSenha,
            Model model) {

        String cpfLimpo = usuario.getCpf().replaceAll("[^0-9]", "");
        usuario.setCpf(cpfLimpo);

        if (!usuario.getSenha().equals(confirmarSenha)) {
            model.addAttribute("error", "As senhas não coincidem");
            return "cadastro";
        }

        if (usuarioService.existePorEmail(usuario.getEmail())) {
            model.addAttribute("error", "Email já cadastrado");
            return "cadastro";
        }

        if (usuarioService.existePorCpf(cpfLimpo)) {
            model.addAttribute("error", "CPF já cadastrado");
            return "cadastro";
        }

        try {
            usuarioService.salvarUsuario(usuario);
            System.out.println("Usuário salvo com ID: " + usuario.getId());

            return "redirect:/login?success";
        } catch (Exception e) {
            model.addAttribute("error", "Erro ao cadastrar usuário: " + e.getMessage());
            return "cadastro";
        }
    }

    @GetMapping("/menu")
    public String menuPage(@RequestParam(value = "section", required = false) String section,
            HttpSession session, Model model, HttpServletRequest request) {

        if (session.getAttribute("usuarioLogado") == null) {
            return "redirect:/login";
        }

        Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
        model.addAttribute("usuario", usuario);
        model.addAttribute("primeiroNome", extrairPrimeiroNome(usuario.getNome()));
        model.addAttribute("userTheme", getUserTheme(request, session));

        if (section != null) {
            model.addAttribute("activeSection", section);
        } else {
            model.addAttribute("activeSection", "salvos");
        }
        return "menu";
    }

    @GetMapping("/logout")
    public String logoutPage(HttpSession session, Model model) {
        session.invalidate();
        return "redirect:/login?logout";
    }

    @PostMapping("/perfil/atualizar")
    @ResponseBody
    public Map<String, Object> atualizarPerfil(
            @RequestParam String campo,
            @RequestParam String valor,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();

        if (session.getAttribute("usuarioLogado") == null) {
            response.put("success", false);
            response.put("message", "Usuário não logado");
            return response;
        }

        if (valor == null || valor.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "O campo não pode ficar vazio");
            return response;
        }

        try {
            Usuario usuarioLogado = (Usuario) session.getAttribute("usuarioLogado");
            Usuario usuario = usuarioService.buscarPorEmail(usuarioLogado.getEmail());

            if (usuario == null) {
                response.put("success", false);
                response.put("message", "Usuário não encontrado");
                return response;
            }

            switch (campo) {
                case "nome":
                    usuario.setNome(valor.trim());
                    break;
                case "telefone":
                    usuario.setTelefone(valor.trim());
                    break;
                case "cpf":
                    String cpfLimpo = valor.replaceAll("[^0-9]", "");
                    if (!cpfLimpo.equals(usuario.getCpf()) && usuarioService.existePorCpf(cpfLimpo)) {
                        response.put("success", false);
                        response.put("message", "CPF já cadastrado");
                        return response;
                    }
                    usuario.setCpf(cpfLimpo);
                    break;
                default:
                    response.put("success", false);
                    response.put("message", "Campo inválido");
                    return response;
            }

            usuarioService.salvarUsuario(usuario);
            session.setAttribute("usuarioLogado", usuario);

            response.put("success", true);
            response.put("message", "Perfil atualizado com sucesso");
            response.put("novoValor", valor.trim());

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erro ao atualizar perfil: " + e.getMessage());
        }

        return response;
    }

    // Método para obter o tema do usuário
    @ModelAttribute("userTheme")
    public String getUserTheme(HttpServletRequest request, HttpSession session) {
        String sessionTheme = (String) session.getAttribute("userTheme");
        if (sessionTheme != null) {
            return sessionTheme;
        }

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("theme".equals(cookie.getName())) {
                    String theme = cookie.getValue();
                    session.setAttribute("userTheme", theme);
                    return theme;
                }
            }
        }

        return "light";
    }

    // Endpoint para alterar o tema
    @PostMapping("/api/theme")
    @ResponseBody
    public Map<String, Object> changeTheme(@RequestParam String theme,
            HttpServletResponse response,
            HttpSession session) {
        Map<String, Object> result = new HashMap<>();

        try {
            if (!"light".equals(theme) && !"dark".equals(theme)) {
                result.put("success", false);
                result.put("message", "Tema inválido");
                return result;
            }

            session.setAttribute("userTheme", theme);

            Cookie themeCookie = new Cookie("theme", theme);
            themeCookie.setPath("/");
            themeCookie.setMaxAge(365 * 24 * 60 * 60);
            themeCookie.setHttpOnly(false);
            response.addCookie(themeCookie);

            result.put("success", true);
            result.put("message", "Tema alterado para " + ("dark".equals(theme) ? "escuro" : "claro"));

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Erro ao alterar tema: " + e.getMessage());
        }

        return result;
    }

    @PostConstruct
    @Transactional
    public void init() {
        try {
            boolean adminExiste = usuarioService.existePorCpf("00000000000") ||
                    usuarioService.existePorEmail("admin@email.com");

            if (!adminExiste && usuarioService.contarUsuarios() == 0) {
                Usuario admin = new Usuario();
                admin.setCpf("00000000000");
                admin.setNome("Administrador");
                admin.setEmail("admin@email.com");
                admin.setSenha("senha123");
                admin.setNivelAcesso("ADMIN");

                usuarioService.salvarUsuario(admin);
                System.out.println("✅ Usuário administrador criado automaticamente");
            }
        } catch (Exception e) {
            System.out.println("⚠️  Não foi possível verificar/criar usuário admin: " + e.getMessage());
        }
    }
}