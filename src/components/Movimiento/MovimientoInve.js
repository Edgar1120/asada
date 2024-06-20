import React, { useState, useEffect } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import MUIDataTable from "mui-datatables";
import Select from 'react-select';
import Swal from 'sweetalert2';

const url = "http://localhost:4000/movimientoInventario/";

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

export function MovimientoInve() {

    const [movimientos, setMovimiento] = useState([]);
    const [Bodegas, setBodega] = useState([]);
    const [Articulos, setArticulo] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);

    const [optionsArticulos, setOptionsArticulos] = useState([]);
    const [selectedArticulo, setSelectedArticulo] = useState(null);

    const [form, setForm] = useState({
        pIdMovimiento: '',
        pIdArticulo: '',
        pIdBodegaOrigen: '',
        pIdBodegaDestino: '',
        pCantidad: '',
        pTipoMovimiento: '',
        pFecha: ''

    });

    useEffect(() => {
        get();
        getArticulos();
        getBodegas();
    }, []);

    const validateForm = () => {
        if (!form.pIdArticulo || !form.pIdBodegaOrigen || !form.pIdBodegaDestino
            || !form.pCantidad || !form.pTipoMovimiento
        ) {
            Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
            return false;
        }
        return true;
    };

    const get = async () => {
        try {
            const response = await axios.get(url + "getMovimientoInventario");
            setMovimiento(response.data);
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
            const response = await axios.post(url + "agregarMovimientoInventario", form);
            const message = response.data.message;

            if (message === 'Movimiento de inventario agregado correctamente.') {
                toggleModalInsertar();
                get();
                Swal.fire('Movimiento agregado', message, 'success');
            } else {
                Swal.fire('Error', message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo agregar el movimiento', 'error');
            console.log(error.message);
        }
    };

    const peticionPut = async () => {
        if (!validateForm()) return;

        try {
            await axios.put(url + "actualizarMovimientoInventario/" + form.pIdMovimiento, form);
            toggleModalInsertar();
            get();
            Swal.fire('Movimiento actualizado', 'El movimiento se ha actualizado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el movimiento', 'error');
            console.log(error.message);
        }
    };


    const peticionDelete = async () => {
        try {
            await axios.delete(url + "eliminarMovimientoInventario/" + form.pIdMovimiento);
            setModalEliminar(false);
            get();
            Swal.fire('Movimiento eliminado', 'El movimiento se ha eliminado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'El movimiento no se pudo eliminar', 'error');
            console.log(error.message);
        }
    };

    const selectMovimiento = (movimiento) => {
        setForm({
            pIdMovimiento: movimiento.IdMovimiento,
            pIdArticulo: movimiento.IdArticulo,
            pIdBodegaOrigen: movimiento.IdBodegaOrigen,
            pIdBodegaDestino: movimiento.IdBodegaDestino,
            pCantidad: movimiento.Cantidad,
            pTipoMovimiento: movimiento.TipoMovimiento,
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


    const handleDelete = (IdMovimiento) => {
        setForm({ pIdMovimiento: IdMovimiento });
        setModalEliminar(true);
    };

    const handleUpdate = (movimiento) => {
        selectMovimiento(movimiento);
        toggleModalInsertar();
    };

    const handleBodegaOrigenChange = (e) => {
        const selectedBodegaId = e.target.value;
        setForm({
            ...form,
            pIdBodegaOrigen: selectedBodegaId
        });
    };

    const handleBodegaDestinoChange = (e) => {
        const selectedBodegaId = e.target.value;
        setForm({
            ...form,
            pIdBodegaDestino: selectedBodegaId
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
            name: "IdMovimiento",
            label: "Id movimiento"
        },
        {
            name: "NombreArticulo",
            label: "Articulo"
        },
        {
            name: "NombreBodegaOrigen",
            label: "Bodega Origen"
        },
        {
            name: "NombreBodegaDestino",
            label: "Bodega Destino"
        },
        {
            name: "Cantidad",
            label: "Cantidad a pasar"
        },
        {
            name: "TipoMovimiento",
            label: "Tipo movimiento"
        },
        {
            name: "Fecha",
            label: "Fecha"
        },
        {
            name: "acciones",
            label: "Acciones",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    const movimiento = movimientos[dataIndex];
                    return (
                        <>

                            <button className="btn-modal" onClick={() => handleDelete(movimiento.IdMovimiento)}>
                                <span><FontAwesomeIcon icon={faTrashAlt} /></span>
                            </button>

                            <button className="btn-modal" onClick={() => handleUpdate(movimiento)}>
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
            <div className="Movimiento">
                <br />
                <div className="center-content" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn" onClick={() => { setForm(null); setForm({ tipoModal: 'insertar' }); setModalInsertar(true); }}>
                        <span> <FontAwesomeIcon icon={faPlus} /></span>
                    </button>
                </div>

                <br /><br />
                <div className="table-container">
                    <MUIDataTable
                        title={"Movimientos de inventario "}
                        data={movimientos}
                        columns={columns}
                        options={options}
                    />
                </div>


                <Modal isOpen={modalInsertar}>

                    <ModalHeader style={{ display: 'block' }}>
                        <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => toggleModalInsertar()}>x</span>
                        <h1>{form.tipoModal === 'insertar' ? 'Agregar Movimiento' : 'Actualizar Movimiento'}</h1>
                    </ModalHeader>

                    <ModalBody>

                        <div className="form-group">


                            <Select className="custom-input" classNamePrefix="custom-select" value={selectedArticulo} onChange={handleChangeArticulo}
                                options={optionsArticulos} placeholder="Seleccionar Artículo" />

                            <select className="custom-input" name="pIdBodegaOrigen" id="pIdBodegaOrigen" onChange={handleBodegaOrigenChange} value={form ? form.pIdBodegaOrigen : ''}>
                                <option value="">Seleccionar Bodega Origen</option>
                                {Bodegas.map(bodega => (
                                    <option key={bodega.IdBodega} value={bodega.IdBodega}>{bodega.NombreBodega}</option>
                                ))}
                            </select>
                            <br />
                            <select className="custom-input" name="pIdBodegaDestino" id="pIdBodegaDestino" onChange={handleBodegaDestinoChange} value={form ? form.pIdBodegaDestino : ''}>
                                <option value="">Seleccionar Bodega Destino</option>
                                {Bodegas.map(bodega => (
                                    <option key={bodega.IdBodega} value={bodega.IdBodega}>{bodega.NombreBodega}</option>
                                ))}
                            </select>
                            <br />
                            <input className="custom-input" placeholder='Cantidad' type="number" name="pCantidad" id="pCantidad" onChange={handleChange} value={form ? form.pCantidad : ''}
                                onKeyPress={event => {
                                    const allowedChars = /[0-9\b]/;
                                    if (!allowedChars.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }} />
                            <br />
                            <input className="custom-input" placeholder='Tipo Movimiento' type="text" name="pTipoMovimiento" id="pTipoMovimiento" onChange={handleChange} value={form ? form.pTipoMovimiento : ''} />
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

export default MovimientoInve;