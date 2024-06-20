import React, { useState, useEffect } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import MUIDataTable from "mui-datatables";
import Select from 'react-select';
import Swal from 'sweetalert2';

const url = "http://localhost:4000/inventario/";


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


export function Inventario() {

    const [inventarios, setInventario] = useState([]);
    const [Articulos, setArticulo] = useState([]);
    const [Bodegas, setBodega] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);

    const [form, setForm] = useState({
        pIdInventario: '',
        pIdArticulo: '',
        pIdBodega: '',
        pCantidadStock: '',
        pUmbralMinimo: ''
    });

    const [optionsArticulos, setOptionsArticulos] = useState([]);
    const [selectedArticulo, setSelectedArticulo] = useState(null);

    useEffect(() => {
        get();
        getArticulos();
        getBodegas();
    }, []);

    const validateForm = () => {
        if (!form.pIdArticulo || !form.pIdBodega || !form.pUmbralMinimo
        ) {
            Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
            return false;
        }
        return true;
    };

    const get = async () => {
        try {
            const response = await axios.get(url + "getInventario");
            setInventario(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const getArticulos = async () => {
        try {
            const response = await axios.get("http://localhost:4000/articulo/getArticulo");
            setArticulo(response.data);

            const options = response.data.map(articulo => ({
                value: articulo.IdArticulo,
                label: articulo.Nombre
            }));
            setOptionsArticulos(options);
        } catch (error) {
            console.log(error.message);
        }
    };

    const getBodegas = async () => {
        try {
            const response = await axios.get("http://localhost:4000/bodega/getBodega");
            setBodega(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const peticionPost = async () => {
        if (!validateForm()) return;
        try {
            await axios.post(url + "agregarInventario", form);
            toggleModalInsertar();
            get();
            Swal.fire('Inventario agregado', 'El inventario se ha agregado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo agregar el inventario', 'error');
            console.log(error.message);
        }
    };

    const peticionPut = async () => {
        if (!validateForm()) return;

        try {
            await axios.put(url + "actualizarInventario/" + form.pIdInventario, form);
            toggleModalInsertar();
            get();
            Swal.fire('Inventario actualizado', 'El inventario se ha actualizado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el inventario', 'error');
            console.log(error.message);
        }
    };

    const peticionDelete = async () => {
        try {
            await axios.delete(url + "eliminarInventario/" + form.pIdInventario);
            setModalEliminar(false);
            get();
            Swal.fire('Inventario eliminado', 'El inventario se ha eliminado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'El inventario no se pudo eliminar', 'error');
            console.log(error.message);
        }
    };

    const selectEstado = (inventario) => {
        setForm({
            pIdInventario: inventario.IdInventario,
            pIdArticulo: inventario.IdArticulo,
            pIdBodega: inventario.IdBodega,
            pCantidadStock: inventario.CantidadStock,
            pUmbralMinimo: inventario.UmbralMinimo,
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

    const handleDelete = (IdInventario) => {
        setForm({ pIdInventario: IdInventario });
        setModalEliminar(true);
    };

    const handleUpdate = (inventario) => {
        selectEstado(inventario);
        toggleModalInsertar();
    };

    const handleBodegaChange = (e) => {
        const selectedBodegaId = e.target.value;
        setForm({
            ...form,
            pIdBodega: selectedBodegaId
        });
    };

    const handleChangeArticulo = (selectedOption) => {
        setSelectedArticulo(selectedOption);
        setForm({
            ...form,
            pIdArticulo: selectedOption.value
        });
    };






    const columns = [
        {
            name: "IdInventario",
            label: "Id inventrio"
        },
        {
            name: "NombreArticulo",
            label: "Articulo"
        },
        {
            name: "NombreBodega",
            label: "Bodega"
        },
        {
            name: "CantidadStock",
            label: "Stock"
        },
        {
            name: "UmbralMinimo",
            label: "Umbral Minimo"
        },
        {
            name: "acciones",
            label: "Acciones",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    const inventario = inventarios[dataIndex];
                    return (
                        <>

                            <button className="btn-modal" onClick={() => handleDelete(inventario.IdInventario)}>
                                <span><FontAwesomeIcon icon={faTrashAlt} /></span>
                            </button>

                            <button className="btn-modal" onClick={() => handleUpdate(inventario)}>
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
            <div className="Inventario">
                <br />
                <div className="center-content" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn" onClick={() => { setForm(null); setForm({ tipoModal: 'insertar' }); setModalInsertar(true); }}>
                        <span> <FontAwesomeIcon icon={faPlus} /></span>
                    </button>
                </div>

                <br /><br />
                <div className="table-container">
                    <MUIDataTable
                        title={"Inventario "}
                        data={inventarios}
                        columns={columns}
                        options={options}

                    />
                </div>


                <Modal isOpen={modalInsertar}>

                    <ModalHeader style={{ display: 'block' }}>
                        <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => toggleModalInsertar()}>x</span>
                        <h1>{form.tipoModal === 'insertar' ? 'Agregar Inventario' : 'Actualizar Inventario'}</h1>
                    </ModalHeader>

                    <ModalBody>

                        <div className="form-group">


                            <br />
                            <Select
                                className="custom-input"
                                classNamePrefix="custom-select"
                                value={selectedArticulo}
                                onChange={handleChangeArticulo}
                                options={optionsArticulos}
                                placeholder="Seleccionar Artículo"
                            />

                            <br />
                            <select className="custom-input" name="pIdBodega" id="pIdBodega" onChange={handleBodegaChange} value={form ? form.pIdBodega : ''}>
                                <option value="">Seleccionar Bodega</option>
                                {Bodegas.map(bodega => (
                                    <option key={bodega.IdBodega} value={bodega.IdBodega}>{bodega.NombreBodega}</option>
                                ))}
                            </select>
                            <br />
                            <br />

                            <input className="custom-input" placeholder='Umbral Minimo' type="number" name="pUmbralMinimo" id="pUmbralMinimo" onChange={handleChange} value={form ? form.pUmbralMinimo : ''}
                                onKeyPress={event => {
                                    const allowedChars = /[0-9\b]/;
                                    if (!allowedChars.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }} />
                            <br />
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
                        Estás seguro que deseas eliminar Inventario
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






    )





}




export default Inventario;

