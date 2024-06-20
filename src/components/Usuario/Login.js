import React, { useState } from 'react';
import axios from "axios";
import "./Usuario.css";
import Swal from 'sweetalert2';
import { FaLock, FaUser } from "react-icons/fa"
import logo from "../assets/image/Asada.png"

const url = "http://localhost:4000/usuario/";


export function Login() {
  const [form, setForm] = useState({
    pNombre: '',
    pContrasena: '',
  });

  const handleChange = (e) => {
    e.persist();
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const Login = async () => {
    try {
      const response = await axios.post(url + "login", form);
      console.log(response);
      const userData = response.data;
  
      if (userData.IdUsuario) {
        if (userData.Rol === 'Administrador') {
         
          window.location.href = '/Usuario';
        } else if (userData.Rol === 'Usuario') {
         
          window.location.href = '/Bodega';
        }
  
       
        localStorage.setItem('login', 'true');
        
        localStorage.setItem('IdUsuario', userData.IdUsuario);
       
        localStorage.setItem('Rol', userData.Rol);
      } else {
        Swal.fire({
          title: 'Error con las credenciales',
          text: 'Revise sus credenciales',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error en la función login:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error interno del servidor',
        icon: 'error',
      });
    }
  };

  return (

    <>
       <div className='login-background'> 
        <div className='wrapper'>
        <img src={logo} alt="logo" className="logo" />
          <form>
            <h1>Login</h1>
            <div className='input-box'>
              <input placeholder='Nombre de usuario' type="text" name="pNombre" id="pNombre" onChange={handleChange} value={form ? form.pNombre : ''} />
              <FaUser className='icon'/>
            </div>
            <div className='input-box'>
              <input placeholder='Contraseña' type="password" name="pContrasena" id="pContrasena" onChange={handleChange} value={form ? form.pContrasena : ''} />
              <FaLock className='icon'/>
            </div>
          </form>
          <button type='submit' onClick={Login}>Login</button>
        </div>
      </div>
  

    </>


  )

}

export default Login;