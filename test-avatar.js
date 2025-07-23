// Script de teste para verificar problemas com upload de avatar
import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

// Função para testar inserção de avatar
async function testAvatarUpdate() {
  try {
    // Primeiro, vamos verificar se o usuário existe
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('❌ Usuário não autenticado')
      return
    }
    
    console.log('✅ Usuário autenticado:', user.id)
    
    // Verificar se o perfil existe na tabela users
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      console.log('❌ Erro ao buscar perfil:', profileError)
      return
    }
    
    console.log('✅ Perfil encontrado:', profile)
    
    // Testar atualização do avatar com uma URL simples
    const testAvatarUrl = 'https://via.placeholder.com/150'
    
    const { data, error } = await supabase
      .from('users')
      .update({ 
        avatar: testAvatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()
    
    if (error) {
      console.log('❌ Erro ao atualizar avatar:', error)
      console.log('Código do erro:', error.code)
      console.log('Detalhes:', error.details)
      console.log('Hint:', error.hint)
      console.log('Message:', error.message)
    } else {
      console.log('✅ Avatar atualizado com sucesso:', data)
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error)
  }
}

// Executar teste
testAvatarUpdate()

// Instruções:
// 1. Substitua YOUR_SUPABASE_URL e YOUR_SUPABASE_ANON_KEY pelas suas credenciais
// 2. Execute este script no console do navegador enquanto estiver logado na aplicação
// 3. Verifique os logs para identificar o problema específico