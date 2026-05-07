export default function SupportContact() {
  const email = import.meta.env.VITE_SUPPORT_EMAIL || 'streamersupport@planetcuhz.com';
  
  return (
    <p className="support-contact">
      Need help?{' '}
      <a 
        href={`mailto:${email}`} 
        className="protocol-link" 
        aria-label="Email Protocol Support"
        rel="noopener noreferrer"
      >
        {email}
      </a>
    </p>
  );
}
