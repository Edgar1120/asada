import React, { useState, useEffect } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import MUIDataTable from "mui-datatables";
import Swal from 'sweetalert2';

const url = "http://localhost:4000/categoria/";


export function Categoria() {

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
        rowsPerPageOptions: [5, 10, 15],
        setRowProps: (row, dataIndex, rowIndex) => {
            return {
                style: {
                    backgroundColor: categorias[dataIndex].Estado === "Categoría Desactivada" ? '#e0e0e0' : 'white',
                    color: categorias[dataIndex].Estado === "Categoría Desactivada" ? '#757575' : 'black'
                }
            };
        }
    };

    const [categorias, setCategoria] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);

    const [form, setForm] = useState({
        pIdCategoria: '',
        pNombreCategoria: '',
        pDescripcionCategoria: '',
        pNombreCorto: '',
        pFechaCreacion: '',
        pEstado: '',
        pDetallesAdicionales: ''
    });

    useEffect(() => {
        get();
    }, []);

    const validateForm = () => {
        if (!form.pNombreCategoria || !form.pDescripcionCategoria || !form.pNombreCorto
             || !form.pEstado || !form.pDetallesAdicionales
        ) {
            Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
            return false;
        }
        return true;
    };

    const get = async () => {
        try {
            const response = await axios.get(url + "getCategoria");
            setCategoria(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const peticionPost = async () => {
        if (!validateForm()) return;
        try {
            await axios.post(url + "agregarCategoria", form);
            toggleModalInsertar();
            get();
            Swal.fire('Categoria agregada', 'La categoria se ha agregado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo agregar la categoria', 'error');
            console.log(error.message);
        }
    };

    const peticionPut = async () => {
        if (!validateForm()) return;

        try {
            await axios.put(url + "actualizarCategoria/" + form.pIdCategoria, form);
            toggleModalInsertar();
            get();
            Swal.fire('Categoria actualizada', 'La categoria se ha actualizado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar la categoria', 'error');
            console.log(error.message);
        }
    };

    const peticionDelete = async () => {
        try {
            await axios.delete(url + "eliminarCategoria/" + form.pIdCategoria);
            setModalEliminar(false);
            get();
            Swal.fire('Categoria eliminada', 'La categoria se ha eliminado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'La categoria no se pudo eliminar', 'error');
            console.log(error.message);
        }
    };


    const selectCategoria = (categoria) => {
        setForm({
            pIdCategoria: categoria.IdCategoria,
            pNombreCategoria: categoria.NombreCategoria,
            pDescripcionCategoria: categoria.DescripcionCategoria,
            pNombreCorto: categoria.NombreCorto,
            pEstado: categoria.Estado,
            pDetallesAdicionales: categoria.DetallesAdicionales,
            tipoModal: 'actualizar'
        });
    };

    const toggleModalInsertar = () => {
        setModalInsertar(!modalInsertar);
    };

    const handleChange = async (e) => {
        e.persist();
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleDelete = (IdCategoria) => {
        setForm({ pIdCategoria: IdCategoria });
        setModalEliminar(true);
    };
    const handleUpdate = (categoria) => {
        selectCategoria(categoria);
        toggleModalInsertar();
    };

    const columns = [
        {
            name: "IdCategoria",
            label: "Id Categoria"
        },
        {
            name: "NombreCategoria",
            label: "Nombre Categoria"
        },
        {
            name: "DescripcionCategoria",
            label: "Descripcion"
        },
        {
            name: "NombreCorto",
            label: "Nombre Corto"
        },
        {
            name: "FechaCreacion",
            label: "Fecha"
        },
        {
            name: "Estado",
            label: "Estado",
            options: {
                customBodyRender: (value) => {
                    return value === "Desactivado" ? "Categoría Desactivada" : value;
                }
            }
        },
        {
            name: "DetallesAdicionales",
            label: "Detalles"
        },
        {
            name: "acciones",
            label: "Acciones",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    const categoria = categorias[dataIndex];
                    return (
                        <>
                            <button
                                className="btn-modal"
                                onClick={() => handleDelete(categoria.IdCategoria)}
                                disabled={categoria.Estado === "Categoría Desactivada"}
                            >
                                <span><FontAwesomeIcon icon={faTrashAlt} /></span>
                            </button>

                            <button
                                className="btn-modal"
                                onClick={() => handleUpdate(categoria)}
                            >
                                <span><FontAwesomeIcon icon={faEdit} /> </span>
                            </button>
                        </>
                    );
                }
            }
        }
    ];

    return (
        <>
            <div className="Categoria">
                <br />
                <div className="center-content" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn" onClick={() => { setForm(null); setForm({ tipoModal: 'insertar' }); setModalInsertar(true); }}>
                        <span> <FontAwesomeIcon icon={faPlus} /></span>
                    </button>
                </div>

                <br /><br />
                <div className="table-container">
                    <MUIDataTable
                        title={"Categorias "}
                        data={categorias}
                        columns={columns}
                        options={options}
                    />
                </div>

                <Modal isOpen={modalInsertar}>
                    <ModalHeader style={{ display: 'block' }}>
                        <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => toggleModalInsertar()}>x</span>
                        <h1>{form.tipoModal === 'insertar' ? 'Agregar Categoria' : 'Actualizar Categoria'}</h1>
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group">
                            <input
                                className="custom-input"
                                placeholder='Nombre Categoria'
                                type="text"
                                name="pNombreCategoria"
                                id="pNombreCategoria"
                                onChange={handleChange}
                                value={form ? form.pNombreCategoria : ''}
                            />
                            <br />
                            <input
                                className="custom-input"
                                placeholder='Descripcion'
                                type="text"
                                name="pDescripcionCategoria"
                                id="pDescripcionCategoria"
                                onChange={handleChange}
                                value={form ? form.pDescripcionCategoria : ''}
                            />
                            <br />
                            <input
                                className="custom-input"
                                placeholder='Nombre Corto'
                                type="text"
                                name="pNombreCorto"
                                id="pNombreCorto"
                                onChange={handleChange}
                                value={form ? form.pNombreCorto : ''}
                            />
                            <br />
                           
                      
                            <select
                                className="custom-input"
                                name="pEstado"
                                id="pEstado"
                                onChange={handleChange}
                                value={form ? form.pEstado : ''}
                            >
                                <option value="">Seleccione Estado</option>
                                <option value="Activo">Activo</option>
                                <option value="Desactivado">Desactivado</option>
                            </select>
                            <br />
                            <input
                                className="custom-input"
                                placeholder='Detalles'
                                type="text"
                                name="pDetallesAdicionales"
                                id="pDetallesAdicionales"
                                onChange={handleChange}
                                value={form ? form.pDetallesAdicionales : ''}
                            />
                            <br />
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
                        Estás seguro que deseas eliminar esta Categoria {form && form.pNombreCategoria}
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
            </div>
        </>
    );


}


export default Categoria;