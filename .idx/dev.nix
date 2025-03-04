{ pkgs, ... }: {
  # Qual canal nixpkgs usar.
  channel = "stable-23.11"; # ou "unstable"

  # Use https://search.nixos.org/packages para encontrar pacotes
  packages = with pkgs; [
    git
    git-lfs
    nodejs_20
    # Adicione aqui outros pacotes específicos do seu projeto
  ];

  # Define variáveis de ambiente no workspace
  env = {
    # Exemplo: NODE_ENV = "development";
  };

  idx = {
    # Procure as extensões desejadas em https://open-vsx.org/ e use "editor.extensão"
    extensions = [
      "rangav.vscode-thunder-client"
      # Adicione outras extensões que você precisa
    ];

    workspace = {
      # Executa quando um workspace é criado pela primeira vez com este arquivo `dev.nix`
      onCreate = {
        npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
        # Adicione outros comandos de inicialização aqui
      };

      # Executa quando um workspace é (re)iniciado
      onStart = {
        run-server = "npm run dev";
        # Adicione outros comandos de inicialização aqui
      };
    };
  };
}