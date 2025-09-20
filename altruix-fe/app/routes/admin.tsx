import { useEffect } from 'react';

export default function AdminRedirect() {
  useEffect(() => {
    window.location.replace('/admin/fake-account');
  }, []);

  return <div>Redirecting to admin dashboard...</div>;
}
