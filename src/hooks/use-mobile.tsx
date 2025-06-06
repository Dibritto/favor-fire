
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Inicializa o estado como 'false'. No cliente, useEffect irá corrigi-lo imediatamente.
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Esta função será executada apenas no cliente.
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Verifica o dispositivo assim que o componente é montado no cliente.
    checkDevice();

    // Adiciona um listener para o evento de redimensionamento da janela.
    window.addEventListener('resize', checkDevice);

    // Função de limpeza para remover o listener quando o componente for desmontado.
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []); // O array de dependências vazio garante que o efeito execute apenas uma vez na montagem e limpe na desmontagem.

  return isMobile;
}
