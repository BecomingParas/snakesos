import { redirect } from 'next/navigation';

export default function CitizenProfileRedirect() {
  redirect('/dashboard/citizen/settings');
}
