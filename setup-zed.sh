#!/bin/bash

# Script de bootstrap para configuração do Zed
# Ele prepara o ambiente com as extensões essenciais e settings.json

# Cores para output maneiro no terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Configurando ambiente Zed para o projeto GAITA...${NC}"

# 1. Define o caminho da pasta de configuração do Zed no Mac
ZED_CONFIG_PATH="$HOME/Library/Application Support/Zed"
SETTINGS_FILE="$ZED_CONFIG_PATH/settings.json"

# 2. Cria a pasta se ela não existir
mkdir -p "$ZED_CONFIG_PATH"

# 3. Lista oficial das extensões que vamos precisar (IDs corretos)
#    Fonte: Documentação oficial e estrutura de pastas do Zed [citation:3][citation:4]
declare -A EXTENSIONS=(
    ["JS/TS (Core)"]="js"                # Já vem nativo, mas é bom garantir
    ["Tailwind CSS"]="tailwindcss"       # Autocomplete mágico
    ["ESLint"]="eslint"                  # Segurança contra erros bobos
    ["Emmet"]="emmet"                    # Velocidade no front-end
    ["Git Diff"]="git"                   # Visualizar mudanças
    ["Codex CLI"]="codex-cli"           # IA assistente (sua escolha)
)

# 4. Adiciona ou atualiza a chave 'auto_install_extensions' no settings.json
echo -e "${BLUE}📝 Atualizando $SETTINGS_FILE com auto_install_extensions...${NC}"

# Cria um arquivo temporário para processar o JSON com o jq (caso tenha instalado)
# Se não tiver o jq, usa um fallback mais simples.
if command -v jq &> /dev/null; then
    # Se tiver jq, faz o merge bonitinho
    for ext_id in "${EXTENSIONS[@]}"; do
        TMP_SETTINGS=$(mktemp)
        jq --arg id "$ext_id" '.auto_install_extensions[$id] = true' "$SETTINGS_FILE" > "$TMP_SETTINGS" 2>/dev/null || echo "{}" > "$TMP_SETTINGS"
        mv "$TMP_SETTINGS" "$SETTINGS_FILE"
    done
    echo -e "${GREEN}✅ Settings.json atualizado com sucesso usando jq.${NC}"
else
    # Fallback: Se não tiver jq, avisa e cria um settings.json base
    echo -e "${BLUE}⚠️  jq não encontrado. Instale com 'brew install jq' para um merge perfeito.${NC}"
    echo -e "${BLUE}📄 Criando settings.json base...${NC}"
    
    cat > "$SETTINGS_FILE" << EOF
{
  "auto_install_extensions": {
    "js": true,
    "tailwindcss": true,
    "eslint": true,
    "emmet": true,
    "git": true,
    "codex-cli": true
  }
}
EOF
fi

# 5. Mensagem final
echo -e "${GREEN}✨ Ambiente configurado! ✨${NC}"
echo -e "${BLUE}🧩 As seguintes extensões serão instaladas automaticamente quando você abrir o Zed:${NC}"
for ext_name in "${!EXTENSIONS[@]}"; do
    echo "  - $ext_name"
done

echo ""
echo -e "${GREEN}🎯 Próximo passo:${NC} Feche e reabra o Zed (ou execute 'Zed: Reload' no comando pallete)."
echo -e "   O Zed vai baixar e instalar tudo sozinho nos próximos segundos!"

