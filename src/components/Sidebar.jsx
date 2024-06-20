import React, { useState } from "react";
import "../App.css";
import { FaBars, FaUser, FaTruck, FaSignOutAlt } from "react-icons/fa";
import { TbHandMove } from "react-icons/tb";
import { MdOutlineInventory2 } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { MdArticle } from "react-icons/md";
import { MdOutlineCategory } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../components/assets/image/Asada.png"

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const role = localStorage.getItem('Rol'); 

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    const logout = () => {
        localStorage.removeItem('login');
        localStorage.removeItem('IdUsuario');
        localStorage.removeItem('Rol');

        if (window.location.pathname === "/") {
            window.location.reload();
        } else {
            window.location.href = "/";
        }
    };


    const allMenuItems = [
        {
            path: "/Usuario",
            name: "Usuarios",
            icon: <FaUser />,
            roles: ["Administrador"]
        },
        {
            path: "/Bodega",
            name: "Bodega",
            icon: <FaTruck />,
            roles: ["Administrador", "Usuario"]
        },
        {
            path: "/Categoria",
            name: "Categoria",
            icon: <MdOutlineCategory />,
            roles: ["Administrador"]
        },
        {
            path: "/Inventario",
            name: "Inventario",
            icon: <MdOutlineInventory2 />,
            roles: ["Administrador", "Usuario"]
        },
        {
            path: "/Articulo",
            name: "Articulo",
            icon: <MdArticle />,
            roles: ["Administrador", "Usuario"]
        },
        {
            path: "/Movimiento",
            name: "Movimientos",
            icon: <TbHandMove />,
            roles: ["Administrador", "Usuario"]
        },
    ];

    const menuItem = allMenuItems.filter(item => item.roles.includes(role));

    return (
        <div className={`container ${isOpen ? "sidebar-open" : ""}`}>
            <div style={{ width: isOpen ? "250px" : "50px" }} className="sidebar">
                <div className="top_section">
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            display: isOpen ? "block" : "none",
                            width: "110px",
                            height: "90px",
                            borderRadius: "10%",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                            transition: "all 0.3s ease",
                        }}
                    />
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars" onClick={toggle}>
                        <FaBars />
                    </div>
                </div>
                {
                    menuItem.map((item, index) => (
                        <NavLink
                            to={item.path}
                            key={index}
                            className="link"
                            activeClassName="active"
                            onClick={closeSidebar}
                            style={{ textDecoration: "none" }} 
                        >
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                        </NavLink>
                    ))
                }
                <NavLink
                    className="link"
                    onClick={(e) => {
                        e.stopPropagation(); 
                        logout(); 
                    }}
                    style={{ textDecoration: "none" }} 
                >
                    <div className="icon"><FaSignOutAlt /></div>
                    <div style={{ display: isOpen ? "block" : "none" }} className="link_text">Cerrar sesión</div>
                </NavLink>
            </div>
            <main>{children}</main>
        </div>
    );
};

export default Sidebar;