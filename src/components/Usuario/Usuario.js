import React, { useState, useEffect } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import MUIDataTable from "mui-datatables";
import Swal from 'sweetalert2';

import "./Usuario.css";

const url = "http://localhost:4000/usuario/";
const options = {
    selectableRows: false,
    responsive: "standard",
    pagination: true,
    rowsPerPage: 5,
    textLabels: {
        body: {
            noMatch: "No se han encontrado resultados con los datos digitados",
            toolTip: "Ordenar",
        },
        toolbar: {
            search: "Buscar",
            downloadCsv: "Descargar CSV",
            print: "Imprimir",
            viewColumns: "Ver Columnas",
            filterTable: "Filtrar Tabla",
        },
        filter: {
            all: "Todos",
            title: "Filtros",
            reset: "Reiniciar",
        },
        viewColumns: {
            title: "Mostrar Columnas",
            titleAria: "Mostrar/Ocultar Columnas",
        },
        selectedRows: {
            text: "Fila(s) seleccionada",
            delete: "Eliminar",
            deleteAria: "Eliminar Columna Seleccionada",
        },
        pagination: {
            next: "Siguiente Página",
            previous: "Anterior Página",
            rowsPerPage: "Filas por página:",
            displayRows: "de"
        }
    },
    rowsPerPageOptions: [5, 10, 15]
};

