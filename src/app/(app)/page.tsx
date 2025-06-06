import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // The main dashboard for authenticated users will be the favor discovery page.
  redirect('/favors');
  
  // You can add actual dashboard content here in the future if needed.
  // For now, returning null as redirect will handle the navigation.
  return null; 
}
