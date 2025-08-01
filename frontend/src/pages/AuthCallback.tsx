import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuthStore } from '../store/authStore';

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser, setSession, setLoading } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      setLoading(true);
      // Supabase can return error details in the query string or the hash fragment.
      const params = new URLSearchParams(location.search);
      const hashParams = new URLSearchParams(location.hash.replace('#', ''));

      const error = params.get('error') || hashParams.get('error');
      const errorDescription = params.get('error_description') || hashParams.get('error_description');

      if (error) {
        console.error('OAuth Error:', { error, errorDescription });
        if (errorDescription?.includes('Database error saving new user')) {
          navigate('/signup?message=Please sign up before signing in.');
        } else {
          navigate(`/login?error=${encodeURIComponent(errorDescription || 'An unknown error occurred during authentication.')}`);
        }
        setLoading(false);
        return;
      }

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session) {
          setSession(session);

          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (profileError && profileError.code === 'PGRST116') { // No rows found
            console.log('No profile found, redirecting to create profile.');
            navigate('/create-profile');
          } else if (profileError) {
            throw profileError;
          } else {
            setUser(profile);
            navigate('/feed');
          }
        } else {
          // If no session, it means the callback was not successful or session expired
          navigate('/login?error=Authentication failed or session expired.');
        }
      } catch (err) {
        console.error('Error during authentication callback:', err);
        navigate(`/login?error=${encodeURIComponent('An error occurred during authentication.')}`);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [location, navigate, setUser, setSession, setLoading]);

  return <div>Loading...</div>;
};

export default AuthCallback;
