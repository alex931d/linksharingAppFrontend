import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSignOut } from 'react-auth-kit'

function Logout() {
    const navigate = useNavigate();
    const signOut = useSignOut()
      const logoutProfile = async( )=>{
        const promise = new Promise(async (resolve, reject) => {
            try {
              const response = await axios.post('/api/logout');
              if (response.status === 200) {
                 resolve();
              } else if (response.status === 500) {
                reject(new Error('bad request!'));
              }
              else {
                reject(new Error('Server error!'));
              }
            } catch (error) {
              reject(error);
            }
          });
          promise.then(()=>{
            signOut();
            navigate('/login');
          })
      }
      useEffect(()=>{
        logoutProfile();
       },[])
    return(
        <>
            <p>logging out</p>
        </>
    )
}
export default Logout;