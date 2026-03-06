INSERT INTO usuarios (nome, email, cpf, senha, nivel_acesso)
SELECT 'Administrador', 'admin@email.com', '00000000000', 'senha123', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE cpf = '00000000000');
-- Atualize a tabela usuarios se já existir
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS telefone VARCHAR(20);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS foto_perfil VARCHAR(255);

-- Ou se estiver criando do zero:
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nivel_acesso VARCHAR(50) DEFAULT 'USUARIO',
    telefone VARCHAR(20),
    foto_perfil VARCHAR(255)
);

-- Insira o usuário admin com os novos campos
INSERT INTO usuarios (nome, email, cpf, senha, nivel_acesso, telefone) 
VALUES ('Administrador', 'admin@email.com', '00000000000', 'senha123', 'ADMIN', '(11) 99999-9999')
ON DUPLICATE KEY UPDATE telefone='(11) 99999-9999';