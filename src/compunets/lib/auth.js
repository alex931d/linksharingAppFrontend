import { useEffect, useState } from 'react';
import { useAuthUser,useSignOut,useIsAuthenticated  } from 'react-auth-kit';
import { Axios } from '../../config/config';
import { useSignIn } from 'react-auth-kit'
import { APIContext  } from '../../compunets/lib/context';
import { useContext } from 'react';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';

const cookies = new Cookies();

const useAuth = () => {
  const contextData = useContext(APIContext);
  const {serverData,dataLoaded,updateContextState } = contextData;

  const signIn = useSignIn();
  const signOut = useSignOut()
  const isAuthenticated = useIsAuthenticated();
  const { authState } = useAuthUser();
  const [authData,setAuthData ] = useState(null);
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = cookies.get('_auth');

        if (token) {
          const response = await Axios.post('/api/protected', { method: 'POST' });

          if (!response.data.success) {

            signOut();
            cookies.remove("jwt")
            toast.error('no valid authentication token');
          }
        }
      } catch (error) {
        signOut();
      }
    };

    checkAuthentication();
  }, [isAuthenticated(),signOut,signIn]);
  const login = async (values,loginProvider) => {
    console.log(loginProvider)
    let response = null;
    try {
      if (loginProvider === 'google') {
        response = await Axios.post('/api/loginWithGoogle', {
          AuthToken: values.credential,
          });
      }
      else{
          response = await Axios.post('/api/login', {
          email: values.email,
          password: values.password,
        });
      }

      if (response.status === 200) {
        toast.success('Successfully logged in!');
        signIn({
          token: response.data.token,
          expiresIn: 3600,
          tokenType: "cookie",
          authState: {
            isAuthenticated: true,
            userdata: response.data.user,
            devLinks: response.data.devlink,
          },

        });
      } else if (response.status === 401) {
        toast.error(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
    }
  };
 const logout = async (values) =>{
  try {
    const response = await Axios.post('/api/logout', {
      email: values.email
    });
    if (response.status === 200) {
      signOut();
      cookies.remove("jwt")
      toast.success('Successfully logged out')
    }
    else{
      toast.error(`Error: ${response.data.error}`);
    }
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  }
 }
 const updateUser = async (values,id) =>{
  try {
    const response = await Axios.put('/api/updateUser',{
      id: id,
      props: values
    })
    if (response.status === 200) {
      toast.success(response.data.message)
    }
    else{
      toast.error(`Error: ${response.data.error}`);
    }
  } catch (error) {
    toast.error(`Error updating user`);
  }
 }
 const getPreviewData = async (id) =>{

  try {
    const response = await Axios.post('/api/getPreviewData', {
      id: id
    });
    if (response.status === 200) {
      const devLinks= response.data.devLinks;
      if (devLinks) {
        updateContextState({
          _id: devLinks?._id ?? '',
          items: devLinks?.items ?? [],
          userInfo: {
            firstName: devLinks?.name ?? '',
            lastName: devLinks?.last_name ?? '',
            email: devLinks?.email ?? '',
            profileImg: devLinks?.profile_picture ?? '',
            enable_color_customization: devLinks?.enable_color_customization ?? false,
          },
        });
      }
    } else if (response.status === 400) {
      toast.error(response.data.message);
    } else {
      toast.error(response.data.message);
    }
    
  } catch (error) {
    
  }


 }
 const closeTour = async (values) =>{
  try {
    const response = await Axios.post('/api/closeTour', {
      id: values._id
    });
    if (response.status === 200) {
      toast.success('tutorial has been closed!');
    } else if (response.status === 401) {
      toast.error(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
  }
 }
  const signup = async (values, loginProvider) => {
    try {
      let response = null;
      if (loginProvider === 'google') {
        response = await Axios.post('/api/loginWithGoogle', {
          AuthToken: values.credential,
          });
      }
      else{
         response = await Axios.post('/api/signup', {
          email: values.email,
          password: values.password,
        });
      }
      if (response.status === 200) {
        toast.success('Successfully signed up!');
        signIn({
          token: response.data.token,
          expiresIn: 3600,
          tokenType: "cookie",
          authState: {
            isAuthenticated: true,
            userdata: response.data.user,
            devLinks: response.data.devlink,
          },


        });
      } else if (response.status === 401) {
        toast.error(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
  
    }
  };

  return { authState, login, signup,closeTour,getPreviewData,updateUser };
};

export default useAuth;