export function Usuario() {

    const [usuarios, setUsuarios] = useState([]);
    const [aduits, setAudit] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [modalAudit, setModalAudit] = useState(false);

    const [form, setForm] = useState({
        pIdUsuario: '',
        pNombre: '',
        pContrasena: '',
        pRol: ''
    });

    useEffect(() => {
        get();
        getAudit();
    }, []);

    const get = async () => {
        try {
            const response = await axios.get(url + "getUsuario");
            setUsuarios(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const getAudit = async () => {
        try {
            const response = await axios.get(url + "getAuditFecha");
            setAudit(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const validateForm = () => {
        if (!form.pNombre || !form.pContrasena || !form.pRol) {
            Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
            return false;
        }
        return true;
    };

    const peticionPost = async () => {
        if (!validateForm()) return;

        try {
            await axios.post(url + "agregarUsuario", form);
            toggleModalInsertar();
            get();
            Swal.fire('Usuario agregado', 'El usuario se ha agregado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo agregar el usuario', 'error');
            console.log(error.message);
        }
    };

    const peticionPut = async () => {
        if (!validateForm()) return;

        try {
            await axios.put(url + "actualizarUsuario/" + form.pIdUsuario, form);
            toggleModalInsertar();
            get();
            Swal.fire('Usuario actualizado', 'El usuario se ha actualizado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
            console.log(error.message);
        }
    };

    const peticionDelete = async () => {
        try {
            const response = await axios.delete(url + "eliminarUsuario/" + form.pIdUsuario);
            const { message } = response.data;
    
            if (message === 'No se puede eliminar un usuario con rol de administrador.') {
                Swal.fire('Error', message, 'error');
            } else if (message === 'El Usuario no existe.') {
                Swal.fire('Error', message, 'error');
            } else {
                Swal.fire('Usuario eliminado', message, 'success');
                setModalEliminar(false);
                get();
            }
        } catch (error) {
            Swal.fire('Error', 'El usuario no se pudo eliminar', 'error');
            console.log(error.message);
        }
    };

    const selectUsuario = (usuario) => {
        setForm({
            pIdUsuario: usuario.IdUsuario,
            pNombre: usuario.Nombre,
            pContrasena: usuario.Contrasena,
            pRol: usuario.Rol,
            tipoModal: 'actualizar'
        });
    };

    const toggleModalInsertar = () => {
        setModalInsertar(!modalInsertar);
    };

    const toggleModalAudit = () => {
        setModalAudit(!modalAudit);
    };


    const handleChange = async (e) => {
        e.persist();
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
    const handleDelete = (idUsuario) => {
        setForm({ pIdUsuario: idUsuario });
        setModalEliminar(true);
    };

    const handleUpdate = (usuario) => {
        selectUsuario(usuario);
        toggleModalInsertar();
    };

    const aduitColumns = [
        {
            name: "IdAuditoria",
            label: "Id Auditoria"
        },
        {
            name: "FechaHora",
            label: "Fecha"
        },
        {
            name: "Rol",
            label: "Rol"
        },
        {
            name: "Usuario",
            label: "Usuario"
        },
        {
            name: "TablaAfectada",
            label: "cuadro afectado"
        },
        {
            name: "Accion",
            label: "Accion"
        },
        {
            name: "IdAfectado",
            label: "Id afectado "
        },
    ]

    const columns = [
        {
            name: "IdUsuario",
            label: "Id"
        },
        {
            name: "Nombre",
            label: "Nombre"
        },
        {
            name: "Contrasena",
            label: "Contrasena",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    const usuario = usuarios[dataIndex];
                    const passwordMasked = '*'.repeat(usuario.Contrasena.length);
                    return passwordMasked;
                }
            }
        },
        {
            name: "Rol",
            label: "Rol"
        },
        {
            name: "acciones",
            label: "Acciones",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    const usuario = usuarios[dataIndex];
                    return (
                        <>

                            <button className="btn-modal" onClick={() => handleDelete(usuario.IdUsuario)}>
                                <span><FontAwesomeIcon icon={faTrashAlt} /></span>
                            </button>

                            <button className="btn-modal" onClick={() => handleUpdate(usuario)}>
                                <span><FontAwesomeIcon icon={faEdit} /> </span>
                            </button>
                        </>
                    );
                }
            }
        }

    ]

    return (
        <>

            <div className="Usuario">
                <br />
                <div className="center-content">

                    <button className="btn" onClick={() => { setModalAudit(true); }}>
                        <span><FontAwesomeIcon icon={faEye} /></span>
                    </button>
                    <button className="btn" onClick={() => { setForm(null); setForm({ tipoModal: 'insertar' }); setModalInsertar(true); }}>
                        <span><FontAwesomeIcon icon={faPlus} /></span>
                    </button>
                </div>
                <br />
                <div className="table-container">
                    <MUIDataTable
                        title={"Usuarios "}
                        data={usuarios}
                        columns={columns}
                        options={options}
                    />
                </div>
                <Modal isOpen={modalInsertar}>

                    <ModalHeader style={{ display: 'block' }}>
                        <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => toggleModalInsertar()}>x</span>
                        <h1>{form.tipoModal === 'insertar' ? 'Agregar Usuario' : 'Actualizar Usuario'}</h1>
                    </ModalHeader>

                    <ModalBody>

                        <div className="form-group">

                            <input className="custom-input" placeholder='Nombre' type="text" name="pNombre" id="pNombre" onChange={handleChange} value={form ? form.pNombre : ''} required />
                            <br />
                            <br />
                            <input className="custom-input" placeholder='Contraseña' type="password" name="pContrasena" id="pContrasena" onChange={handleChange} value={form ? form.pContrasena : ''} required />
                            <br />
                            <br />
                            <select className="custom-input" name="pRol" id="pRol" onChange={handleChange} value={form ? form.pRol : ''} required>
                                <option value="">Seleccionar Rol</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Usuario">Usuario</option>
                            </select>

                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {form.tipoModal === 'insertar' ?
                            <button className="btn-modal " onClick={() => peticionPost()}>
                                <span>Insertar</span>
                            </button> :
                            <button className="btn-modal " onClick={() => peticionPut()}>
                                <span>Actualizar</span>
                            </button>
                        }
                        <button className="btn-modal" onClick={() => setModalInsertar(false)}><span>Cancelar</span></button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalEliminar}>
                    <ModalBody>
                        Estás seguro que deseas eliminar el Usuario {form && form.pNombre}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn-modal" onClick={() => peticionDelete()}>
                            <span>Sí</span>
                        </button>
                        <button className="btn-modal" onClick={() => setModalEliminar(false)}>
                            <span>No</span>
                        </button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalAudit} size="xl">
                    <ModalHeader style={{ display: 'block' }}>
                        <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => toggleModalAudit()}>x</span>
                        <h1>Auditoria </h1>
                    </ModalHeader>
                    <ModalBody>
                       
                        {aduits.length > 0 && (
                            <div className="table-container" style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
                                <MUIDataTable
                                    title={"Auditoria"}
                                    data={aduits}
                                    columns={aduitColumns}
                                    options={options}
                                />
                            </div>
                        )}
                    </ModalBody>
                </Modal>
            </div>
        </>
    )

}

export default Usuario;