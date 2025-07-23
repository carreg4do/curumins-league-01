// Utilitário para tratamento de erros de rede e autenticação

export class NetworkError extends Error {
  public code?: string
  
  constructor(message: string, code?: string) {
    super(message)
    this.name = 'NetworkError'
    this.code = code
  }
}

export class AuthError extends Error {
  public code?: string
  
  constructor(message: string, code?: string) {
    super(message)
    this.name = 'AuthError'
    this.code = code
  }
}

// Função para detectar e tratar erros específicos
export function handleSupabaseError(error: any): Error {
  if (!error) return new Error('Erro desconhecido')
  
  // Erro de rede/conexão
  if (error.message?.includes('ERR_ABORTED') || 
      error.message?.includes('fetch') ||
      error.message?.includes('network') ||
      error.code === 'NETWORK_ERROR') {
    return new NetworkError('Erro de conexão. Verifique sua internet e tente novamente.', error.code)
  }
  
  // Erros de autenticação
  if (error.message?.includes('Invalid login credentials') ||
      error.message?.includes('Email not confirmed') ||
      error.code === 'invalid_credentials') {
    return new AuthError('Credenciais inválidas. Verifique seu email e senha.', error.code)
  }
  
  if (error.message?.includes('User already registered')) {
    return new AuthError('Este email já está cadastrado.', error.code)
  }
  
  // Erro de timeout
  if (error.message?.includes('timeout') || error.code === 'TIMEOUT') {
    return new NetworkError('Operação expirou. Tente novamente.', error.code)
  }
  
  // Retornar erro original se não for reconhecido
  return error instanceof Error ? error : new Error(String(error))
}

// Função para retry com backoff exponencial
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = handleSupabaseError(error)
      
      // Não fazer retry para erros de autenticação
      if (lastError instanceof AuthError) {
        throw lastError
      }
      
      // Se é a última tentativa, lançar o erro
      if (attempt === maxRetries) {
        throw lastError
      }
      
      // Aguardar antes da próxima tentativa (backoff exponencial)
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

// Função para limpar cache em caso de erro crítico
export function clearAuthCache(): void {
  try {
    // Limpar localStorage
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('supabase') || key.startsWith('sb-')
    )
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    // Limpar sessionStorage
    const sessionKeysToRemove = Object.keys(sessionStorage).filter(key => 
      key.startsWith('supabase') || key.startsWith('sb-')
    )
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key))
    
    console.log('Cache de autenticação limpo')
  } catch (error) {
    console.warn('Erro ao limpar cache:', error)
  }
}