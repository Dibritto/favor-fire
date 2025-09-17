
import { redirect } from 'next/navigation';

export default function SettingsPage() {
  // Redireciona para a primeira subpágina de configurações por padrão
  redirect('/admin/configuracoes/cores');
}
